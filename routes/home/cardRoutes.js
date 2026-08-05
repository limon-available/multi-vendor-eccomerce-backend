 const cardController = require('../../controllers/home/cardController')
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware')
const validate = require('../../middlewares/validate')
const router = require('express').Router()

router.post('/home/product/add-to-card',authMiddleware,authorizeRoles('customer'), validate({
    productId: { required: true, type: 'string', trim: true },
    quantity: { required: true, type: 'number', min: 1 },
}), cardController.add_to_card)
router.get('/home/product/get-card-product/:userId',authMiddleware,authorizeRoles('customer'),cardController.get_card_products)
router.delete('/home/product/delete-card-product/:card_id',authMiddleware,authorizeRoles('customer'),cardController.delete_card_products)
router.put('/home/product/quantity-inc/:card_id',authMiddleware,authorizeRoles('customer'),cardController.quantity_inc)
router.put('/home/product/quantity-dec/:card_id',authMiddleware,authorizeRoles('customer'),cardController.quantity_dec)

router.post('/home/product/add-to-wishlist',authMiddleware,authorizeRoles('customer'), validate({
    slug: { required: true, type: 'string', trim: true },
}), cardController.add_wishlist)
router.get('/home/product/get-wishlist-products/:userId',authMiddleware,authorizeRoles('customer'),cardController.get_wishlist) 
router.delete('/home/product/remove-wishlist-product/:wishlistId',authMiddleware,authorizeRoles('customer'),cardController.remove_wishlist) 

module.exports = router 
