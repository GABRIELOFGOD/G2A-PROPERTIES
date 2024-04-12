const { RealtorCreator } = require('../config/datasaver.config')
const { realtorEmailExists, realtorPhoneExists } = require('../utils/existenceChecker')
const { passwordHasher, salt, passwordCompare, createdToken } = require('../utils/general')
const { emailValidator, phoneValidator, passwordValidator } = require('../utils/validator')

const createRealtor = async (req, res) => {
  const { name, email, phone, password } = req.body
  try {
    
    // ======================= INPUT VALIDATIONS ========================= //
    if(!name || !email || !password) return res.status(401).json({error: 'All input fields are required', success: false})

    const isValidEmail = emailValidator(email)
    if(!isValidEmail) return res.status(401).json({error: 'This is not a valid email address', success: false})

    // const isValidPhone = phoneValidator(phone)
    // if(!isValidPhone) return res.status(401).json({error: 'This is not a valid phone number', success: false})

    const isPasswordStrong = passwordValidator(password)
    if(!isPasswordStrong) return res.status(401).json({error: 'This is a not strong password, up at least a uppercase, a lower case, a number and a symbol', success: false})

    // ===================== CHECKING IF USER EXISTS =================== //
    const isEmailExists = await realtorEmailExists(email)
    // const isPhoneExists = await realtorPhoneExists(phone)

    if(isEmailExists) return res.status(401).json({error: 'This email has already being used by another realtor', success: false})
    // if(isPhoneExists) return res.status(401).json({error: 'This phone number has already being used by another realtor', success: false})

    const salter = await salt(10)
    const hashedPassword = await passwordHasher(password, salter)

    const detail = {
      name, 
      email,
      password: hashedPassword
    }

    const newRealtor = await RealtorCreator(detail)
    res.status(201).json({message: 'New realtor account created successfully', success: true})
    
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

const loginRealtor = async (req, res) => {
  const { email, phone, password } = req.body
  try {
    
    // =================== VALIADTING USER INPUTS ===================== //
    if(!email) return res.status(402).json({error: 'Please enter your email address here', success: false})

    if(!password) return res.status(402).json({error: 'Please enter your password to login to your account', success: false})

    // if(email && phone) return res.status(402).json({error: 'Dear user, kindly login through the require portal as you can\'t input email and phone number together', success: false})

    const isEmail = await realtorEmailExists(email)
    // const isPhone = await realtorPhoneExists(phone)

    // const theRealtor = isEmail || isPhone
    const theRealtor = isEmail

    if(!theRealtor) return res.status(402).json({error: 'invalid credentials', success: false})

    const isPasswordCorrect = await passwordCompare(password, theRealtor.password)
    if(!isPasswordCorrect) return res.status(402).json({error: 'invalid credentials', success: false})

    // ======================== SENDING COOOKIE TO BROWSER ======================== //
    const token = createdToken(theRealtor._id)
    res.cookie('realtor', token, { httpOnly: true, expires: 0 })
    res.status(201).json({message: "Login successful", success: true})

  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

module.exports = { createRealtor, loginRealtor }