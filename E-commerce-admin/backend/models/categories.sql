-- categories TABLE

-- CREATE TABLE categories(
-- 	id INT AUTO_INCREMENT PRIMARY KEY,
-- 	category_name VARCHAR(255) NOT NULL,
-- 	parent_category INT
-- );

CREATE TABLE categories(
	category_id VARCHAR(255) PRIMARY KEY,
	category_name VARCHAR(255) NOT NULL,
	parent_category VARCHAR(255)
);