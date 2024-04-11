const multer = require('multer')
const { realtorAuthouriser, realtorIdentifier } = require('../middleware/realtor.middleware')
const { postProperty, getAllProperties, propertyInspect } = require('../controller/property.controller')

const router = require('express').Router()

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({storage})

router.post('/post', upload.array('file'), realtorAuthouriser, realtorIdentifier, postProperty)
router.get('/properties', getAllProperties)
router.post('/inspect/:id', propertyInspect)

module.exports = router