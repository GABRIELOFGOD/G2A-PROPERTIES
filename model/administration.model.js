const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    // phone: Number,
    password: String,
    properties: [{
      type: mongoose.Types.ObjectId,
      ref: 'Property'
    }],
    role: {
      type: String,
      default: 'admin'
    },
    blocked: {
      type: Boolean,
      default: false
    }
},{timestamps: true});

//Export the model
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin