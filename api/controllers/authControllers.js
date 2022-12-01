const mongoose = require('mongoose'),
User = require('../models/user'),
bcrypt = require("bcryptjs"),
config = require("../config/authConfig"),
jwt = require("jsonwebtoken"),
cloudinary = require("../config/cloudinary"),
getUserParams = body => {
    return {
        username: body.username,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        role: 'user'
    };
};

module.exports = {
    register: (req, res) => {
        let userParams = getUserParams(req.body);
        User.create(userParams).then(
            user => {
                const token = jwt.sign({ id: user._id, role: user.role },
                    config.secret, {
                        expiresIn: 86400, // 24 hours
                    }
                );
                cloudinary.uploader.upload(req.file.path, {
                    folder: "audiobook/avatar", 
                    public_id: user._id,
                    format: 'png',
                }).then(
                    imgUrl => {
                        User.findByIdAndUpdate(user._id, {$set: {avatar: imgUrl.secure_url}}).then(
                            userUpdated => {
                                res.status(200).json({info: userUpdated, accessToken: token});
                            }
                        ).catch(
                            error=>{
                                res.status(500).json(error);
                            }
                        );
                    }
                ).catch(
                    error=>{
                        res.status(500).json(error);
                    }
                );        
            }
        ).catch(
            error=>{
                res.status(500).json(error);
            }
        );
    },
    login: (req, res) => {
        let userParams = {
            email: req.body.email
        };
        User.findOne(userParams).then(
            user => {
                const passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );
                if (!passwordIsValid) {
                    return res.status(401).send({
                        accessToken: null,
                        message: "Invalid Password!",
                    });
                }
                const token = jwt.sign({ id: user.AccountID }, config.secret, {
                    expiresIn: 86400, // 24 hours
                });
                res.status(200).send({ info: user, accessToken: token });
            }
        ).catch(
            error => {
                res.status(500).json(error);
            }
        )
    }
}