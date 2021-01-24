CREATE USER IF NOT EXISTS 'sheets'@'localhost' IDENTIFIED BY 'badpassword';
CREATE DATABASE IF NOT EXISTS sheets;
USE sheets;
GRANT ALL ON sheets.* TO 'sheets'@'localhost';
