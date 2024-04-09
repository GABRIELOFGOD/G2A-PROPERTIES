const Ambassador = require("../model/ambassador.model");
const Property = require("../model/property.model");
const Realtor = require("../model/realtor.model");

const AmbassadorCreator = details => Ambassador.create(details)

const RealtorCreator = details => Realtor.create(details)

const propertyCreator = details => Property.create(details)

module.exports = { AmbassadorCreator, RealtorCreator, propertyCreator }
