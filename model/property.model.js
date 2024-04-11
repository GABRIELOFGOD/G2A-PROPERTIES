const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const propertySchema = new mongoose.Schema({
    name:String,
    address: String,
    about:String,
    price:String,
    images: [String],
    square_meter: Number,
    parking_lot: Number,
    number_of_bedroom: Number,
    status: {
      type: String,
      default: 'listed'
    },
    postedBy:{
      type: mongoose.Types.ObjectId,
      ref: 'Realtor'
    }
},{timestamps: true});

const propertyInspectionSchema = new mongoose.Schema({
  name:String,
  time: String,
  date: Date,
  email: String,
  phone: String,
  address: String,
  property: {
    type: mongoose.Types.ObjectId,
    ref: 'Property'
  }
}, {timestamps: true})

const InspectProperty = mongoose.model('InspectProperty', propertyInspectionSchema)
const Property = mongoose.model('Property', propertySchema);

module.exports = {Property, InspectProperty}