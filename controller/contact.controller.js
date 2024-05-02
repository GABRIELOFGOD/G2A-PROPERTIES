const { contactCreator } = require("../config/datasaver.config");
const { gettingAllContact } = require("../utils/getData");
const { emailValidator, phoneValidator } = require("../utils/validator");

const fillContact = async(req, res) => {
  const { name, email, phone, address, message } = req.body;
  try {
    
    // ====================== VALIDATING USER INPUTS ============================= //
    if(!name || !phone || !message) return res.status(402).json({error: 'Your name, phone number and message are required', success: false})

    // ============================ INPUT VALIDATIONS ========================= //
    const isEmail = emailValidator(email)
    if(!isEmail) return res.status(402).json({error: 'This is not a valid email address', success: false})

    const isPhone = phoneValidator(phone)
    if(!isPhone) return res.status(402).json({error: 'This is not a valid phone number', success: false})

    // ========================== SAVING CONTACT AND SENDING RESPONSE ============================= //
    const details = { name, email, phone, address, message }
    const newContact = await contactCreator(details)
    
    res.status(201).json({message: 'Your contact has been saved', success: true, data: newContact})
    
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

const getAllContactInfo = async (req, res) => {
  try {
    
    if(!req.admin) return res.status(401).json({error: 'Authentication Failed, please login', success: true})

    const allContact = await gettingAllContact()

    res.status(201).json({message: 'These are the contact requests', success: true, data: allContact})
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

module.exports = { fillContact, getAllContactInfo }