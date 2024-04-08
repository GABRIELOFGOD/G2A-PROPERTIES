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
    postedBy:{
      type: mongoose.Types.ObjectId,
      ref: 'Realtor'
    }
});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property