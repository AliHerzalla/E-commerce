-- products_images TABLE

CREATE TABLE products_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id VARCHAR(100),
  image VARCHAR(500),
  FOREIGN KEY (product_id) REFERENCES products(id) 
  ON DELETE CASCADE
);