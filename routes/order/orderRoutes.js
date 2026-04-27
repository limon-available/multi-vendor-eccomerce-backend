const orderController = require('../../controllers/order/orderController')
const router = require('express').Router()
const { authMiddleware } =require('../../middlewares/authMiddleware')
// Customer
router.post('/home/order/place-order',orderController.place_order) 
router.get('/home/coustomer/get-dashboard-data/:userId',orderController.get_customer_dashboard_data)
router.get('/home/coustomer/get-orders/:customerId/:status',orderController.get_orders)
router.get('/home/coustomer/get-order-details/:orderId',orderController.get_order_details)

router.post('/order/create-payment',orderController.create_payment)

// Admin
router.get('/admin/orders',orderController.get_admin_orders)
router.get('/admin/order/:orderId',orderController.get_admin_order)
router.put('/admin/order-status/update/:orderId',orderController.admin_order_status_update)

// Seller
router.get('/seller/orders/:sellerId',orderController.get_seller_orders)
router.get('/seller/order/:orderId',orderController.get_seller_order)
router.put('/seller/order-status/update/:orderId', orderController.seller_order_status_update)
router.get('/order/order_confirm/:orderId',orderController.order_confirm)

// routes/orderRoutes.js
router.delete(
  '/order/cart_item_delete',
  authMiddleware,
  orderController.cart_item_delete
)
module.exports = router  