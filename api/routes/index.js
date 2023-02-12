const bookRoute = require('./bookRoute'),
authRoute = require('./authRoute'),
userRoute = require('./userRoute'),
commentRoute = require('./commentRoute'),
ratingRoute = require('./ratingRoute'),
reportRoute = require('./reportRoute'),
favouriteRoute = require('./favouriteRoute'),
express = require('express'),
router = express.Router();

router.use('/book', bookRoute);
router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/comment', commentRoute);
router.use('/rating', ratingRoute);
router.use('/report', reportRoute);
router.use('/favourite', favouriteRoute);

module.exports = router;