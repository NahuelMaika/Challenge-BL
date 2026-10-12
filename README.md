#### 1. ¿La IA detectó la regla de negocio no implementada en el comentario del Java cuando le pasaste el código?

Sí. La IA detectó que el comentario indica que un cliente CORPORATIVO no puede multiplicar su calificación si la atención fue mala (< 3), pero que el código aplica el factor 1.2 sin esa condición.

La regla tiene además una ambigüedad: "los clientes VIP tienen máxima prioridad". Se podria interpretar que VIP con maxima prioridad es que siempre tenga prioridad 10 pero eso iba en contra del comportamiento existente y dejaban de tener peso la calificacion, el factor y la urgencia.
Los 3 campos son claves y pueden servir para estadisticas o metricas.

Por lo que VIP con maxima prioridad son los VIP tienen el mayor factor (1.5) y en el caso de los CORPORATIVOS solo tienen factor 1.2 si su calificacion es mayor o igual a 3.

#### 2. Si le pediste a la IA que te genere la consulta SQL o el componente en React, ¿qué correcciones o ajustes de seguridad/validación tuviste que hacerle manualmente?

Le pedí que generara el componente React y la API, y los revisé antes de aceptarlos:

- **Componente React:** no tuve que corregirlo ya que era un form simple con validaciones comunes. Verifiqué que convirtiera la calificación con `Number()`, porque el `value` de un `<select>` siempre es un string y el backend lo rechazaría y tambien que el checkbox enviara un booleano real.
- **Alcance:** la IA agregó tests unitarios que la consigna no pedía y le pedí que los quitara.

#### 3. Si le pediste el script SQL o la consulta a la IA: ¿Qué tipos de datos o índices te propuso originalmente y qué ajustes le tuviste que hacer para asegurar la integridad de los datos y la seguridad de la consulta?

Diseñé la tabla junto con la IA, decidiendo columna por columna, y después le pedí que escribiera el script:

- **`calificacion`:** propuse `INT`. La IA sugirió `TINYINT UNSIGNED`, que ocupa 1 byte y refleja mejor un dominio de 1 a 5, más un `CHECK (calificacion BETWEEN 1 AND 5)`. Acepté.
- **`prioridad`:** propuse `DECIMAL(4,2)` en lugar de `FLOAT`, para evitar errores de redondeo. La IA señaló que con los factores actuales `DECIMAL(3,1)` alcanza, pero mantuve `(4,2)` para dejar margen si cambian los factores. También sume un `CHECK (prioridad BETWEEN 0 AND 10)`.
- **`tipo_cliente`:** propuse un `ENUM` con un tercer valor, `REGULAR`, para los clientes que no son VIP ni CORPORATIVO, y rechazar con un 400 los valores desconocidos. Esto endurece la validación respecto del legacy, que aceptaba cualquier string con factor 1.0, y el nombre `REGULAR` es un supuesto que habría que confirmar con negocio. La IA me recordó normalizar a mayúsculas antes de validar, para conservar el `equalsIgnoreCase` del Java.
- **`fecha_atencion`:** elegí `TIMESTAMP`, porque la fecha de atención es un instante y MySQL lo guarda normalizado en UTC y lo convierte según la zona horaria de la sesión. La IA me advirtió que su rango termina el 2038-01-19. Si el sistema está pensado para durar, la alternativa es `DATETIME` guardando siempre UTC desde la aplicación.
- **Índices:** solo la PK. El alcance es únicamente el `INSERT`: los índices aceleran las lecturas pero hacen más lentas las escrituras y ocupan espacio, así que sin consultas definidas no aportan.
- **Alcance del script:** la IA incluyó `CREATE DATABASE` y un `CREATE USER` en el script de la tabla, cuando la consigna pedía solo el `CREATE TABLE`. Le pedí separarlos: `db/schema.sql` contiene solo la tabla y `db/setup.sql` es un paso opcional que crea la base y un usuario con permisos mínimos (`INSERT` y `SELECT`), para que la API no se conecte como root.
