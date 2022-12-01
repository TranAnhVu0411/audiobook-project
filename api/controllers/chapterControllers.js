const mongoose = require('mongoose'),
Chapter = require('../models/chapter'),
Book = require('../models/book'),
getChapterParams = body => {
    return {
        bookId: body.bookId,
        chapterName: body.chapterName,
        chapterIndex: body.chapterIndex,
    };
};
module.exports = {
    create: (req, res) => {
        let chapterParams = getChapterParams(req.body);
        Book.findById(chapterParams.bookId).then(
            book => {
                let newChapter = Chapter({
                    chapterName: chapterParams.chapterName,
                    chapterIndex: chapterParams.chapterIndex,
                    book: book,
                    status: 'preprocess',
                });
                newChapter.save().then(
                    chapter => {
                        res.status(200).json({chapter: chapter});
                    }
                ).catch(
                    error => {
                        res.status(500).json(error);
                    }
                ); 
            }
        ).catch(
            error => {
                res.status(500).json(error);
            }
        ); 
    },
    index: (req, res) => {
        Chapter.find({book: mongoose.Types.ObjectId(req.params.id)}).sort({index: 1}).then(
            chapters => {
                res.status(200).json(chapters);
            }
        ).catch(err => {
            res.status(500).json(err);
        })
    }
}