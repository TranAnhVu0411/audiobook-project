const mongoose = require('mongoose'),
Comment = require('../models/comment'),
User = require('../models/user'),
Report = require('../models/report');


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
}