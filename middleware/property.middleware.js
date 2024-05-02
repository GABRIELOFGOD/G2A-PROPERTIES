const jwt = require('jsonwebtoken')
const { gettingRealtorById, gettingAdminById } = require('../utils/existenceChecker')

const propertyPostingAuth = async (req, res, next) => {
  const cookie = req.headers.cookie
  try {

    // ================= CHECKING IF COOKIE EXISTS =============================== //
    if(!cookie) return res.status(402).json({error: 'Authentication failed, please login to perform this operation', success: false})
    
    // ==================== CHECKING FOR USER ========================== //
    const userRole = cookie.split('=')[0]
    const userToken = cookie.split('=')[1]

    if(userRole !== 'G2a') return res.status(402).json({error: 'You are not allowed to perform this action', success: false})

    jwt.verify(userToken, process.env.SECRET_KEY, async (err, decodedToken) => {
      if(err) return res.status(402).json({error: 'Authentication failed, please login and try again', success: false})

      const { id } = decodedToken
      if(!id) return res.status(402).json({error: 'couldn\'t authenticate you, please try login again', success: false})

      req.posterId = id

      // =========================== GETTING USER ROLE ================================= //
      const adminUser = await gettingAdminById(id)
      const realtorUser = await gettingRealtorById(id)

      const theUser = adminUser || realtorUser
      if(theUser.role == 'realtor'){
        const realtorId = await gettingRealtorById(id)
        if(!realtorId) return res.status(402).json({error: 'This user account does not exists or has been deleted', success: false})

        // ========================  CHECKING IF REALTOR IS BLOCKED ========================== //
        if(realtorId.blocked == true) return res.status(402).json({error: 'You have been restricted to perform this operation, kindly reach out to an admin for account unblock', success: false})
      
        req.posterRole = realtorId.role
        next()
        
      }

      if(theUser.role == 'admin'){
        const adminId = await gettingAdminById(id)
        if(!adminId) return res.status(402).json({error: 'This user account does not exists or has been deleted', success: false})
        
        // ========================  CHECKING IF ADMIN IS BLOCKED ========================== //
        if(adminId.blocked == true) return res.status(402).json({error: 'You have been restricted to perform this operation, kindly reach out to an admin', success: false})
      
        req.posterRole = adminId.role
        next()
      }
      
      // next()
    })

  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

// const specificPropertyAuth = async(req, res) => {
//   const cookie = req.headers.cookie
//   try {
    
//     // ======================= CONFIRMING COOKIE =========================== //
//     if(!cookie) return res.status(402).json({error: 'Authentication failed please log in to perform thisi operation', success: false})

//     // ==================== CHECKING FOR USER ========================== //
//     const userRole = cookie.split('=')[0]
//     const userToken = cookie.split('=')[1]

//     if(userRole !== 'realtor' && userRole !== 'admin') return res.status(402).json({error: 'You are not allowed to perform this action', success: false})

//     jwt.verify(userToken, process.env.SECRET_KEY, async (err, decodedToken) => {
//       if(err) return res.status(402).json({error: 'Authentication failed, please login and try again', success: false})

//       const { id } = decodedToken
//       if(!id) return res.status(402).json({error: 'couldn\'t authenticate you, please try login again', success: false})

//       req.posterId = id
//     })

//   } catch (err) {
//     res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
//   }
// }

module.exports = { propertyPostingAuth }