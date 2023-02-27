const mongoose = require('mongoose'),
Book = require('../models/book'),
Favourite = require('../models/favourite'),
cloudinary = require("../config/cloudinary"),
getBookParams = body => {
    return {
        title: body.title,
        authors: body.authors,
        categories: body.categories,
        description: body.description,
    };
},
url2cat = {
    'kinh_doanh': 'Kinh doanh',
    'ky_nang_song': 'Kỹ năng sống',
    'tai_chinh': 'Tài chính',
    'marketing': 'Marketing',
    'ton_giao': 'Tôn giáo',
    'tam_ly': 'Tâm lý',
    'hanh_phuc': 'Hạnh phúc',
    'song_khoe': 'Sống khoẻ',
    'thieu_nhi': 'Thiếu nhi',
    'tieu_thuyet': 'Tiểu thuyết'
};

module.exports = {
    create: (req, res) => {
        let bookParams = getBookParams(req.body);
        Book.create(bookParams).then(
            book => {
                cloudinary.uploader.upload(req.file.path, {
                    folder: "audiobook/bookcover", 
                    public_id: book._id,
                    format: 'png',
                }).then(
                    imgUrl => {
                        Book.findByIdAndUpdate(book._id, {$set: {image: imgUrl.secure_url}}).then(
                            bookUpdated => {
                                res.status(200).json({book: bookUpdated});
                            }
                        ).catch(
                            error=>{
                                console.log(error)
                                res.status(500).json(error);
                            }
                        );
                    }
                ).catch(
                    error=>{
                        console.log(error)
                        res.status(500).json(error);
                    }
                );
            }
        ).catch(
            error=>{
                console.log(error)
                res.status(500).json(error);
            }
        );
    },
    update: (req, res) => {
        let bookParams = getBookParams(req.body);
        cloudinary.uploader.upload(req.file.path, {
            folder: "audiobook/bookcover", 
            public_id: req.params.id,
            format: 'png',
        }).then(imgUrl => {
            bookParams.image=imgUrl.url
            Book.findByIdAndUpdate(req.params.id, {$set:bookParams}).then(
                book => {
                    res.status(200).json({book: book});
                }
            ).catch(
                error=>{
                    res.status(500).json(error);
                }
            );
        }).catch(
            error=>{
                res.status(500).json(error);
            }
        );
    },
    show: (req, res) => {
        Book.findById(req.params.id).then(
            book => {
                res.status(200).json(book);
            }
        ).catch(
            error => {
                res.status(500).json(error);
            }
        );
    },
    indexCurrent: (req, res) => {
        Book.find({}, {}, { sort: { 'createdAt' : -1 }}).limit(9).then(
            books => {
                if(req.query.userId !==undefined){
                    let promiseList = []
                    for (let i = 0; i < books.length; i++){
                        promiseList.push(Favourite.find({book: books[i]._id, user: req.query.userId}))
                    }
                    Promise.all(promiseList).then((result) => {
                        favouriteBookId = []
                        for (let i = 0; i < result.length; i++){
                            if (result[i].length !== 0){
                                favouriteBookId.push(result[i][0].book)
                            }
                        }
                        res.status(200).json({books: books, favouriteBookId: favouriteBookId});
                      }).catch(
                        error => {
                            res.status(500).json(error);
                        }
                      )
                }else{
                    res.status(200).json({books: books, favouriteBookId: []});
                }
            }
        ).catch(
            error => {
                res.status(500).json(error);
            }
        )
    },
    index: (req, res) => {
        // Thiết lập số lượng sách trong 1 trang
        let perPage = 8;
        let page = req.query.page||1;

        let categorySearch = {}
        let orderSearch = {}
        if (req.params.cat !== undefined){
            // Nếu vào trang book/category/:cat
            categorySearch = {categories: {"$in": [url2cat[req.params.cat]]}}
        }else{
            // Nếu vào trang book/advance-search
            if(req.query.cat !== undefined){
                let category_list = req.query.cat.split(',')
                let queryClause = []
                for(let category of category_list){
                    queryClause.push({categories: url2cat[category]})
                }
                categorySearch = {"$and": queryClause};
            }
        }
        if (req.query.sort !== undefined){
            if (req.query.sort == 0){
                orderSearch = {sort: { 'createdAt' : -1 }}
            }else if (req.query.sort == 1){
                orderSearch = {sort: { 'createdAt' : 1 }}
            }
        }else{
            orderSearch = {sort: { 'createdAt' : -1 }}
        }
        Book.find(categorySearch, {}, orderSearch).skip((perPage*page)-perPage).limit(perPage).then(
            books => {
                Book.countDocuments(categorySearch).then(
                    count => {
                        if(req.query.userId !==undefined){
                            let promiseList = []
                            for (let i = 0; i < books.length; i++){
                                promiseList.push(Favourite.find({book: books[i]._id, user: req.query.userId}))
                            }
                            Promise.all(promiseList).then((result) => {
                                favouriteBookId = []
                                for (let i = 0; i < result.length; i++){
                                    if (result[i].length !== 0){
                                        favouriteBookId.push(result[i][0].book)
                                    }
                                }
                                res.status(200).json({books: books, pageCount: Math.ceil(count / perPage), total: count, favouriteBookId: favouriteBookId});
                              }).catch(
                                error => {
                                    res.status(500).json(error);
                                }
                              )
                        }else{
                            res.status(200).json({books: books, pageCount: Math.ceil(count / perPage), total: count, favouriteBookId: []});
                        }
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
    total: (req, res) => {
        Book.countDocuments().then(
            count => {
                res.status(200).json({total: count});
            }
        )
    }
}