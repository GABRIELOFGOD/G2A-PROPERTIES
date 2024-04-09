const Ambassador = require("../model/ambassador.model");
const Realtor = require("../model/realtor.model");

// ===================== REALTOR SECTION ==================== //
const realtorEmailExists = email => Realtor.findOne({email})
const realtorPhoneExists = phone => Realtor.findOne({phone})
const gettingRealtorById = id => Realtor.findById(id)

// ===================== AMBASSADOR SECTION ==================== //
const ambassadorEmailExists = email => Ambassador.findOne({email})
const ambassadorPhoneExists = phone => Ambassador.findOne({phone})

module.exports = { realtorEmailExists, realtorPhoneExists, ambassadorEmailExists, ambassadorPhoneExists, gettingRealtorById }