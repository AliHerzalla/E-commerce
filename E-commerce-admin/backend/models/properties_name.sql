-- properties_name TABLE

CREATE TABLE properties_name(
	category_id VARCHAR(255) NOT NULL,
    property_id VARCHAR(255) PRIMARY KEY,
    property_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES
		categories(category_id) ON DELETE CASCADE
);