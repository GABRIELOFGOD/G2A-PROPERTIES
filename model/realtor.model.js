const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const realtorSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    avatar: String,
    company_name: String,
    address: String,
    facebook: String,
    twitter: String,
    instagram: String,
    whatsapp: String,
    linkdin: String,
    blocked: {
      type: Boolean,
      default: true
    },
    password: String,
    properties: [{
      type: mongoose.Types.ObjectId,
      ref: 'Property'
    }],
    role: {
      type: String,
      default: 'realtor'
    }
},{timestamps: true});

//Export the model
const Realtor = mongoose.model('Realtor', realtorSchema);
module.exports = Realtor