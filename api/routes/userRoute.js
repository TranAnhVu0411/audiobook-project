const express = require('express'),
userController = require('../controllers/userControllers'),
router = express.Router();

router.get("/total", userController.total);

module.exports = router;