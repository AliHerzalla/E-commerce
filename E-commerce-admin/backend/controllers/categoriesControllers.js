require("dotenv").config();
const connection = require("../db.js");
const { v4: uuidv4 } = require("uuid");

const insertNewCategoryQuery = "INSERT INTO categories (category_name,parent_category,category_id) VALUES (?,?,?)";
const updateCategoryQuery = "UPDATE categories SET category_name = ? ,parent_category = ? WHERE category_id = ?";
const deleteCategoryQuery = "DELETE FROM categories WHERE category_id = ?";
const getAllCategoriesQuery = "SELECT * FROM categories";
const getCategoryQuery = "SELECT * FROM categories WHERE category_id = ?";
const insertEditedCategoryQuery = "INSERT INTO categories (category_name,parent_category,category_id) VALUES (?,?,?)";
const insertPropertyNameQuery = "INSERT INTO properties_name (category_id,property_name,property_id) VALUES (?,?,?)";
const insertPropertyValueQuery = "INSERT INTO properties_values (property_name_id,property_value,property_value_id) VALUES (?,?,?)";

let categoryDataToEdit;

const handelCreateNewCategory = (req, res) => {
    const { categoryName, parentCategory } = req.body;
    const { id } = req.params;
    const values = [categoryName, parentCategory, id];
    connection.execute(insertNewCategoryQuery, values, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                message: "Something went wrong, please try again later"
            });
        } else {
            res.status(200).json({
                message: "Category has been created successfully",
                result: result
            });
        }
    });
};

const handelEditCategory = (req, res) => {
    const { categoryName, parentCategory } = req.body;
    const { id } = req.params;
    const values = [categoryName, parentCategory, id];
    connection.execute(updateCategoryQuery, values, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong" });
        } else {
            res.status(200).json({ message: "Category has been updated successfully" });
        }
    });
};

const handelDeleteCategory = (req, res) => {
    const { id } = req.params;
    const values = [id];
    connection.execute(deleteCategoryQuery, values, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({
                message: "Error deleting category"
            });
        } else {
            res.status(200).json({
                message: "Category has been deleted successfully"
            });
        }
    });
};

const handelGetAllCategories = (req, res) => {
    connection.execute(getAllCategoriesQuery, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong, please try again later" });
        } else {
            res.status(200).json({
                message: "Categories",
                result: result
            });
        }
    });

};


const updateProperties = (properties, id, res) => {
    const propertiesNames = properties.map(propName => propName.name);
    const propertiesValues = properties.map(propValue => propValue.values);

    const promises = propertiesNames.map((name, index) => {
        return new Promise((resolve, reject) => {
            const propertyNameId = uuidv4();
            const values = [id, name, propertyNameId];
            connection.execute(insertPropertyNameQuery, values, (error, result) => {
                if (error) {
                    console.log(error);
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

const insertEditedCategory = (values, id, properties, res) => {
    connection.execute(insertEditedCategoryQuery, values, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            updateProperties(properties, id, res);
        }
    });
};

const deleteCategory = (values, id, properties, res) => {
    connection.execute(deleteCategoryQuery, values, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            const values = [categoryDataToEdit[0].category_name, categoryDataToEdit[0].parent_category, categoryDataToEdit[0].category_id];
            insertEditedCategory(values, id, properties, res);
        }
    });
};

const getCategory = (values, id, properties, res) => {
    connection.execute(getCategoryQuery, values, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            categoryDataToEdit = result;
            const values = [id];
            deleteCategory(values, id, properties, res);
        }
    });
};


const handelUpdateProperties = (req, res) => {
    const { id } = req.params;
    const { properties } = req.body;
    // updateProperties(properties);
    const values = [id];
    getCategory(values, id, properties, res);
};

module.exports = {
    handelCreateNewCategory,
    handelGetAllCategories,
    handelEditCategory,
    handelDeleteCategory,
    handelUpdateProperties
};