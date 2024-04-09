const jwt = require('jsonwebtoken')
const { gettingRealtorById } = require('../utils/existenceChecker')

const realtorAuthouriser = async (req, res, next) => {
  const cookie = req.headers.cookie
  try {
    
    // ================= BREAKING DOWN COOKIE TO IDENTIFY SENDER ======================== //
    const isRealtor = cookie.split("=")[0]
    const realtorCookie = cookie.split("=")[1]

    if(isRealtor !== 'realtor') return res.status(402).json({error: 'Authentication failed, please login and try again', success: false})

    jwt.verify(realtorCookie, process.env.SECRET_KEY, (err, decodedToken) => {
      if(err) return res.status(402).json({error: 'Authentication failed, please login and try again', success: false})

      req.user = decodedToken
      next()
    })

    // next()
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

const realtorIdentifier = async (req, res, next) => {
  const { id } = req.user
  try {
    
    // ===================== GETTING REALTOR IDENTITY FROM THE DATABASE ======================== //
    const realtor = await gettingRealtorById(id)
    
    req.realtor = realtor._id
    next()
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

module.exports = { realtorAuthouriser, realtorIdentifier }