const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const realtorSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    password: String,
    properties: [{
      type: mongoose.Types.ObjectId,
      ref: 'Property'
    }]
});

//Export the model
const Realtor = mongoose.model('Realtor', realtorSchema);
module.exports = Realtor