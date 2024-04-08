const Ambassador = require("../model/ambassador.model");
const Realtor = require("../model/realtor.model");

const AmbassadorCreator = details => Ambassador.create(details)

const RealtorCreator = details => Realtor.create(details)

module.exports = { AmbassadorCreator, RealtorCreator }
