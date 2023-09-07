const { ObjectId } = require('mongodb');
const PropertiesModel = require("../models/properties.js");

const handelAddNewProperties = async (req, res) => {
    const { properties, categoryId } = req.body;
    const newProperties = properties.map(prop => {
        return { name: prop.name, values: prop.values.split(',') };
    });
    try {
        const PropertiesDoc = await PropertiesModel.insertMany({
            category_id: categoryId,
            property_id: new ObjectId(),
            properties: newProperties
        });
        if (PropertiesDoc) {
            res.status(200).json({ message: "Properties saved" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error saving properties" });
    }
};

const handelGetSpecificProperties = async (req, res) => {
    const { id } = req.params;
    try {
        const PropertiesDoc = await PropertiesModel.find({ category_id: id });
        if (PropertiesDoc.length > 0) {
            res.status(200).json({ message: "Success getting properties", result: PropertiesDoc[0].properties });
        } else {
            res.status(200).json({ message: "Success getting properties", result: [] });
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Couldn't find properties" });
    }
};

const handelDeleteProperties = async (req, res) => {
    const { id } = req.params;
    try {
        const PropertiesDoc = await PropertiesModel.findOneAndRemove({ category_id: id });
        if (PropertiesDoc) {
            res.status(200).json({ message: "Properties deleted successfully" });
        } else {
            res.status(200).json({ message: "There is no properties" });
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Couldn't delete properties" });
    }
};

module.exports = {
    handelAddNewProperties,
    handelGetSpecificProperties,
    handelDeleteProperties,
};