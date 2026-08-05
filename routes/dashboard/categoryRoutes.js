const categoryController = require('../../controllers/dashboard/categoryController')
const { authMiddleware, authorizeRoles } = require('../../middlewares/authMiddleware')
const validate = require('../../middlewares/validate')
const router = require('express').Router()
const upload = require('../../utiles/multer');

// `name` arrives as a multipart text field, so validate() must run after multer
// has populated req.body.
const addRules = {
    name: { required: true, type: 'string', min: 2, max: 100, trim: true },
}

// On update, name is optional (an image-only update is allowed), but when
// present it must still be a sensible string.
const updateRules = {
    name: { type: 'string', min: 2, max: 100, trim: true },
}

router.post('/category-add',authMiddleware,authorizeRoles('admin'),upload.single('image'), validate(addRules), categoryController.add_category)
router.get('/category-get',authMiddleware,authorizeRoles('admin', 'seller'), categoryController.get_category)
router.put('/category-update/:id',authMiddleware,authorizeRoles('admin'),upload.single('image'), validate(updateRules), categoryController.update_category)
router.delete('/category/:id',authMiddleware,authorizeRoles('admin'), categoryController.deleteCategory)

module.exports = router
