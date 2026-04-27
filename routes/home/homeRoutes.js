 const homeControllers = require('../../controllers/home/homeControllers') 
const router = require('express').Router()

router.get('/get-categorys',homeControllers.get_categorys)
router.get('/get-products',homeControllers.get_products)
router.get('/get_price_range',homeControllers.get_price_range)
router.get('/query-products',homeControllers.query_products)
router.get('/product-details/:slug',homeControllers.product_details)

router.post('/customer/submit-review',homeControllers.submit_review)
router.get('/customer/get-reviews/:productId',homeControllers.get_reviews)
  

module.exports = router 