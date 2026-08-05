const customerAuthController = require('../../controllers/home/customerAuthController')
const authController = require('../../controllers/authControllers')
const {authMiddleware}=require('../../middlewares/authMiddleware')
const validate = require('../../middlewares/validate')
const router = require('express').Router()

router.post('/customer/customer-register', validate({
    name: { required: true, type: 'string', min: 2, max: 100, trim: true },
    email: { required: true, email: true, trim: true },
    password: { required: true, type: 'string', min: 6 },
}), customerAuthController.customer_register)
router.post('/customer/customer-login', validate({
    email: { required: true, email: true, trim: true },
    password: { required: true, type: 'string', min: 6 },
}), customerAuthController.customer_login)

const socialRules = { access_token: { required: true, type: 'string' } }
router.post('/customer/google-login', validate(socialRules), customerAuthController.customer_google)
router.post('/customer/facebook-login', validate(socialRules), customerAuthController.customer_facebook)

router.get('/logout',authMiddleware,authController.logout)

module.exports = router 