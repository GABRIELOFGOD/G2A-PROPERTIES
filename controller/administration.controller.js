const { adminCreator } = require("../config/datasaver.config");
const { isAdminEmailExists } = require("../utils/existenceChecker");
const { passwordHasher, salt, passwordCompare, createdToken } = require("../utils/general");
const { emailValidator, passwordValidator } = require("../utils/validator");

const adminRegistration = async (req, res) => {
  const { email, name, password } = req.body
  try {
    
    // ================= VALIDATING USER INPUTS =================== //
    if(!email || !name || !password) return res.status(402).json({error: 'All input fields are required', success: false})

    const isEmail = emailValidator(email)
    if(!isEmail) return res.status(402).json({error: 'This is not a valid email address', success: false})

    const isStrongPassword = passwordValidator(password)
    if(!isStrongPassword) return res.status(402).json({error: 'This is not a strong password, make sure your password includes at least a uppercase letter, a lowercase letter, a number, a symbol and must be at least 8 digits long', success: false})

    // ========================= CHECKING IF USER EXISTS =============================== //
    const isEmailExists = await isAdminEmailExists(email)
    if(isEmailExists)  return res.status(402).json({error: 'This admin account already exists', success: false})

    // ======================= HASHING PASSWORD ============================ //
    const salted = await salt(10)
    const hashedPassword = await passwordHasher(password, salted)

    // ==================== SAVING DETAILS TO DATABASE AND SENDING SUCCESS RESPONSE =================== //
    const details = { email, name, password: hashedPassword }
    const newAmin = await adminCreator(details)

    res.status(202).json({message: 'Admin account created successfully', success: true})
    
  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

const adminLogin = async (req, res) => {
  const { email, password } = req.body
  try {
    
    // ================== VALIDATING INPUTS ========================= //
    if(!email || !password) return res.status(402).json({error: 'All input fields are required', success: false})

    // ======================== CHECKING IF USER EXISTS =========================== //
    const isExists = await isAdminEmailExists(email)
    if(!isExists) return res.status(501).json({ error: 'invalid credentials', success: false });

    // ============================ PASSWORD COMPARE ========================== //
    const isPasswordMatch = await passwordCompare(password, isExists.password)
    if(!isPasswordMatch) return res.status(501).json({ error: 'invalid credentials', success: false });

    const token = createdToken(isExists._id)
    res.cookie('admin', token, { httpOnly: true, maxAge: 1000*60*60*24*3 })
    res.status(201).json({message: 'admin logged in successfully', success: true})
    
  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

module.exports = { adminRegistration, adminLogin }