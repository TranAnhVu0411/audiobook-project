const express = require('express'),
favouriteController = require('../controllers/favouriteControllers'),
router = express.Router();

router.post("/create", favouriteController.create);
router.delete("/delete", favouriteController.delete);
router.get("/check", favouriteController.getUserBookFavourite)

module.exports = router;