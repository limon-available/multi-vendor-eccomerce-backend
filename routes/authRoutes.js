 const authControllers = require('../controllers/authControllers')
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware')
const validate = require('../middlewares/validate')
const router = require('express').Router()
const upload = require('../utiles/multer');

const loginRules = {
    email: { required: true, email: true, trim: true },
    password: { required: true, type: 'string', min: 6 },
}

const registerRules = {
    name: { required: true, type: 'string', min: 2, max: 100, trim: true },
    email: { required: true, email: true, trim: true },
    password: { required: true, type: 'string', min: 6 },
}

router.post('/admin-login', validate(loginRules), authControllers.admin_login)
router.post('/create_admin', validate(registerRules), authControllers.create_admin);

router.get('/get_user_info',authMiddleware, authControllers.getUser)
router.post('/seller-register', validate(registerRules), authControllers.seller_register)
router.post('/seller-login', validate(loginRules), authControllers.seller_login)

const socialRules = { access_token: { required: true, type: 'string' } }
router.post('/seller/google-login', validate(socialRules), authControllers.seller_google)
router.post('/seller/facebook-login', validate(socialRules), authControllers.seller_facebook)

router.post('/profile-image-upload',authMiddleware,authorizeRoles('seller'),upload.single('image'),authControllers.profile_image_upload)
router.post('/profile-info-add',authMiddleware,authorizeRoles('seller'), validate({
    shopName: { required: true, type: 'string', min: 2, trim: true },
    division: { required: true, type: 'string', trim: true },
    district: { required: true, type: 'string', trim: true },
    sub_district: { required: true, type: 'string', trim: true },
}), authControllers.profile_info_add)

router.get('/logout',authMiddleware, authControllers.logout)

module.exports = router 
