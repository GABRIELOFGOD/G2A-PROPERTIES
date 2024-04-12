const Admin = require("../model/administration.model");
const Ambassador = require("../model/ambassador.model");
const Contact = require("../model/contact.model");
const Newsletter = require("../model/newsletter.model");
const {Property, InspectProperty} = require("../model/property.model");
const Realtor = require("../model/realtor.model");

// ========================== AMBASSADOR ====================== //
const AmbassadorCreator = details => Ambassador.create(details)

// ====================== REALTOR ======================== //
const RealtorCreator = details => Realtor.create(details)

// ======================= PROPERTY ========================== //
const propertyCreator = details => Property.create(details)

// ============================ NEWSLETTER ========================== //
const newsletterCreator = email => Newsletter.create({email})

// ==================== CONTACT ======================== //
const contactCreator = details => Contact.create(details)

// ======================== INSPECT PROPERTY ========================= //
const propertyInspectCreator = details => InspectProperty.create(details)

// ========================= ADMIN ========================= //
const adminCreator = details => Admin.create(details)

module.exports = { AmbassadorCreator, RealtorCreator, propertyCreator, newsletterCreator, contactCreator, propertyInspectCreator, adminCreator }
