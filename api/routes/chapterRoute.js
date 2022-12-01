const express = require('express'),
chapterController = require('../controllers/chapterControllers'),
router = express.Router();

router.post("/create", chapterController.create);
router.get("/book/:id", chapterController.index);

module.exports = router;