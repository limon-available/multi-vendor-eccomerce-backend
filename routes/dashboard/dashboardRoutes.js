const dashboardController = require('../../controllers/dashboard/dashboardController') 
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware')
const router = require('express').Router()
  
router.get('/admin/get-dashboard-data',authMiddleware,authorizeRoles('admin'), dashboardController.get_admin_dashboard_data)  
router.get('/seller/get-dashboard-data',authMiddleware,authorizeRoles('seller'), dashboardController.get_seller_dashboard_data)  
  
router.post('/banner/add', authMiddleware,authorizeRoles('seller'), dashboardController.add_banner)    
router.get('/banner/get/:productId', authMiddleware,authorizeRoles('seller'), dashboardController.get_banner)    
router.put('/banner/update/:bannerId', authMiddleware,authorizeRoles('seller'), dashboardController.update_banner)    
router.get('/banners', dashboardController.get_banners)

module.exports = router
