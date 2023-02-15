const mongoose = require('mongoose'),
User = require('../models/user'),
Comment = require('../models/comment'),
Rating = require('../models/rating'),
Favourite = require('../models/favourite'),
cloudinary = require("../config/cloudinary");

const roleMapping = {
    0: 'all',
    1: 'user',
    2: 'admin'
}

module.exports = {
    total: (req, res) => {
        User.countDocuments().then(
            count => {
                res.status(200).json({total: count});
            }
        )
    },
    show: (req, res) => {
        User.findById(req.params.id).then(
            user => {
                Comment.find({user: req.params.id}).populate('book').then(
                    comments => {
                        Rating.find({user: req.params.id}).populate('book').then(
                            ratings => {
                                Favourite.find({user: req.params.id}).populate('book').then(
                                    favourites => {
                                        res.status(200).json({user: user, comments: comments, ratings: ratings, favourites: favourites});
                                    }
                                ).catch(error => {
                                    res.status(500).json({error: error})
                                })
                            }
                        ).catch(error => {
                            res.status(500).json({error: error})
                        })
                    }
                ).catch(error => {
                    res.status(500).json({error: error})
                })
            }
        ).catch(error => {
            res.status(500).json({error: error})
        })
    },
    update: (req, res) => {
        let userParams = {
            username: req.body.username,
        }
        cloudinary.uploader.upload(req.file.path, {
            folder: "audiobook/avatar", 
            public_id: req.params.id,
            format: 'png',
        }).then(imgUrl => {
            userParams.avatar=imgUrl.url
            User.findByIdAndUpdate(req.params.id, {$set:userParams}).then(
                user => {
                    res.status(200).json({user: user});
                }
            ).catch(
                error=>{
                    console.log(error)
                    res.status(500).json(error);
                }
            );
        }).catch(
            error=>{
                res.status(500).json(error);
            }
        );
    },
    updateViolatedCountStatus: (req, res) => {
        User.findByIdAndUpdate(req.params.id, {$set:req.body}).then(
            user => {
                res.status(200).json({user: user});
            }
        ).catch(
            error=>{
                console.log(error)
                res.status(500).json(error);
            }
        );
    },
    index: (req, res) => {
        // Thiết lập số lượng sách trong 1 trang
        let perPage = 10;
        let page = req.query.page||1;
        let searchQuery = {}
        if (req.query.username !== undefined){
             searchQuery['username'] = { "$regex": req.query.username, "$options": "i" }
        }
        if (req.query.email !== undefined){
            searchQuery['email'] = { "$regex": req.query.email, "$options": "i" }
        }
        if (req.query.role !== undefined) {
            if (req.query.role != 0){
                searchQuery['role'] = roleMapping[req.query.role]
            }
        }
        User.find(searchQuery, {}).skip((perPage*page)-perPage).limit(perPage).then(
            users => {
                User.countDocuments(searchQuery).then(
                    count => {
                        res.status(200).json({users: users, pageCount: Math.ceil(count / perPage), total: count});
                    }
                ).catch(
                    error => {
                        res.status(500).json(error);
                    }
                )
            }
        ).catch(
            error => {
                res.status(500).json(error);
            }
        )
    },
}