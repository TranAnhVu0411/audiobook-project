import React, {useState, useEffect} from "react";
import {main_axios_instance, pdf_axios_instance} from '../../service/custom-axios';
import {useLocation} from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { FaUpload, FaTrash, FaRegSave } from "react-icons/fa";
import ImageList from "./ImageList/ImageList";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './style.scss';
import Preview from "./Preview/Preview";

const ChapterWrite = () => {
    const location = useLocation();
    const [book, setBook] = useState({});
    const [isLoad, setIsLoad] = useState(false);
    const [isUpload, setIsUpload] = useState(true);
    const bookId = location.pathname.split("/")[3];
    const [clickImg, setClickImg] = useState({
        id: null,
        imageShow: null
    })

    const [chapterTextInput, setChapterTextInput] = useState({
        chapterIndex: "",
        chapterName: "",
    })
    const [chapterImgs, setChapterImgs] = useState([])

    const resetInput = () => {
        setChapterTextInput({
            chapterIndex: "",
            chapterName: "",
        });
        setChapterImgs([]);
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await main_axios_instance.get(`/book/${bookId}`);
            setBook(res.data);
            setIsLoad(true);
          } catch (err) {
            console.log(err);
          }
        };
        fetchData();
    }, [bookId]);

    const handleChapterTextInput = e => {
        setChapterTextInput(prev => ({...prev, [e.target.name]: e.target.value}))
    }
    const handlePreviewImages = e => {
        if (e.target.name === "chapterImgs"){
            for (let i = 0; i < e.target.files.length; i++){
                let newImage = {
                    id: uuidv4(),
                    imageSave: e.target.files[i],
                    imageShow: URL.createObjectURL(e.target.files[i]),
                };
                setChapterImgs(previousChapterImg => [...previousChapterImg, newImage])
            }
        }
    }

    // Lấy ảnh được click
    const getClickImg = (id) => {
        setClickImg(chapterImgs.filter(img => {
            if (img.id === id){
              return {
                id: img.id,
                imageShow: img.imageShow
              }
            }
           })[0]);
    }

    // Xoá ảnh
    const deleteImg = (id) => {
        setChapterImgs([
            ...chapterImgs.filter(img => {
              return img.id !== id;
            }),
          ]);
        if (clickImg.id === id) {
            setClickImg({
                id: null,
                imageShow: null
            })
        }
    };

    const deleteAllImgs = () => {
        setChapterImgs([]);
        setClickImg({
            id: null,
            imageShow: null
        })
    };

    const handleSubmit = async(e) => {
        setIsUpload(false)
        e.preventDefault();
        try{
            if (chapterImgs.length===0){
                throw('empty image')
            }
            let chapterForm = new FormData();
            chapterForm.append("chapter", JSON.stringify(chapterTextInput))
            chapterForm.append("bookId", bookId)
            chapterForm.append("uploadType", "image")
            const resChapter = await pdf_axios_instance.post('/chapters', chapterForm)
            console.log(resChapter)
            let pagesForm = new FormData();
            pagesForm.append('chapterId', resChapter.data.chapterId)
            pagesForm.append('numPages', chapterImgs.length)
            const resPages = await pdf_axios_instance.post('/pages', pagesForm)
            console.log(resPages)
            for (let i = 0; i < resPages.data.urls.length; i++){
                let pageImgForm = new FormData()
                pageImgForm.append('pageimg', chapterImgs[i].imageSave)
                await fetch(resPages.data.urls[i], {
                    method: 'put',
                    body: pageImgForm,
                })
            }

            setIsUpload(true);
            toast.success("Upload chương thành công, đang xử lý", {position: toast.POSITION.TOP_CENTER});
            resetInput();
        }catch(err){
            setIsUpload(true);
            if (err === 'empty image'){
                console.log(err)
                toast.error("Vui lòng tải ảnh lên", {position: toast.POSITION.TOP_CENTER});
            }else{
                console.log(err)
                toast.error("Xuất hiện lỗi phát sinh khi upload chương", {position: toast.POSITION.TOP_CENTER});
            }
        };
    }

    if (isLoad && isUpload){
        return (
            <div className="chapter-write">
                <div className="text-form">
                    <div className="chapter-write-header">
                        <h1>Thêm chương truyện mới</h1>
                        <span>Tiêu đề: {book.title}</span>
                        <hr></hr>
                    </div>
                    <div className="text-input">
                        <label>Chương số</label>
                        <input type="number" name="chapterIndex" value={chapterTextInput.chapterIndex} onChange={handleChapterTextInput} min="0" placeholder="Nhập số chương"/>
                    </div>
                    <div className="text-input">
                        <label>Tiêu đề chương</label>
                        <input type="text" name="chapterName" value={chapterTextInput.chapterName} onChange={handleChapterTextInput} placeholder="Nhập tên chương"/>
                    </div>
                </div>     
                <div className="file-input">
                    <h2>Upload</h2>
                    <div className='button'>
                        <input type="file" name="chapterImgs" id="chapterImgs" accept="image/png, image/jpg, image/jpeg" onChange={handlePreviewImages} style={{display: "none"}} multiple/>
                        <label className='upload' htmlFor="chapterImgs"><FaUpload/> Upload ảnh</label>
                        <button className='delete' onClick={deleteAllImgs}>
                            <FaTrash className="icon"/> 
                            <span>Xoá toàn bộ</span>
                        </button>
                    </div>
                    <ImageList chapterImgs={chapterImgs} deleteImg={deleteImg} getClickImg={getClickImg}/>
                    <Preview image={clickImg} />
                    <div className='submit'>
                        <button onClick={handleSubmit}> 
                            <FaRegSave className='icon'/> 
                            <span>Lưu thay đổi</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }else{
        return <LoadingScreen />
    }
}

export default ChapterWrite;