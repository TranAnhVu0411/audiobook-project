const express = require('express'),
pageController = require('../controllers/pageControllers'),
uploadImage = require('../config/cloudinaryConfig'),

router = express.Router();

// router.post("/uploadimage", uploadImage.uploadPage.single('image'), pageController.upload);
router.post("/uploadimage", uploadImage.uploadPage.array('image'), pageController.upload);
router.post("/create", pageController.create);

module.exports = router;