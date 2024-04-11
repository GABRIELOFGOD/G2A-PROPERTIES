const { propertyCreator, propertyInspectCreator } = require("../config/datasaver.config");
const { propertyAdder } = require("../utils/general");
const cloudinary = require('../config/cloudinary.config');
const { emailValidator, phoneValidator } = require("../utils/validator");
const { isPropertyExists } = require("../utils/existenceChecker");

const postProperty = async (req, res) => {
  const { name, address, about, price, square_meter, parking_lot, number_of_bedroom } = req.body;
  try {

    if (!req.files || req.files.length < 1) return res.status(402).json({ error: 'Upload property image(s) or video(s)', success: false });

    const images = req.files;

    if (!name || !address || !price || !square_meter) return res.status(401).json({ error: 'Name, address, price and square meter of properties are required', success: false });

    const poster = req.realtor;

    let imageBank = [];

    let uploadPromises = images.map(image => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image.path, (err, rel) => {
          if (err) {
            reject(err);
          } else {
            resolve(rel.secure_url);
          }
        });
      });
    });

    try {
      const uploadedImages = await Promise.all(uploadPromises);
      imageBank = uploadedImages;
    } catch (uploadError) {
      console.error('Error uploading images:', uploadError);
      return res.status(402).json({ error: 'There was an error uploading your images', success: false, errMsg: uploadError });
    }

    const details = { name, address, about, price, square_meter, parking_lot, number_of_bedroom, postedBy: poster, images: imageBank };
    const newProperty = await propertyCreator(details);

    const addPro = await propertyAdder(poster, newProperty);

    res.status(201).json({ message: 'Property posted successfully', success: true, property: newProperty });

  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

const getAllProperties = async (req, res) => {
  try {
    
    
  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

const propertyInspect = async (req, res) => {
  const { name, time, phone, email, address, date } = req.body
  const { id } = req.params
  try {
    
    // ======================== VALIDATING REQUIRED INPUTS ======================= //
    if(!name) return res.status(402).json({error: 'please tell us your name so we can know how to address you', success: false})

    if(!time) return res.status(402).json({error: 'please let us know the time you are coming so we can be fully ready to have you', success: false})

    if(!date) return res.status(402).json({error: 'please tell us the date you will be chanced to come to our office so we will get everything set for you', success: false})

    if(!phone) return res.status(402).json({error: 'provide your phone number so we can follow you up', success: false})

    const isPhone = phoneValidator(phone)
    if(!isPhone) return res.status(402).json({error: 'This is not a valid phone number', success: false})

    if(email) {
      const isEmail = emailValidator(email)
      if(!isEmail) return res.status(402).json({error: 'This is not a valid email address', success: false})
    }

    // ======================= PROPERTY VALIDATIONS =========================== //
    if(!id) return res.status(402).json({error: 'Please let us know the property you are want to inspect', success: false})

    const propertyExists = await isPropertyExists(id)
    if(!propertyExists) return res.status(402).json({error: 'This property does no longer exists or has never existed', success: false})

    // if(propertyExists !== 'listed') return res.status(402).json({error: 'Sorry, this property is no longer available for sale', success: false})

    const details = { name, time, phone, email, address, date, property:propertyExists }
    const newPropertyInspection = await propertyInspectCreator(details)

    res.status(202).json({message: 'Proposal to inspect property has been received successfully', success: true, data: newPropertyInspection})

  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

module.exports = { postProperty, getAllProperties, propertyInspect };
