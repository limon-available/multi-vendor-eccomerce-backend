const paymentController = require('../controllers/payment/paymentController')
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware')
const validate = require('../middlewares/validate')
const router = require('express').Router()

router.get('/payment/create-stripe-connect-account',authMiddleware,authorizeRoles('seller'),paymentController.create_stripe_connect_account)

router.put('/payment/active-stripe-connect-account/:activeCode',authMiddleware,authorizeRoles('seller'),paymentController.active_stripe_connect_account)

router.get('/payment/seller-payment-details/:sellerId',authMiddleware,authorizeRoles('seller'),paymentController.get_seller_payment_details)
router.post('/payment/withdrowal-request',authMiddleware,authorizeRoles('seller'), validate({
  amount: { required: true, type: 'number', min: 1 },
}), paymentController.withdrowal_request)

router.get('/payment/request', authMiddleware,authorizeRoles('admin'), paymentController.get_payment_request)
router.post('/payment/request-confirm',authMiddleware,authorizeRoles('admin'), validate({
  paymentId: { required: true, type: 'string', trim: true },
}), paymentController.payment_request_confirm)
 
module.exports = router 
