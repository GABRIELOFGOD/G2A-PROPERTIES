const multer = require('multer')
const { realtorAuthouriser, realtorIdentifier } = require('../middleware/realtor.middleware')
const { postProperty, getAllProperties, propertyInspect, propertyListed, getSingleProperty, deleteProperty, editProperty, getListedProperties, getAllInspectRequest, getSingleInspection } = require('../controller/property.controller')
const { propertyPostingAuth } = require('../middleware/property.middleware')
const { adminAuth, adminIdentifier } = require('../middleware/administration.middleware')

const router = require('express').Router()

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({storage})

router.post('/post', upload.array('file'), propertyPostingAuth, postProperty)
router.get('/properties', getListedProperties)
router.route('/inspect/:id').post(propertyInspect).put(upload.array('file'), propertyPostingAuth, editProperty).get(adminAuth, adminIdentifier, getSingleInspection)
router.route('/list/:id').put(propertyListed).get(getSingleProperty).delete(deleteProperty)
router.get('/get', adminAuth, adminIdentifier, getAllProperties)
router.route('/inspect/find/all').get(adminAuth, adminIdentifier, getAllInspectRequest)
// router.put('/images/:id', editPropertyImage)

module.exports = router