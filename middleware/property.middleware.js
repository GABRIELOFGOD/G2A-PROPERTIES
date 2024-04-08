const identifyPropertyOwner = async (req, res, next) => {
  const cookie = req.hearders.cookie
  try {
    
    
    next()
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}