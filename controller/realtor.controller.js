const { RealtorCreator } = require('../config/datasaver.config')
const { caseCodeEmailSender } = require('../utils/emailSender')
const cloudinary = require('../config/cloudinary.config');
const { realtorEmailExists, realtorPhoneExists, gettingRealtorById, gettingAdminById } = require('../utils/existenceChecker')
const { passwordHasher, salt, passwordCompare, createdToken, emailToken, updatingRealtorPassword } = require('../utils/general')
const { updateRealtorBlock, allRealltorAccount, realtorUpdateInfo } = require('../utils/getData')
const { emailValidator, phoneValidator, passwordValidator } = require('../utils/validator')
const jwt = require('jsonwebtoken')

const createRealtor = async (req, res) => {
  const { name, phone, email, password } = req.body
  try {
    
    if(req.file){
      // ======================= INPUT VALIDATIONS ========================= //
      if(!name || !phone || !email || !password) return res.status(401).json({error: 'All input fields are required', success: false})

      const isValidEmail = emailValidator(email)
      if(!isValidEmail) return res.status(401).json({error: 'This is not a valid email address', success: false})

      const isValidPhone = phoneValidator(phone)
      if(!isValidPhone) return res.status(401).json({error: 'This is not a valid phone number', success: false})

      const isPasswordStrong = passwordValidator(password)
      if(!isPasswordStrong) return res.status(401).json({error: 'This is a not strong password, up at least a uppercase, a lower case, a number and a symbol', success: false})

      // ===================== CHECKING IF USER EXISTS =================== //
      const isEmailExists = await realtorEmailExists(email)
      const isPhoneExists = await realtorPhoneExists(phone)

      if(isEmailExists) return res.status(401).json({error: 'This email has already being used by another realtor', success: false})
      if(isPhoneExists) return res.status(401).json({error: 'This phone number has already being used by another realtor', success: false})

      const salter = await salt(10)
      const hashedPassword = await passwordHasher(password, salter)

      const imageResult = await cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if(err) return res.status(401).json({error: 'Your Image must be 10mb or less. If this is not the case, check error log or reach out to our support team', success: false, errLog: err});
      
        const detail = {
          name, 
          email,
          password: hashedPassword,
          avatar: result.secure_url
        }

        const newRealtor = await RealtorCreator(detail)
        res.status(201).json({message: 'New realtor account created successfully', success: true})
        
      })
    } else {
      // ======================= INPUT VALIDATIONS ========================= //
      if(!name || !phone || !email || !password) return res.status(401).json({error: 'All input fields are required', success: false})

      const isValidEmail = emailValidator(email)
      if(!isValidEmail) return res.status(401).json({error: 'This is not a valid email address', success: false})

      const isValidPhone = phoneValidator(phone)
      if(!isValidPhone) return res.status(401).json({error: 'This is not a valid phone number', success: false})

      const isPasswordStrong = passwordValidator(password)
      if(!isPasswordStrong) return res.status(401).json({error: 'This is a not strong password, up at least a uppercase, a lower case, a number and a symbol', success: false})

      // ===================== CHECKING IF USER EXISTS =================== //
      const isEmailExists = await realtorEmailExists(email)
      const isPhoneExists = await realtorPhoneExists(phone)

      if(isEmailExists) return res.status(401).json({error: 'This email has already being used by another realtor', success: false})
      if(isPhoneExists) return res.status(401).json({error: 'This phone number has already being used by another realtor', success: false})

      const salter = await salt(10)
      const hashedPassword = await passwordHasher(password, salter)

      const detail = {
        name, 
        email,
        password: hashedPassword
      }

      const newRealtor = await RealtorCreator(detail)
      res.status(201).json({message: 'New realtor account created successfully', success: true})
    }
    
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

const loginRealtor = async (req, res) => {
  const { email, password } = req.body
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
    res.cookie('G2a', token, { secure: true, httpOnly: true, maxAge: 1000*60*60*24*3, sameSite: "none", path: "/" })
    res.status(201).json({message: "Login successful", success: true})

  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

// ========================= REALTOR LOGOUT ======================= //
const logoutRealtor = async (req, res) => {
  try {
    
    res.cookie('G2a', 'a', { secure: true, httpOnly: true, maxAge: 1, sameSite: "none", path: "/" })
    res.status(201).json({message: "realtor logout successfully", success: true})

  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

// ======================= CHANGING REALTOR STATUS ======================= //
const changeRealtorStatus = async (req, res) => {
  const { id } = req.params
  try {

    // =============================== CHECKING FOR THE REALTOR ACCOUNT ======================== //
    if(!id) return res.status(402).json({error: 'Please specify the realtor account to be updated', success: false})
    const isRealtorExists = await gettingRealtorById(id)

    if(!isRealtorExists) return res.status(402).json({error: 'This realtor does not exist or account has been deleted', success: false})

    const workingAdmin = await gettingAdminById(req.admin._id)
    if(!workingAdmin || workingAdmin.blocked == true) return res.status(402).json({error: 'Authentication failed, sorry you cannot perform this opration', success: false})

    const changeTo = !isRealtorExists.blocked

    const realtorChanged = await updateRealtorBlock(isRealtorExists._id, changeTo)
    res.status(202).json({message: 'Realtor updated successfully', success: true})

  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

// ====================== FORGOT PASSWORD POST REQUEST ================================= //
const realtorForgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    
    // ====================== VALIDATING EMAIL INPUT ======================== //
    if(!email) return res.status(401).json({error: 'Please enter your email address', success: false})

    // ========================= CHEcKING IF EMAIL ADDRESS EXISTS ============================= //
    const isEmailExists = await realtorEmailExists(email)
    if(!isEmailExists) return res.status(401).json({error: 'This is an invalid email, please check and try again', success: false})

    const origin = req.get('origin')
    const token = emailToken(isEmailExists._id)
    const link = `${origin}/realtor/create_password/${token}`
    const sendingMail = caseCodeEmailSender(email, isEmailExists.name, link)
    
    res.status(202).json({message: 'Check your email for your password link, if you can\'t find it from your inbox, check your spam box', success: true})
    
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

// const realtorProperties = async (req, res) => {
//   const id = req.realtor
//   try {
    
//     const theRealtor = await gettingRealtorById(id).populate('properties')
//     // const theRel = theRealtor.populate()
//     console.log(theRel)
//   } catch (err) {
//     res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
//     console.log(err)
//   }
// }

// ===================== UPDATING REALTOR PASSWORD ====================== //
const updateRealtorPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params
  try {

    // =================== VALIDATING TOKEN ======================= //
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if(err) return res.status(402).json({error: "Invalid or expired token", success: false, errMsg: err})
      const { id } = decodedToken
      
      const isUser = await gettingRealtorById(id)
      if(!isUser) return res.status(402).json({error: 'You cannot perform this operation as you are not authenticated', success: false})

      const isPasswordStrong = passwordValidator(password)
      if(!isPasswordStrong) return res.status(402).json({error: 'This is a not strong password, up at least a uppercase, a lower case, a number and a symbol', success: false})

      const salter = await salt(10)
      const hashedPassword = await passwordHasher(password, salter)

      const userPassUpdate = await updatingRealtorPassword(isUser._id, hashedPassword)
      res.status(201).json({message: 'Password update was successful', success: true})
    })


  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

// =========================================== SELF PROFILE ================================ //
const realtorProfile = async (req, res) => {
  const cookie = req.headers.cookie
  try {
    if(!cookie) return res.status(402).json({error: 'Please login again', success: false})
    
    const isRealtor = cookie.split("=")[0]
    const realtorCookie = cookie.split("=")[1]

    if(isRealtor !== 'G2a') return res.status(402).json({error: 'Authentication failed, please login and try again', success: false})

    jwt.verify(realtorCookie, process.env.SECRET_KEY, async (err, decodedToken) => {
      if(err) return res.status(402).json({error: 'Authentication failed, please login and try again', success: false, errMsg: err})

      const {id} = decodedToken
      const theRealtor = await gettingRealtorById(id).populate('properties')
      res.status(201).json({message: 'This is the realtor profile', success: true, data: theRealtor})
    })

  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

const updateRealtorData = async (req, res) => {
  const cookie = req.headers.cookie
  try {

    if(!req.body) return res.status(402).json({error: 'Please input data to be updated', success: false})
    
    if(!cookie) return res.status(402).json({error: 'Please login again', success: false})

    const isRealtor = cookie.split("=")[0]
    const realtorCookie = cookie.split("=")[1]

    if(isRealtor !== 'G2a') return res.status(402).json({error: 'Authentication failed, please login and try again', success: false})

    jwt.verify(realtorCookie, process.env.SECRET_KEY, async (err, decodedToken) => {
      if(err) return res.status(402).json({error: 'Authentication failed, please login and try again', success: false, errMsg: err})

      const {id} = decodedToken
      const theRealtor = await gettingRealtorById(id)
      if(!theRealtor) return res.status(402).json({error: 'This account does not exists or has been deleted', success: true})

      const realtorUpdater = await realtorUpdateInfo(id, req.body)
      
      res.status(201).json({message: 'Information Updated successfully', success: true})
    })
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

const realtorUpdateAvatar = async (req, res) => {
  const cookie = req.headers.cookie
  try {
    
    if(!cookie) return res.status(402).json({error: 'Please login again', success: false})

    const isRealtor = cookie.split("=")[0]
    const realtorCookie = cookie.split("=")[1]

    if(isRealtor !== 'G2a') return res.status(402).json({error: 'Authentication failed, please login and try again', success: false})

    jwt.verify(realtorCookie, process.env.SECRET_KEY, async (err, decodedToken) => {
      if(err) return res.status(402).json({error: 'Authentication failed, please login and try again', success: false, errMsg: err})

      const {id} = decodedToken
      const theRealtor = await gettingRealtorById(id)
      if(!theRealtor) return res.status(402).json({error: 'This account does not exists or has been deleted', success: true})

      if(!req.file) return res.status(402).json({error: 'Upload an image to be added to your profile'})

      const imageResult = await cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if(err) return res.status(401).json({error: 'Your Image must be 10mb or less. If this is not the case, check error log or reach out to our support team', success: false, errLog: err});
      
        const detail = {
          avatar: result.secure_url
        }

        const newRealtor = await realtorUpdateInfo(id, detail)
        res.status(201).json({message: 'Profile Avatar updated successfully', success: true})
        
      })
      
    })
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

// ========================== GETTING ALL REGISTERED REALTOR ACCOUNTS =============================== //
const gettingAllRealtor = async (req, res) => {
  try {
    const allRealtor = await allRealltorAccount()
    res.status(201).json({message: 'These is are all registered realtor accounts', success: true, data: allRealtor})
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

const gettingSingleRealtor = async (req, res) => {
  const { id } = req.params
  try {
    
    if(!id) return res.status(402).json({error: 'Define realtor to be gotten', success: false})

    // ======================== VALIDATING ID ==================================== //
    const isValidRealtor = await gettingRealtorById(id)
    if(!isValidRealtor) return res.status(402).json({error: 'This reacltor account has been deleted or never existed', success: false})

    // =========================== SENDING REALTOR DATA ========================== //
    const theRealtor = await isValidRealtor.populate()

    res.status(201).json({message: 'This is the reactor profile/ account', success: true, data: theRealtor})
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

module.exports = { createRealtor, loginRealtor, changeRealtorStatus, realtorForgotPassword, realtorProfile, updateRealtorPassword, gettingSingleRealtor, gettingAllRealtor, updateRealtorData, realtorUpdateAvatar, logoutRealtor }