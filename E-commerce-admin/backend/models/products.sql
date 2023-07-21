-- products TABLE

CREATE TABLE products(
    id VARCHAR(100) PRIMARY KEY,
	product_name VARCHAR(255) NOT NULL,
    product_description VARCHAR(255),
    product_price NUMERIC(7,2) NOT NULL
);