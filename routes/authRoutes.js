 const authControllers = require('../controllers/authControllers')
const { authMiddleware } = require('../middlewares/authMiddleware')
const router = require('express').Router()
const upload = require('../utiles/multer');
const create_admin=require('../controllers/authControllers')
router.post('/admin-login', authControllers.admin_login)
router.post('/create_admin',authControllers.create_admin);

router.get('/get_user_info',authMiddleware, authControllers.getUser)
router.post('/seller-register',authControllers.seller_register)
router.post('/seller-login',authControllers.seller_login)
router.post('/profile-image-upload',authMiddleware,upload.single('image'),authControllers.profile_image_upload)
router.post('/profile-info-add',authMiddleware, authControllers.profile_info_add)

router.get('/logout',authMiddleware, authControllers.logout)

module.exports = router 