const express = require('express'),
reportController = require('../controllers/reportControllers'),
router = express.Router();

router.post("/create", reportController.create);
router.get("/book/:id", reportController.indexByBook);
router.put("/update/:id", reportController.update);
router.get("/all", reportController.index)

module.exports = router;