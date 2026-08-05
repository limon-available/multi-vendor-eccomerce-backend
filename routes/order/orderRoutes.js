const orderController = require('../../controllers/order/orderController')
const router = require('express').Router()
const { authMiddleware, authorizeRoles } =require('../../middlewares/authMiddleware')
const validate = require('../../middlewares/validate')
// Customer
router.post('/home/order/place-order',authMiddleware,authorizeRoles('customer'), validate({
  price: { required: true, type: 'number', min: 0 },
  shipping_fee: { required: true, type: 'number', min: 0 },
  products: { required: true },
  shippingInfo: { required: true },
}), orderController.place_order)
router.get('/home/coustomer/get-dashboard-data/:userId',authMiddleware,authorizeRoles('customer'),orderController.get_customer_dashboard_data)
router.get('/home/coustomer/get-orders/:customerId/:status',authMiddleware,authorizeRoles('customer'),orderController.get_orders)
router.get('/home/coustomer/get-order-details/:orderId',authMiddleware,authorizeRoles('customer'),orderController.get_order_details)

router.post('/order/create-payment',authMiddleware,authorizeRoles('customer'), validate({
  price: { required: true, type: 'number', min: 1 },
}), orderController.create_payment)

// Admin
router.get('/admin/orders',authMiddleware,authorizeRoles('admin'),orderController.get_admin_orders)
router.get('/admin/order/:orderId',authMiddleware,authorizeRoles('admin'),orderController.get_admin_order)
router.put('/admin/order-status/update/:orderId',authMiddleware,authorizeRoles('admin'), validate({
  status: { required: true, type: 'string', trim: true },
}), orderController.admin_order_status_update)

// Seller
router.get('/seller/orders/:sellerId',authMiddleware,authorizeRoles('seller'),orderController.get_seller_orders)
router.get('/seller/order/:orderId',authMiddleware,authorizeRoles('seller'),orderController.get_seller_order)
router.put('/seller/order-status/update/:orderId',authMiddleware,authorizeRoles('seller'), validate({
  status: { required: true, type: 'string', trim: true },
}), orderController.seller_order_status_update)
router.get('/order/order_confirm/:orderId',authMiddleware,authorizeRoles('customer'),orderController.order_confirm)

// routes/orderRoutes.js
router.delete(
  '/order/cart_item_delete',
  authMiddleware,
  authorizeRoles('customer'),
  orderController.cart_item_delete
)
module.exports = router  
