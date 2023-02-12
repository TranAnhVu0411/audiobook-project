const express = require('express'),
userController = require('../controllers/userControllers'),
upload = require("../config/multer"),
router = express.Router();

router.get('/find', userController.index);
router.get("/total", userController.total);
router.put("/update/:id", upload.single('image'), userController.update);
router.get('/:id', userController.show)

module.exports = router;