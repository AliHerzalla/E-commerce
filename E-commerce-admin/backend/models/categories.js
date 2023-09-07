const mongoose = require('mongoose');
const PropertiesModel = require('./properties');

const CategoriesSchema = new mongoose.Schema({
	category_id: {
		type: String,
		required: true,
		unique: true,
	},
	category_name: {
		type: String,
		required: true,
	},
	parent_category: {
		type: String,
	},
});

const CategoriesModel = mongoose.model('Categories', CategoriesSchema);
module.exports = CategoriesModel;