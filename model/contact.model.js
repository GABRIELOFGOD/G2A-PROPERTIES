const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const contactSchema = new mongoose.Schema({
    name: String,
    email:String,
    phone:String,
    address:String,
    message: String
}, {timestamps: true});

//Export the model
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact