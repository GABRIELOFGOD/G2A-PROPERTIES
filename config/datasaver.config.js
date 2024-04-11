const Ambassador = require("../model/ambassador.model");
const Contact = require("../model/contact.model");
const Newsletter = require("../model/newsletter.model");
const Property = require("../model/property.model");
const Realtor = require("../model/realtor.model");

const AmbassadorCreator = details => Ambassador.create(details)

const RealtorCreator = details => Realtor.create(details)

const propertyCreator = details => Property.create(details)

const newsletterCreator = email => Newsletter.create({email})

const contactCreator = details => Contact.create(details)

module.exports = { AmbassadorCreator, RealtorCreator, propertyCreator, newsletterCreator, contactCreator }
