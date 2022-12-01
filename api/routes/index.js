const bookRoute = require('./bookRoute'),
authRoute = require('./authRoute'),
userRoute = require('./userRoute'),
chapterRoute = require('./chapterRoute'),
pageRoute = require('./pageRoute'),
commentRoute = require('./commentRoute'),
ratingRoute = require('./ratingRoute'),
express = require('express'),
router = express.Router();

router.use('/book', bookRoute);
router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/chapter', chapterRoute);
router.use('/page', pageRoute);
router.use('/comment', commentRoute);
router.use('/rating', ratingRoute);

module.exports = router;