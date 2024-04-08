const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const ambassadorSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    marketing_experience:String,
    address:String,
    what_to_offer:String,
    social_media:String
});

//Export the model
const Ambassador = mongoose.model('Ambassador', ambassadorSchema);
module.exports = Ambassador;