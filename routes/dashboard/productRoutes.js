const productController = require('../../controllers/dashboard/productController')
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware')
const validate = require('../../middlewares/validate')
const router = require('express').Router()

// product-add and product-image-update stream multipart bodies that are parsed
// by formidable inside the controller, so req.body is empty at middleware time
// and cannot be validated here. product-update receives a plain JSON body.
const updateRules = {
    productId: { required: true, type: 'string', trim: true },
    name: { type: 'string', min: 1, max: 200, trim: true },
    price: { type: 'number', min: 0 },
    stock: { type: 'number', min: 0 },
    discount: { type: 'number', min: 0 },
}

router.post('/product-add',authMiddleware,authorizeRoles('seller'), productController.add_product)
router.get('/products-get',authMiddleware,authorizeRoles('seller'), productController.products_get)
router.get('/product-get/:productId',authMiddleware,authorizeRoles('seller'), productController.product_get)
router.post('/product-update',authMiddleware,authorizeRoles('seller'), validate(updateRules), productController.product_update)
router.post('/product-image-update',authMiddleware,authorizeRoles('seller'), productController.product_image_update)

module.exports = router
