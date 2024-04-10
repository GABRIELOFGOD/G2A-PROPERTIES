const { propertyCreator } = require("../config/datasaver.config");
const { propertyAdder } = require("../utils/general");
const cloudinary = require('../config/cloudinary.config');

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

module.exports = { postProperty, getAllProperties };
