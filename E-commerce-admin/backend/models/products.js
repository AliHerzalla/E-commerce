const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    product_name: {
        type: String,
        required: true,
    },
    product_description: {
        type: String,
    },
    product_price: {
        type: Number,
        required: true,
    },
    product_category: {
        type: String,
    },
    product_properties: {
        type: Object,
    }
});

const ProductsModel = mongoose.model("Products", ProductsSchema);

module.exports = ProductsModel;