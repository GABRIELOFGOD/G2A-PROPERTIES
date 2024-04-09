const { propertyCreator } = require("../config/datasaver.config")
const { propertyAdder } = require("../utils/general")

const postProperty = async (req, res) => {
  const { name, address, about, price, square_meter, parking_lot, number_of_bedroom } = req.body
  try {
    
    // ==================== VALIDATING USER INPUTS ====================== //
    if(!name || !address || !price || !square_meter) return res.status(401).json({error: 'Name, address, price and square meter of properties are required', success: false})

    const poster = req.realtor
    
    const details = { name, address, about, price, square_meter, parking_lot, number_of_bedroom, postedBy:poster }

    const newProperty = await propertyCreator(details)
    
    // ===================== ADDING PROPERTY TO POSTER PROFILE ======================= //

    const addPro = await propertyAdder(poster, newProperty)
    
    res.status(201).json({message: 'Property posted successfully', success: true, property: newProperty})
  } catch (err) {
    res.status(501).json({error: 'A server error occur, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err})
  }
}

module.exports = { postProperty }