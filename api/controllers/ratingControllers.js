const mongoose = require('mongoose'),
Rating = require('../models/rating'),
Book = require('../models/book'),
User = require('../models/user');

module.exports = {
    create: (req, res) => {
        Book.findById(req.body.bookId).then(
            book => {
                User.findById(req.body.userId).then(
                    user =>{
                        let newRating = Rating({
                            rating: req.body.rating,
                            book: book,
                            user: user
                        })
                        newRating.save().then(
                            rating => {
                                res.status(200).json({rating: rating})
                            }
                        ).catch(error => {
                            res.status(500).json({error: error})
                        })
                    }).catch(error => {
                        res.status(500).json({error: error})
                    }
                    )
                }
        ).catch(error => {
            res.status(500).json({error: error});
        })
    },
    update: (req, res) => {
        let ratingId = req.params.id;
        Rating.findByIdAndUpdate(ratingId, {$set:{rating: req.body.rating}}).then(
            rating => {
                res.status(200).json({rating: rating})
            }
        ).catch(error => {
                res.status(500).json({error: error});
            }
        )
    },
    getUserBookRating: (req, res) => {
        Rating.find({book: mongoose.Types.ObjectId(req.params.bookid), 
                     user: mongoose.Types.ObjectId(req.params.userid)}).then(
                        rating => {
                            res.status(200).json(rating)
                        }
                     ).catch(error => {
                        res.status(500).json({error: error})
                     })
    },
    getBookRating: (req, res) => {
        Rating.find({book: mongoose.Types.ObjectId(req.params.bookid)}).then(
            ratings => {
                let ratingStat = {0:0, 1:0, 2:0, 3:0, 4:0, 5:0}
                let totalRating = 0
                let totalStar = 0
                ratings.forEach(rating => {
                    totalRating += 1
                    totalStar += rating.rating
                    ratingStat[rating.rating]+=1
                })

                let avgRating = 0
                if (totalRating !== 0 ){
                    Object.keys(ratingStat).forEach(function(key, index) {
                        ratingStat[key]= parseFloat(((ratingStat[key]/totalRating)*100).toFixed(2));
                    });
                    avgRating = parseFloat((totalStar/totalRating).toFixed(1))
                }
                
                res.status(200).json({ratingStat: ratingStat, totalRating: totalRating, avgRating: avgRating})
            }
        ).catch(error => {
            res.status(500).json({error: error})
         })
    }
}