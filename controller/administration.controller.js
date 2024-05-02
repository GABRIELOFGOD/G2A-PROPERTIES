const { adminCreator } = require("../config/datasaver.config");
const { isAdminEmailExists, gettingAdminById } = require("../utils/existenceChecker");
const { passwordHasher, salt, passwordCompare, createdToken } = require("../utils/general");
const { adminUpdateInfo } = require("../utils/getData");
const { emailValidator, passwordValidator } = require("../utils/validator");
const jwt = require('jsonwebtoken')

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
    res.cookie('G2a', token, { secure: true, httpOnly: true, maxAge: 1000*60*60*24*3, sameSite: "none", path: "/" })
    res.status(201).json({message: 'admin logged in successfully', success: true})
    
  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}


// ========================= REALTOR LOGOUT ======================= //
const logoutAdmin = async (req, res) => {
  try {
    
    res.cookie('G2a', 'a', { secure: true, httpOnly: true, maxAge: 1, sameSite: "none", path: "/" })
    res.status(201).json({message: "admin logout successfully", success: true})

  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

const adminProfile = async (req, res) => {
  const cookie = req.headers.cookie
  try {
    if(!cookie) return res.status(402).json({error: 'Please login to perform this operation', success: false})
    
    const isAdmin = cookie.split("=")[0]
    const adminCookie = cookie.split("=")[1]

    if(isAdmin != 'admin') return res.status(402).json({error: 'Authentication failed, please login and try again', success: false})

    jwt.verify(adminCookie, process.env.SECRET_KEY, async (err, decodedToken) => {
      if(err) return res.status(402).json({error: 'Authentication failed, please login and try again', success: false, errMsg: err})

      const {id} = decodedToken
      const theRealtor = await gettingAdminById(id)
      res.status(201).json({message: 'This is the realtor profile', success: true, data: theRealtor})
    })

  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
    console.log(err)
  }
}

const updateAdminData = async (req, res) => {
  const cookie = req.headers.cookie
  try {
    
    if(!cookie) return res.status(402).json({error: 'Please login again', success: false})

    const isRealtor = cookie.split("=")[0]
    const realtorCookie = cookie.split("=")[1]

    if(isRealtor !== 'G2a') return res.status(402).json({error: 'Authentication failed, please login and try again', success: false})

    jwt.verify(realtorCookie, process.env.SECRET_KEY, async (err, decodedToken) => {
      if(err) return res.status(402).json({error: 'Authentication failed, please login and try again', success: false, errMsg: err})

      const {id} = decodedToken
      const theRealtor = await gettingAdminById(id)
      if(!theRealtor) return res.status(402).json({error: 'This account does not exists or has been deleted', success: true})

      const realtorUpdater = await adminUpdateInfo(id, req.body)
      
      res.status(201).json({message: 'Information Updated successfully', success: true})
    })
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

module.exports = { adminRegistration, adminLogin, adminProfile, updateAdminData, logoutAdmin }