const Admin = require("../model/administration.model");
const Ambassador = require("../model/ambassador.model");
const Contact = require("../model/contact.model");
const Newsletter = require("../model/newsletter.model");
const { Property, InspectProperty } = require("../model/property.model");
const Realtor = require("../model/realtor.model");

// ============================== NESLETTER ========================== //
const allNewsletter = () => Newsletter.find()

// ===================== PROPERTY ===================== //
const listPropertyUpdate = (id) => Property.findByIdAndUpdate(id, {
  status: 'listed'
});
const deletePropertyFunction = id => Property.findByIdAndDelete(id)
const allPropertiesGet = () => Property.find()
const getAllInspect = () => InspectProperty.find().populate('property')

// ========================= AMIN ============================ //
// const gettingAdminById = id => Admin.findById(id)
const adminUpdateInfo = (id, info) => Admin.findByIdAndUpdate(id, info)

// ======================= REALTOR ======================== //
const updateRealtorBlock = (id, change) => Realtor.findByIdAndUpdate(id, {
  blocked: change
})

const realtorUpdateInfo = (id, info) => Realtor.findByIdAndUpdate(id, info)

// const realtorUpdateAvaterPhoto = (id, in)

const allRealltorAccount = () => Realtor.find();

// =============== CONTACT ===================== //
const gettingAllContact = () => Contact.find();

// ================= AMBASSADOR ================ //
const gettingAllAmbassador = () => Ambassador.find();

module.exports = { allNewsletter, listPropertyUpdate, deletePropertyFunction, allPropertiesGet, updateRealtorBlock, allRealltorAccount, realtorUpdateInfo, adminUpdateInfo, getAllInspect, gettingAllContact, gettingAllAmbassador }