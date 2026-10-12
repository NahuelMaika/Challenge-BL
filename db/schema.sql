CREATE TABLE IF NOT EXISTS atenciones_orbital (
  id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
  calificacion    TINYINT UNSIGNED    NOT NULL,
  es_urgente      BOOLEAN             NOT NULL,
  tipo_cliente    ENUM('VIP', 'CORPORATIVO', 'REGULAR') NOT NULL,
  prioridad       DECIMAL(4, 2)       NOT NULL,
  fecha_atencion  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT pk_atenciones_orbital PRIMARY KEY (id),
  CONSTRAINT chk_atenciones_calificacion CHECK (calificacion BETWEEN 1 AND 5),
  CONSTRAINT chk_atenciones_prioridad CHECK (prioridad BETWEEN 0 AND 10)
) ENGINE = InnoDB;
