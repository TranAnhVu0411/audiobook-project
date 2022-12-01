const mongoose = require('mongoose'),
Page = require('../models/page'),
Chapter = require('../models/chapter'),
fs = require('fs');

module.exports = {
    upload: (req, res) => {
        // Cloud upload
        const files = req.files;
        imgPath = []
        for (let i = 0; i<files.length; i++){
            imgPath.push(files[i].path);
        }
        res.status(200).json(imgPath);

        // Array upload
        // const files = req.files;
        // base64Img = []
        // for (let i = 0; i<files.length; i++){
        //     var img = fs.readFileSync(files[i].path);
        //     var encode_image = img.toString('base64');
        //     base64Img.push({
        //         data:  Buffer.from(encode_image, 'base64'),
        //         contentType: files[i].mimetype
        //     });
        // }
        // res.status(200).json(base64Img);

        // Single upload
        // var img = fs.readFileSync(req.file.path);
        // var encode_image = img.toString('base64');
        // var finalImg = {
        //     data:  Buffer.from(encode_image, 'base64'),
        //     contentType: req.file.mimetype
        // };
        // res.status(200).json(finalImg);
    },
    create: (req, res) => {
        Chapter.findById(req.body.chapterId).then(
            chapter => {
                let chapterPages = []
                let pageList = req.body.pageList;
                for (let i = 0; i<pageList.length; i++) {
                    chapterPages.push({
                        pageIndex: pageList[i].index, 
                        image: pageList[i].image,
                        status: 'preprocess',
                        chapter: chapter,
                    })
                }
                Page.insertMany(chapterPages).then(
                    pages => {
                        console.log(pages)
                        res.status(200).json(pages);
                    }
                ).catch(error => {
                    res.status(500).json(error);
                })
            }
        ).catch(error => {
            res.status(500).json(error);
        })
    }
}