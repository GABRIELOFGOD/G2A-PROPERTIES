const Ambassador = require("../model/ambassador.model");
const Newsletter = require("../model/newsletter.model");
const Property = require("../model/property.model");
const Realtor = require("../model/realtor.model");

const AmbassadorCreator = details => Ambassador.create(details)

const RealtorCreator = details => Realtor.create(details)

const propertyCreator = details => Property.create(details)

const newsletterCreator = email => Newsletter.create({email})

module.exports = { AmbassadorCreator, RealtorCreator, propertyCreator, newsletterCreator }
