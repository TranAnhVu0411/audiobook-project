const mongoose = require('mongoose'),
Favourite = require('../models/favourite'),
Book = require('../models/book'),
User = require('../models/user');

module.exports = {
    create: (req, res) => {
        Book.findById(req.body.book).then(
            book => {
                User.findById(req.body.user).then(
                    user =>{
                        let newFavourite = Favourite({
                            book: book,
                            user: user
                        })
                        newFavourite.save().then(
                            favourite => {
                                res.status(200).json({favourite: favourite})
                            }
                        ).catch(error => {
                            res.status(500).json({error: error})
                        })
                    }).catch(error => {
                        res.status(500).json({error: error})
                    })
                }
        ).catch(error => {
            res.status(500).json({error: error});
        })
    },
    delete: (req, res) => {
        Favourite.deleteOne({book: mongoose.Types.ObjectId(req.query.book), user: mongoose.Types.ObjectId(req.query.user)}).then(
            (result) => {
                res.status(200).json(result)
            }
        ).catch(error => {
                res.status(500).json({error: error});
            }
        )
    },
    getUserBookFavourite: (req, res) => {
        Favourite.find({book: req.query.book, 
                        user: req.query.user}).then(
                        favourite => {
                            if (favourite.length===0){
                                res.status(200).json({favourite: false})
                            }else{
                                res.status(200).json({favourite: true})
                            }
                        }
                     ).catch(error => {
                        res.status(500).json({error: error})
                     })
    },
}