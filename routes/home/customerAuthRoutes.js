const customerAuthController = require('../../controllers/home/customerAuthController')
const authController = require('../../controllers/authControllers')
const {authMiddleware}=require('../../middlewares/authMiddleware')
const router = require('express').Router()

router.post('/customer/customer-register',customerAuthController.customer_register)
router.post('/customer/customer-login',customerAuthController.customer_login)

router.get('/logout',authMiddleware,authController.logout)

module.exports = router 