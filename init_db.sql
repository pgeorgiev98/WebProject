DROP DATABASE IF EXISTS sheets;
CREATE DATABASE sheets;
USE sheets;
CREATE TABLE documents(
	id CHAR(80) PRIMARY KEY,
	table_data JSON
);
