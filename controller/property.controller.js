const { propertyCreator, propertyInspectCreator } = require("../config/datasaver.config");
const { realtorPropertyAdder, adminPropertyAdder, updatePropertyContent } = require("../utils/general");
const cloudinary = require('../config/cloudinary.config');
const { emailValidator, phoneValidator } = require("../utils/validator");
const { isPropertyExists, gettingRealtorById, propertyByPosterId, gettingInspectionById } = require("../utils/existenceChecker");
const { listPropertyUpdate, deletePropertyFunction, allPropertiesGet, getAllInspect } = require("../utils/getData");
const mongoose = require("mongoose");

const postProperty = async (req, res) => {
  const { name, address, about, price, square_meter, parking_lot, number_of_bedroom } = req.body;
  try {

    if (!req.files || req.files.length < 1) return res.status(402).json({ error: 'Upload property image(s) or video(s)', success: false });

    const images = req.files;

    if (!name || !address || !price || !square_meter) return res.status(401).json({ error: 'Name, address, price and square meter of properties are required', success: false });

    const posterId = req.posterId;
    const posterRole = req.posterRole

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

    const details = { name, address, about, price, square_meter, parking_lot, number_of_bedroom, posterId, postedBy:posterRole, images: imageBank };
    const newProperty = await propertyCreator(details);

    if(posterRole == 'realtor') await realtorPropertyAdder(posterId, newProperty);
    if(posterRole == 'admin') await adminPropertyAdder(posterId, newProperty);

    res.status(201).json({ message: 'Property posted successfully', success: true, property: newProperty });

  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

// ========================= ALL PROPERIES =============================== //
const getAllProperties = async (req, res) => {
  try {
    
    const allProperties = await allPropertiesGet()
    
    res.status(203).json({message: 'This is are the properties on the website', success: true, data: allProperties})
    
  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

// ========================= ALL PROPERIES =============================== //
const getListedProperties = async (req, res) => {
  try {
    
    const allProperties = await allPropertiesGet()

    let listedProperties = []
    allProperties?.forEach(prop => {
      if(prop.status == 'listed') listedProperties.push(prop)
    })
    
    res.status(203).json({message: 'This is are the properties on the website', success: true, data: listedProperties})
    
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

    if(propertyExists.status !== 'listed') return res.status(402).json({error: 'Sorry, this property is not available for inspection right now', success: false})

    const details = { name, time, phone, email, address, date, property:propertyExists }
    const newPropertyInspection = await propertyInspectCreator(details)

    res.status(202).json({message: 'Proposal to inspect property has been received successfully', success: true, data: newPropertyInspection})

  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

const propertyListed = async (req, res) => {
  const { id } = req.params
  try {
    
    // ==================== VALIDATING PROPERTY ID ========================== //
    if(!id) return res.status(402).json({error: 'Please specify the property to be listed', success: false})
    const theProperty = await isPropertyExists(id)

    if(!theProperty) return res.status(402).json({error: 'This property does no longer exist', success: false})

    const propertyChangedListed = await listPropertyUpdate(id)
    res.status(202).json({message: "Property Listed successfully", success: true, data: propertyChangedListed})
    
  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

// ====================== GETTING SINGLE PROPERTY ====================== //
const getSingleProperty = async (req, res) => {
  const { id } = req.params
  try {
    
    // ==================== VALIDATING PROPERTY TO GET ====================== //
    if(!id) return res.status(402).json({error: 'Please specify property to get', success: false})

    const theProperty = await isPropertyExists(id)

    if(!theProperty) return res.status(402).json({error: 'This property does no longer exist', success: false})

    res.status(202).json({message: "Got it, here's your property", success: true, data: theProperty})

  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

// =================== PROPERTY DELETE FUNCTION ===================== //
const deleteProperty = async (req, res) => {
  const { id } = req.params
  try {
    
    // ==================== VALIDATING PROPERTY TO DELETE ======================== //
    if(!id) return res.status(402).json({error: 'Please specifify the property to delete', success: false})
    
    const theProperty = await isPropertyExists(id)

    if(!theProperty) return res.status(402).json({error: 'This property does no longer exist', success: false})
    const deleteTheProperty = await deletePropertyFunction(id)

    res.status(203).json({message: "Property deleted successfully", success: true})
    
  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

const editProperty = async (req, res) => {
  const { id } = req.params
  try {
    if(!id) return res.status(402).json({error: 'Please specify the property you want to edit', success: false})

    if(!req.body || Object.keys(req.body).length == 0) return res.status(403).json({error: 'Please make the change you want to take effect', success: false})

    const isProperty = await isPropertyExists(id)

    if(!isProperty) return res.status(401).json({error: 'This property does not exists or has been deleted', success: false})

    if(req.posterRole == 'realtor'){
      if(isProperty.posterId != req.posterId) return res.status(403).json({error: 'You are not the poster of this property, you cannot perform this operation', success: false})
    }

    const propertyAdjust = await updatePropertyContent(id, req.body)
    res.status(201).json({message: 'property has been updated successfully', success: true})

  } catch (err) {
    // if(err instanceof CastError) return res.status(403).json({error: 'This is not a valid property from our website', success: false})
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

const getAllInspectRequest = async (req, res) => {
  try {

    if(!req.admin) return res.status(402).json({error: 'Cannot authenticate you', success: false})
    
    const allRequest = await getAllInspect()
    res.status(201).json({message: 'These are the inspection requests', success: true, data: allRequest})
  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

const getSingleInspection = async (req, res) => {
  const { id } = req.params
  try {
    if(!req.admin) return res.status(402).json({error: 'Cannot authenticate you', success: false})

    if(!id) return res.status(402).json({error: 'special what inspection you want to look into', success: false})

    const theInspect = await gettingInspectionById(id)

    if(!theInspect) return res.status(402).json({error: 'This Inspection request has been fufilled or deleted', success: false})

    res.status(201).json({message: 'This is the property you requested for', success: true, data: theInspect})
    
  } catch (err) {
    res.status(501).json({ error: 'A server error occurred, kindly retry and if this error persists, kindly reach out to us', success: false, errMsg: err });
  }
}

module.exports = { postProperty, getAllProperties, propertyInspect, propertyListed, getSingleProperty, deleteProperty, editProperty, getListedProperties, getAllInspectRequest, getSingleInspection };
