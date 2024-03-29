require('dotenv').config();

const express = require('express'),
mongoose = require('mongoose'),
router = require('./routes/index'),
cors = require('cors')

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

mongoose.connect(
    // `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`,
    'mongodb://localhost:27017/audiobook_db',
    // 'mongodb://mongodb-node/audiobook_db',
    {useNewUrlParser: true}
);
mongoose.Connection;
mongoose.Promise = global.Promise;


app.listen(process.env.PORT, () => {
    console.log(`connected to port ${process.env.PORT}`);
});