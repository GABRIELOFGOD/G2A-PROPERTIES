const { newsletterCreator } = require("../config/datasaver.config");
const { newsletterEmailExists } = require("../utils/existenceChecker");
const { allNewsletter } = require("../utils/getData");
const { emailValidator } = require("../utils/validator");

const subscribeNewsletter = async (req, res) => {
  const { email } = req.body
  try {
    
    // ======================= VALIDATING INPUT ==================== //
    if(!email) return res.status(401).json({error: 'Enter your email to subscribe to our newsletter', success: false})

    const isEmail = emailValidator(email)
    if(!isEmail) return res.status(402).json({error: 'This is not a valid email address', success: false})

    // ========================= CHECKING IF EMAIL EXISTS IN DATABASE ============================== //
    const isEmailExists = await newsletterEmailExists(email)
    if(isEmailExists) return res.status(203).json({message: 'Your email already is in our newsletter', success: true})

    // ========================= SAVING NEWSLETTER TO DATABASE AND SENDING SUCCESS RESPONSE ========================== //
    const newNewsletter = await newsletterCreator(email)
    res.status(201).json({message: 'You have successfully subscribe to our newsletter', success: true, data: newNewsletter})
    
  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

const getAllNewsletter = async (req, res) => {
  try {
    
    // ========================== GETTING INFORMATION FROM THE DATABASE AND SENDING IT AS RESPONSE ======================= //
    const allNewsletters = await allNewsletter()
    res.status(202).json({message: 'These are all newsletter emails', data: allNewsletters})
  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

module.exports = { subscribeNewsletter, getAllNewsletter }