USE sheets;

CREATE TABLE users(
	id CHAR(20) PRIMARY KEY,
	facultyNumber int,
	password VARCHAR(6),
	username VARCHAR(10)
);