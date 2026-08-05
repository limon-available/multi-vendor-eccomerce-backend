const ChatController = require('../controllers/chat/ChatController')
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware')
const validate = require('../middlewares/validate')
const router = require('express').Router()

const addFriendRules = {
    sellerId: { required: true, type: 'string', trim: true },
}


const customerMessageRules = {
    text: { required: true, type: 'string', min: 1, trim: true },
    sellerId: { required: true, type: 'string', trim: true },
    name: { required: true, type: 'string', trim: true },
}

const sellerMessageRules = {
    text: { required: true, type: 'string', min: 1, trim: true },
    receverId: { required: true, type: 'string', trim: true },
    name: { required: true, type: 'string', trim: true },
}

// receverId is only supplied (and used) when an admin sends a message, so it
// stays optional here.
const adminSellerMessageRules = {
    message: { required: true, type: 'string', min: 1, trim: true },
    senderName: { required: true, type: 'string', trim: true },
}

router.get('/chat/customer/get-friends',authMiddleware,authorizeRoles('customer'), ChatController.get_customer_friends)
router.post('/chat/customer/add-customer-friend',authMiddleware,authorizeRoles('customer'), validate(addFriendRules), ChatController.add_customer_friend)
router.post('/chat/customer/send-message-to-seller',authMiddleware,authorizeRoles('customer'), validate(customerMessageRules), ChatController.customer_message_add)

router.get('/chat/seller/get-customers/:sellerId',authMiddleware,authorizeRoles('seller'),ChatController.get_customers)
router.get('/chat/seller/get-customer-message/:customerId',authMiddleware,authorizeRoles('seller'),ChatController.get_customers_seller_message)
router.post('/chat/seller/send-message-to-customer',authMiddleware,authorizeRoles('seller'), validate(sellerMessageRules), ChatController.seller_message_add)

router.get('/chat/admin/get-sellers',authMiddleware,authorizeRoles('admin'),ChatController.get_sellers)
router.post('/chat/message-send-seller-admin',authMiddleware,authorizeRoles('admin', 'seller'), validate(adminSellerMessageRules), ChatController.seller_admin_message_insert)
router.get('/chat/get-admin-messages/:receverId',authMiddleware,authorizeRoles('admin'),ChatController.get_admin_messages)
router.get('/chat/get-seller-messages',authMiddleware,authorizeRoles('seller'),ChatController.get_seller_messages)

module.exports = router
