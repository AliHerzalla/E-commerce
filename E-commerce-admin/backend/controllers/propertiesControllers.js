const connection = require("../db.js");
const { v4: uuidv4 } = require("uuid");

const insertPropertyNameQuery = "INSERT INTO properties_name (category_id,property_name,property_id) VALUES (?,?,?)";
const deletePropertyNameQuery = "DELETE FROM properties_name WHERE property_id = ?";
const insertPropertyValueQuery = "INSERT INTO properties_values (property_name_id,property_value,property_value_id) VALUES (?,?,?)";
const getSpecificPropertiesQuery = "SELECT property_name,property_id FROM properties_name WHERE category_id = ?";
const selectPropertiesValuesQuery = "SELECT property_value FROM properties_values WHERE property_name_id = ?";


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

const handelEditExistingProperties = (req, res) => {

};

const handelGetSpecificProperties = (req, res) => {
    const { id } = req.params;
    const values = [id];
    connection.execute(getSpecificPropertiesQuery, values, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(400).json({ message: "Error getting properties" });
        }
        const propertiesPromises = result.map((property, index) => {
            return new Promise((resolve, reject) => {
                const propValues = [property.property_id];
                connection.execute(selectPropertiesValuesQuery, propValues, (error, resultValuesArray) => {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        let concatString = "";
                        resultValuesArray.map((val, index) => {
                            concatString += val.property_value + (index == resultValuesArray.length - 1 ? "" : ",");
                        });
                        resolve({ name: property.property_name, values: concatString });
                    }
                });
            });
        });

        Promise.all(propertiesPromises)
            .then((properties) => {
                return res.status(200).json({ message: "Success getting properties", result: properties });
            })
            .catch((error) => {
                console.error(error);
                return res.status(404).json({ message: "Couldn't find properties" });
            });
    });
};

module.exports = {
    handelAddNewPropertiesNames,
    handelEditExistingProperties,
    handelGetSpecificProperties,
};