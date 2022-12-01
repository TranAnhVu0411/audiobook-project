const express = require('express'),
ratingController = require('../controllers/ratingControllers'),
router = express.Router();

router.post("/create", ratingController.create);
router.get("/book/:bookid/user/:userid", ratingController.getUserBookRating);
router.get("/book/:bookid", ratingController.getBookRating);
router.put("/update/:id", ratingController.update);

module.exports = router;