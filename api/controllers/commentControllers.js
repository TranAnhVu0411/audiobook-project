const mongoose = require('mongoose'),
Comment = require('../models/comment'),
Book = require('../models/book'),
User = require('../models/user'),
Report = require('../models/report'),
filterOptions = { 
    0: 'available',
    1: 'pending',
    2: 'unavailable' 
};

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
        let updateContent = {}
        Object.keys(req.body).forEach(field => {
            updateContent[field]=req.body[field]
        })
        let commentId = req.params.id;
        Comment.findByIdAndUpdate(commentId, {$set:updateContent}).then(
            comment => {
                res.status(200).json({comment: comment})
            }
        ).catch(error => {
                res.status(500).json({error: error});
            }
        )
    },
    index: (req, res) => {
        let perPage = 4;
        let page = Number(req.query.page)||1;

        Comment.find({status: filterOptions[Number(req.query.filter)]}, {}, {sort: { 'createdAt' : -1 }}).skip((perPage*page)-perPage).limit(perPage).populate('user').populate('book').then(
            comments => {
                Comment.countDocuments({status: filterOptions[Number(req.query.filter)]}).then(
                    count => {
                        if(Number(req.query.filter)===1){
                            let promiseList = []
                            for (let i = 0; i < comments.length; i++){
                                promiseList.push(Report.find({comment: comments[i]._id, status: 'notchecked'}).populate('comment').populate('reportedUser'))
                            }
                            Promise.all(promiseList).then((result) => {
                                reportComments = []
                                for (let i = 0; i < result.length; i++){
                                    reportComments.push({comment: comments[i], report: result[i][0]})
                                }
                                res.status(200).json({
                                    comments: reportComments, 
                                    pageCount: Math.ceil(count / perPage), 
                                    total: count
                                })
                            }).catch(
                                error => {
                                    res.status(500).json(error);
                                }
                            )
                        }else{
                            res.status(200).json({
                                comments: comments.map(comment => {return {comment: comment}}), 
                                pageCount: Math.ceil(count / perPage), 
                                total: count
                            })
                        }
                    }
                ).catch(
                    error => {
                        res.status(500).json(error);
                    }
                )
            }
        ).catch(error => {
            res.status(500).json({error: error})
        })
    },
    indexByBook: (req, res) => {
        let perPage = 4;
        let page = Number(req.query.page)||1;
        Comment.find({book: mongoose.Types.ObjectId(req.params.id)}, {}, {sort: { 'createdAt' : -1 }}).skip((perPage*page)-perPage).limit(perPage).populate("user").then(
            comments => {
                Comment.countDocuments({book: mongoose.Types.ObjectId(req.params.id)}).then(
                    count => {
                        if(req.query.role==='admin'){
                            let promiseList = []
                            for (let i = 0; i < comments.length; i++){
                                promiseList.push(Report.find({comment: comments[i]._id, status: 'notchecked'}).populate('comment').populate('reportedUser'))
                            }
                            Promise.all(promiseList).then((result) => {
                                reportComments = []
                                for (let i = 0; i < result.length; i++){
                                    reportComments.push({comment: comments[i], report: (result[i].length !== 0?result[i][0]:null)})
                                }
                                res.status(200).json({
                                    comments: reportComments, 
                                    pageCount: Math.ceil(count / perPage), 
                                    total: count
                                })
                              }).catch(
                                error => {
                                    res.status(500).json(error);
                                }
                              )
                        }else{
                            res.status(200).json({
                                comments: comments.map(comment => {return {comment: comment}}), 
                                pageCount: Math.ceil(count / perPage), 
                                total: count
                            });
                        }
                    }
                ).catch(
                    error => {
                        res.status(500).json(error);
                    }
                )
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