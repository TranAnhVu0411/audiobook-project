const mongoose = require('mongoose'),
Comment = require('../models/comment'),
User = require('../models/user'),
Report = require('../models/report'),
filterOptions = { 
    0: 'notchecked',
    1: 'checked'
};;

module.exports = {
    create: (req, res) => {
        Comment.findById(req.body.commentId).then((comment) => {
            User.findById(req.body.userId).then((user) => {
                let newReport = Report({
                    comment: comment,
                    reportedUser: user,
                    reportContent: req.body.content
                })
                newReport.save().then(
                    report => {
                        res.status(200).json({report: report})
                    }
                ).catch(error => {
                    res.status(500).json({error: error})
                })
            }).catch((error) => {
                res.status(500).json({error: error})
            })
        }).catch(error => {
            res.status(500).json({error: error})
        })
    },
    update: (req, res) => {
        let updateContent = {}
        Object.keys(req.body).forEach(field => {
            updateContent[field]=req.body[field]
        })
        let reportId = req.params.id;
        Report.findByIdAndUpdate(reportId, {$set:updateContent}).then(
            report => {
                res.status(200).json({report: report})
            }
        ).catch(error => {
                res.status(500).json({error: error});
            }
        )
    },
    indexByBook: (req, res) => {
        Report.find().populate('comment').populate('reportedUser').then(
            reports => {
                let result = reports.reduce((result, report) => {
                    if (report.comment.book.toString()===req.params.id){
                        if (report.status === 'notchecked'){
                            result.push(report)
                        }
                    }
                    return result
                }, [])
                res.status(200).json(result)
            }
        ).catch(error => {
            res.status(500).json({error: error})
        })
    },
    index: (req, res) => {
        let perPage = 4;
        let page = Number(req.query.page)||1;

        Report.find({status: filterOptions[Number(req.query.filter)]}, {}, {sort: { 'createdAt' : -1 }}).skip((perPage*page)-perPage).limit(perPage).populate('comment').populate('reportedUser').then(
            reports => {
                Report.countDocuments({status: filterOptions[Number(req.query.filter)]}).then(
                    count => {
                        res.status(200).json({
                            reports: reports, 
                            pageCount: Math.ceil(count / perPage), 
                            total: count
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
    indexCurrent: (req, res) => {
        Report.find({status: 'notchecked'}, {}, { sort: { 'createdAt' : -1 }}).limit(9).populate('comment').populate('reportedUser').then(
            reports => {
                res.status(200).json({reports: reports})
            }
        ).catch(error => {
            res.status(500).json({error: error})
        })
    }
}