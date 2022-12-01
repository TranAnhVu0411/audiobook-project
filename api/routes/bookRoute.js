const express = require('express'),
bookController = require('../controllers/bookControllers'),
upload = require("../config/multer"),
router = express.Router();

router.get("/total", bookController.total);
router.get("/recent", bookController.indexCurrent);
router.post("/create", upload.single('image'), bookController.create);
router.get('/find', bookController.index);
router.get('/category/:cat', bookController.index);
router.put("/update/:id", upload.single('image'), bookController.update);
router.get("/:id", bookController.show);

module.exports = router;