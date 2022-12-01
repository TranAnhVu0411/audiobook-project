const express = require('express'),
authController = require('../controllers/authControllers'),
upload = require("../config/multer"),
router = express.Router();

router.post("/register", upload.single('avatar'), authController.register);
router.post("/login", authController.login)

module.exports = router;