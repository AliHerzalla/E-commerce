require("dotenv").config();
const connection = require("../db.js");

const insertNewCategoryQuery = "INSERT INTO categories (category_name,parent_category,category_id) VALUES (?,?,?)";
const updateCategoryQuery = "UPDATE categories SET category_name = ? ,parent_category = ? WHERE category_id = ?";
const deleteCategoryQuery = "DELETE FROM categories WHERE category_id = ?";
const getAllCategoriesQuery = "SELECT * FROM categories";

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

module.exports = {
    handelCreateNewCategory,
    handelGetAllCategories,
    handelEditCategory,
    handelDeleteCategory
};