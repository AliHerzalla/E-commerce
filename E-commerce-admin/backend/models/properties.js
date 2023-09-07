const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const PropertiesSchema = new mongoose.Schema({
  category_id: {
    type: String,
    required: true,
    ref: 'Categories',
  },
  property_id: {
    type: ObjectId,
    default: () => new ObjectId(),
    required: true,
    unique: true,
  },
  properties: {
    type: [Object],
    required: true,
  },
});

const PropertiesModel = mongoose.model('Properties', PropertiesSchema);

module.exports = PropertiesModel;