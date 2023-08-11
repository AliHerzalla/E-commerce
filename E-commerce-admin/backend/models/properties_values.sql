-- properties_values TABLE

CREATE TABLE properties_values(
    property_name_id VARCHAR(255) NOT NULL,
	property_value_id VARCHAR(255) NOT NULL,
    property_value VARCHAR(255),
    FOREIGN KEY (property_name_id) 
		REFERENCES properties_name(property_id) ON DELETE CASCADE
);