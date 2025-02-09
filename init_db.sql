DROP DATABASE IF EXISTS sheets;
CREATE DATABASE sheets;
USE sheets;
CREATE TABLE documents(
	id CHAR(80) PRIMARY KEY,
	table_data JSON,
	owner_id CHAR(20),
        name VARCHAR(20)
);
CREATE TABLE users(
	id CHAR(20) PRIMARY KEY,
	facultyNumber int,
	password VARCHAR(20),
	username VARCHAR(10)
);
