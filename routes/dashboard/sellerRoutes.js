const sellerController = require('../../controllers/dashboard/sellerController')
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware')
const validate = require('../../middlewares/validate')
const router = require('express').Router()

const statusUpdateRules = {
    sellerId: { required: true, type: 'string', trim: true },
    status: { required: true, type: 'string', trim: true },
}

router.get('/request-seller-get',authMiddleware,authorizeRoles('admin'), sellerController.request_seller_get)
router.get('/get-seller/:sellerId',authMiddleware,authorizeRoles('admin'), sellerController.get_seller)
router.post('/seller-status-update',authMiddleware,authorizeRoles('admin'), validate(statusUpdateRules), sellerController.seller_status_update)

router.get('/get-sellers', authMiddleware,authorizeRoles('admin'), sellerController.get_active_sellers)


router.get('/get-deactive-sellers',authMiddleware,authorizeRoles('admin'), sellerController.get_deactive_sellers)


module.exports = router
