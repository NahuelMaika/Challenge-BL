-- Orbital 2.0 - local environment setup (optional, run once before schema.sql)
-- Run as an administrative user (e.g. root) from MySQL Workbench or the mysql CLI.

CREATE DATABASE IF NOT EXISTS orbital
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

-- Least-privilege user for the API: it can only insert and read data.
-- Replace the password before running, and use the same value in backend/.env.
CREATE USER IF NOT EXISTS 'orbital_app'@'localhost' IDENTIFIED BY 'change_me';
GRANT INSERT, SELECT ON orbital.* TO 'orbital_app'@'localhost';
