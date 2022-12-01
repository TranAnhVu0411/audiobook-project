const mongoose = require('mongoose'),
Comment = require('../models/comment'),
Book = require('../models/book'),
User = require('../models/user');

module.exports = {
    create: (req, res) => {
        Book.findById(req.body.bookId).then(
            book => {
                User.findById(req.body.userId).then(
                    user =>{
                        let newComment = Comment({
                            comment: req.body.comment,
                            book: book,
                            user: user
                        })
                        newComment.save().then(
                            comment => {
                                res.status(200).json({comment: comment})
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
        let commentId = req.params.id;
        Comment.findByIdAndUpdate(commentId, {$set:{comment: req.body.comment}}).then(
            comment => {
                res.status(200).json({comment: comment})
            }
        ).catch(error => {
                res.status(500).json({error: error});
            }
        )
    },
    indexByBook: (req, res) => {
        let commentsInfo = []
        Comment.find({book: mongoose.Types.ObjectId(req.params.id)}, {}, {sort: { 'createdAt' : -1 }}).populate('user').then(
            comments => {
                res.status(200).json(comments)
            }
        ).catch(error => {
            res.status(500).json({error: error})
        })
    },
    totalComment: (req, res) => {
        Comment.find({book: mongoose.Types.ObjectId(req.params.id)}).then(
            comments => {
                res.status(200).json(comments.length)
            }
        ).catch(error => {
            res.status(500).json({error: error})
        })
    }
}