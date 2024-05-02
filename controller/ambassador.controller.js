const { AmbassadorCreator } = require("../config/datasaver.config")
const { ambassadorEmailExists, ambassadorPhoneExists } = require("../utils/existenceChecker")
const { gettingAllAmbassador } = require("../utils/getData")
const { emailValidator, phoneValidator } = require('../utils/validator')

const registerAmbassador = async (req, res) => {
  const { name, email, phone, marketing_experience, address, what_to_offer, social_media } = req.body
  
  try {
    
    // ======================== VALIDATING USER INPUT ============================= //
    if(!name || !email || !phone || !marketing_experience || !address || !what_to_offer || !social_media) return res.status(401).json({error: 'All inputs fields are required', success: false})

    const isValidEmail = emailValidator(email)
    if(!isValidEmail) return res.status(401).json({error: 'This is not a valid email address', success: false})

    const isValidPhone = phoneValidator(phone)
    if(!isValidEmail) return res.status(401).json({error: 'This is not a valid phone number', success: false})

    // ================ CHECKING IF USER HAS REGITERED BEFORE ============================ //
    const isEmailExists = await ambassadorEmailExists(email)
    if(isEmailExists) return res.status(401).json({error: 'This Email has been used by an ambassador', success: false})

    const isPhoneExists = await ambassadorPhoneExists(phone)
    if(isPhoneExists) return res.status(401).json({error: 'This Phone munber has  already being used by an ambassador', success:false})

    const details = { name, email, phone, marketing_experience, address, what_to_offer, social_media }

    const newAmbassador = await AmbassadorCreator(details)
    res.status(201).json({message: 'You have successfully applied for an ambassador role, we will reach out to you', success: true})

    // ====================== //////// ====================== //
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err});
  }
}

const getAllAmbassador = async (req, res) => {
  try {

    if(!req.admin) res.status(402).json({error: 'Authentication Failed, please login', success: true})

    const allAmbassador = await gettingAllAmbassador()

    res.status(201).json({message: 'These are all the ambassador requests', success: true, data: allAmbassador})
    
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err});
  }
}

module.exports = { registerAmbassador, getAllAmbassador }