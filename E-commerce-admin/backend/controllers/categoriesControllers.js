require("dotenv").config();
const CategoriesModel = require("../models/categories.js");
const PropertiesModel = require("../models/properties.js");

const handelCreateNewCategory = async (req, res) => {
    const { categoryName, parentCategory } = req.body;
    const { id } = req.params;

    try {
        const CategoriesDoc = await CategoriesModel.create({
            category_id: id,
            category_name: categoryName,
            parent_category: parentCategory,
        });
        if (CategoriesDoc) {
            return res.status(200).json({
                message: "Category has been created successfully",
                result: CategoriesDoc,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong, please try again later"
        });
    }
};

const handelEditCategory = async (req, res) => {
    const { categoryName, parentCategory } = req.body;
    const { id } = req.params;

    try {
        const CategoriesDoc = await CategoriesModel.findOneAndUpdate(
            { category_id: id },
            {
                category_name: categoryName,
                parent_category: parentCategory,
            });
        if (CategoriesDoc) {
            res.status(200).json({ message: "Category has been updated successfully" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const handelDeleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const CategoriesDoc = await CategoriesModel.findOneAndRemove({ category_id: id });
        if (CategoriesDoc) {
            res.status(200).json({
                message: "Category has been deleted successfully"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Error deleting category"
        });
    }
};

const handelGetAllCategories = async (req, res) => {
    try {
        const CategoriesDoc = await CategoriesModel.find({});
        if (CategoriesDoc) {
            res.status(200).json({
                message: "Categories",
                result: CategoriesDoc
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong, please try again later" });
    }
};

const handelEditProperties = async (req, res) => {
    const { id } = req.params;
    const { properties } = req.body;
    let editedProperties;
    if (typeof properties != typeof Array()) {
        editedProperties = properties.map(prop => {
            return { name: prop.name, values: prop.values.split(',') };
        });
    }

    try {
        const PropertiesDoc = await PropertiesModel.find({ category_id: id });
        if (PropertiesDoc.length > 0) {
            const updatedPropertiesDoc = await PropertiesModel.findOneAndUpdate({ category_id: id }, { properties: editedProperties || properties });
            if (updatedPropertiesDoc) {
                res.status(200).json({ message: "Properties has been updated successfully" });
            }
        } else {
            const createdPropertiesDoc = await PropertiesModel.create({
                category_id: id,
                properties: editedProperties
            });
            if (createdPropertiesDoc) {
                res.status(200).json({ message: "Properties has been created successfully" });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

};

const handelGetSelectedCategory = async (req, res) => {
    const { parentId, categoryId } = req.body;
    let arrayOfProperties = [];
    if (parentId != "0") {
        try {
            const ParentCategoriesDoc = await CategoriesModel.find({ category_id: parentId });
            if (ParentCategoriesDoc.length > 0) {
                const ChildCategoriesDoc = await CategoriesModel.find({ category_id: categoryId });
                const ParentCategoriesProperties = await PropertiesModel.find({ category_id: ParentCategoriesDoc[0].category_id });
                if (ParentCategoriesProperties) {
                    const ChildCategoriesPropertiesPromises = ChildCategoriesDoc.map(async (category) => {
                        return await PropertiesModel.find({ category_id: category.category_id });
                    });

                    const ChildCategoriesProperties = await Promise.all(ChildCategoriesPropertiesPromises);
                    //TODO: find the all values
                    // console.log(ChildCategoriesProperties[0][0].properties);
                    const allPropertiesArray = [...ChildCategoriesProperties[0], ...ParentCategoriesProperties];

                    const allProperties = allPropertiesArray.map((property) => {
                        return property.properties;
                    });
                    for (const array of allProperties) {
                        arrayOfProperties.push(...array);
                    }

                    return res.status(200).json({ message: "Properties are getting successfully", result: arrayOfProperties });
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    } else {
        try {
            const ParentCategoriesDoc = await CategoriesModel.find({ category_id: categoryId });
            if (ParentCategoriesDoc.length > 0) {
                const ParentPropertiesDoc = await PropertiesModel.find({ category_id: categoryId });
                if (ParentPropertiesDoc) {
                    return res.status(200).json({ message: "Properties are getting successfully", result: ParentPropertiesDoc[0].properties });
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }
};

module.exports = {
    handelCreateNewCategory,
    handelGetAllCategories,
    handelEditCategory,
    handelDeleteCategory,
    handelEditProperties,
    handelGetSelectedCategory
};