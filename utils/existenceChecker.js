const Admin = require("../model/administration.model");
const Ambassador = require("../model/ambassador.model");
const Newsletter = require("../model/newsletter.model");
const { Property } = require("../model/property.model");
const Realtor = require("../model/realtor.model");

// ===================== REALTOR SECTION ==================== //
const realtorEmailExists = email => Realtor.findOne({email})
const realtorPhoneExists = phone => Realtor.findOne({phone})
const gettingRealtorById = id => Realtor.findById(id)

// ===================== AMBASSADOR SECTION ==================== //
const ambassadorEmailExists = email => Ambassador.findOne({email})
const ambassadorPhoneExists = phone => Ambassador.findOne({phone})

// ======================== NEWSLETTER SECTION ====================== //
const newsletterEmailExists = email => Newsletter.findOne({email})

// =========================== PROPERTY CORNER ============================ //
const isPropertyExists = id => Property.findById(id)
const propertyByPosterId = posterId => Property.findOne({posterId})

// ========================= ADMIN SETCION ============================== //
const isAdminEmailExists = email => Admin.findOne({email})
const gettingAdminById = id => Admin.findById(id)

module.exports = { realtorEmailExists, realtorPhoneExists, ambassadorEmailExists, ambassadorPhoneExists, gettingRealtorById, newsletterEmailExists, isPropertyExists, isAdminEmailExists, gettingAdminById, propertyByPosterId }