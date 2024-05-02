const Admin = require("../model/administration.model");
const Newsletter = require("../model/newsletter.model");
const { Property } = require("../model/property.model");
const Realtor = require("../model/realtor.model");

// ============================== NESLETTER ========================== //
const allNewsletter = () => Newsletter.find()

// ===================== PROPERTY ===================== //
const listPropertyUpdate = (id) => Property.findByIdAndUpdate(id, {
  status: 'listed'
});
const deletePropertyFunction = id => Property.findByIdAndDelete(id)
const allPropertiesGet = () => Property.find()

// ========================= AMIN ============================ //
// const gettingAdminById = id => Admin.findById(id)
const adminUpdateInfo = (id, info) => Admin.findByIdAndUpdate(id, info)

// ======================= REALTOR ======================== //
const updateRealtorBlock = (id, change) => Realtor.findByIdAndUpdate(id, {
  blocked: change
})

const realtorUpdateInfo = (id, info) => Realtor.findByIdAndUpdate(id, info)

// const realtorUpdateAvaterPhoto = (id, in)

const allRealltorAccount = () => Realtor.find()

module.exports = { allNewsletter, listPropertyUpdate, deletePropertyFunction, allPropertiesGet, updateRealtorBlock, allRealltorAccount, realtorUpdateInfo, adminUpdateInfo }