const mongoose = require('mongoose'),
User = require('../models/user');

module.exports = {
    total: (req, res) => {
        User.countDocuments().then(
            count => {
                res.status(200).json({total: count});
            }
        )
    }
}