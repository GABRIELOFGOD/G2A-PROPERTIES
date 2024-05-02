const multer = require('multer');
const { createRealtor, loginRealtor, changeRealtorStatus, realtorForgotPassword, realtorProfile, updateRealtorPassword, gettingAllRealtor, gettingSingleRealtor, updateRealtorData, realtorUpdateAvatar, logoutRealtor } = require('../controller/realtor.controller')
const { adminAuth, adminIdentifier } = require('../middleware/administration.middleware')
const { realtorAuthouriser, realtorIdentifier } = require('../middleware/realtor.middleware')

const router = require('express').Router();

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({storage})

router.post('/register', upload.single('avatar'), createRealtor)
router.post('/login', loginRealtor)
router.route('/change/:id').put(adminAuth, adminIdentifier, changeRealtorStatus)
router.post('/forgot_password', realtorForgotPassword)
router.route('/profile').get(realtorProfile).put(updateRealtorData)
router.put('/change_password/:token', updateRealtorPassword)
router.get('/all', gettingAllRealtor)
router.get('/single/:id',adminAuth, adminIdentifier, gettingSingleRealtor)
router.put('/avatar', upload.single('avatar'), realtorUpdateAvatar)
router.get('/logout', logoutRealtor)
// router.get('/properties', realtorAuthouriser, realtorIdentifier, realtorProperties)

module.exports = router