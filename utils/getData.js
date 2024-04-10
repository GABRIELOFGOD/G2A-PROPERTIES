const Newsletter = require("../model/newsletter.model");

// ============================== NESLETTER ========================== //
const allNewsletter = () => Newsletter.find()

module.exports = { allNewsletter }