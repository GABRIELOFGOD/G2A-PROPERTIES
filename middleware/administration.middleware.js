const jwt = require('jsonwebtoken')
const { gettingAdminById } = require('../utils/existenceChecker')

const adminAuth = async (req, res, next) => {
  const cookie = req.headers.cookie
  try {
    
    // ========================= VALIDATING COOKIE ======================== //
    if(!cookie) return res.status(402).json({error: 'Please login to perform this operation', success: false})

    const cookieName = cookie.split('=')[0]
    const cookieToken = cookie.split('=')[1]

    if(cookieName !== 'G2a') return res.status(402).json({error: 'Authentication failed', success: false})
    jwt.verify(cookieToken, process.env.SECRET_KEY, (err, decodedToken) => {
      if(err) return res.status(402).json({error: 'Authentication failed, please login and try again', success: false, errMsg: err})

      req.user = decodedToken;
      next()
    })
    
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

// ========================= ADMIN IDENTIFIER FUNCTION ============================ //
const adminIdentifier = async (req, res, next) => {
  const { id } = req.user
  try {
    
    if(!id) return res.status(402).json({error: 'Authentication failed', success: false})

    // ======================== SEARCHING FOR ADMIN IDENTITY ================================ //
    const isAdmin = await gettingAdminById(id)
    if(!isAdmin) return res.status(402).json({error: 'This user doesn\'s exists', success: false})

    req.admin = isAdmin
    next()
    
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

module.exports = { adminAuth, adminIdentifier }