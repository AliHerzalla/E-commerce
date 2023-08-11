const connection = require("../db.js");
const { v4: uuidv4 } = require("uuid");

const insertPropertyNameQuery = "INSERT INTO properties_name (category_id,property_name,property_id) VALUES (?,?,?)";
const deletePropertyNameQuery = "DELETE FROM properties_name WHERE property_id = ?";
const insertPropertyValueQuery = "INSERT INTO properties_values (property_name_id,property_value,property_value_id) VALUES (?,?,?)";


const handelAddNewPropertiesNames = (req, res) => {
    const { properties, categoryId } = req.body;

    const propertiesNames = properties.map(propName => propName.name);
    const propertiesValues = properties.map(propValue => propValue.values);

    const promises = propertiesNames.map((name, index) => {
        return new Promise((resolve, reject) => {
            const propertyNameId = uuidv4();
            const values = [categoryId, name, propertyNameId];
            connection.execute(insertPropertyNameQuery, values, (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: "Something went wrong" });
                    reject(error);
                } else {
                    new Promise((resolve, reject) => {
                        const singlePropertyValues = propertiesValues[index].split(",");
                        singlePropertyValues.map(value => {
                            const singlePropertyValueId = uuidv4();
                            const values = [propertyNameId, value, singlePropertyValueId];
                            connection.execute(insertPropertyValueQuery, values, (error, result) => {
                                if (error) {
                                    console.log(error);
                                    res.status(400).json({ message: "Something went wrong" });
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            });
                        });
                    });
                    resolve(result);
                }
            });
        });
    });

    return Promise.all(promises).then(() => {
        return res.status(200).json({ message: "Properties saved" });
    }).catch((error) => {
        console.error(error);
        return res.status(500).json({ message: "Error saving properties" });
    });
};

// Edit properties function


module.exports = {
    handelAddNewPropertiesNames,
};