const mongoose = require('mongoose');

const ProductImagesSchema = new mongoose.Schema({
  product_id: {
    type: String,
    ref: "Products",
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
});

const ProductImagesModel = mongoose.model("ProductImages", ProductImagesSchema);

module.exports = ProductImagesModel;