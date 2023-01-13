const express = require('express'),
userController = require('../controllers/userControllers'),
router = express.Router();

router.get('/:id', userController.show)
router.get("/total", userController.total);
router.put("/update/:id", userController.update);

module.exports = router;