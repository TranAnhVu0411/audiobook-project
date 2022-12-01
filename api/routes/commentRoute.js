const express = require('express'),
commentController = require('../controllers/commentControllers'),
router = express.Router();

router.post("/create", commentController.create);
router.put("/update/:id", commentController.update);
router.get("/book/total/:id", commentController.totalComment);
router.get("/book/:id", commentController.indexByBook);

module.exports = router;