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
import ImageViewer from "react-simple-image-viewer";
import axios from 'axios';

const ChapterWrite = () => {
    const location = useLocation();
    const [book, setBook] = useState({});
    const [numChapter, setNumChapter] = useState(0);
    const [isLoad, setIsLoad] = useState(false);
    const [isUpload, setIsUpload] = useState(true);
    const bookId = location.pathname.split("/")[3];

    const [chapterName, setChapterName] = useState("")
    const [chapterImgs, setChapterImgs] = useState([])

    const resetInput = () => {
        setChapterName("");
        setChapterImgs([]);
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const bookRes = await main_axios_instance.get(`/book/${bookId}`);
            setBook(bookRes.data);
            const chaptersRes = await pdf_axios_instance.get(`/books/${bookId}`);
            setNumChapter(chaptersRes.data['chapters'].length);
            setIsLoad(true);
          } catch (err) {
            console.log(err);
          }
        };
        fetchData();
    }, [bookId, isUpload]);

    const handlePreviewImages = (e) => {
        for (let i = 0; i < e.target.files.length; i++){
            let newImage = {
                id: uuidv4(),
                imageSave: e.target.files[i],
                imageShow: URL.createObjectURL(e.target.files[i]),
            };
            setChapterImgs(previousChapterImg => [...previousChapterImg, newImage])
        }
    }  

    // Xoá ảnh
    const deleteImg = (id) => {
        setChapterImgs([
            ...chapterImgs.filter(img => {
              return img.id !== id;
            }),
          ]);
    };

    const deleteAllImgs = () => {
        setChapterImgs([]);
    };

    // Preview 
    const [clickImg, setClickImg] = useState(null)
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const openImageViewer = (id) => {
        let image = chapterImgs.filter(img => (img.id === id))[0]
        setClickImg(image.imageShow);
        setIsViewerOpen(true);
      }

    const closeImageViewer = () => {
        setClickImg(null);
        setIsViewerOpen(false);
    };

    // Reorder vị trí ảnh
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = (fromIndex, toIndex) => {
        /* IGNORES DRAG IF OUTSIDE DESIGNATED AREA */
        if (toIndex < 0) return;
    
        const list = reorder(chapterImgs, fromIndex, toIndex);
        return setChapterImgs(list);
    };

    // Submit
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            if (chapterImgs.length===0){
                throw('empty image')
            }
            let chapterForm = new FormData();

            // Thêm chương mới vào database
            chapterForm.append("index", numChapter+1)
            chapterForm.append("name", chapterName)
            chapterForm.append("bookId", bookId)
            const resChapter = await pdf_axios_instance.post('/chapters', chapterForm)
            console.log(resChapter)

            // Thêm trang mới vào database
            let pageRequestsList = []
            for (let i = 0; i<chapterImgs.length; i++){
                let pageForm = new FormData();
                pageForm.append('chapterId', resChapter.data.chapterId)
                pageForm.append('index', i+1)
                pageRequestsList.push(pdf_axios_instance.post('/pages', pageForm))
            }
            let pageResponsesList = await axios.all(pageRequestsList)
            console.log(pageResponsesList)

            // Tạo Presigned URL
            let urlRequestsList = []
            for (let i = 0; i<chapterImgs.length; i++) {
                let urlForm = new FormData();
                urlForm.append('upload-type', 'PUT');
                urlForm.append('type', 'page');
                urlForm.append('id', pageResponsesList[i].data.pageId)
                urlForm.append('data-type', 'image')
                urlRequestsList.push(pdf_axios_instance.post('/urls', urlForm))
            }
            let urlResponsesList = await axios.all(urlRequestsList)
            console.log(urlResponsesList)
            
            // Upload ảnh lên cloud
            let uploadRequestsList = []
            for (let i = 0; i<urlResponsesList.length; i++){
                let pageHeaders = new Headers();
                pageHeaders.append("Content-Type", chapterImgs[i].imageSave.type);
                uploadRequestsList.push(fetch(urlResponsesList[i].data.url, {
                    method: 'PUT',
                    headers: pageHeaders,
                    body: chapterImgs[i].imageSave,
                    redirect: 'follow'
                }))
            }
            const uploadResponsesList = await Promise.all(uploadRequestsList)
            console.log(uploadResponsesList)

            // Xử lý OCR+Audio
            let preprocessRequestsList = []
            for (let i = 0; i<pageResponsesList.length; i++) {
                let preprocessForm = new FormData();
                preprocessForm.append('pageId', pageResponsesList[i].data.pageId)
                preprocessRequestsList.push(pdf_axios_instance.post('/preprocess/page', preprocessForm))
            }
            let preprocessResponsesList = await axios.all(preprocessRequestsList)
            console.log(preprocessResponsesList)
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
                        <h1>Thêm chương truyện theo ảnh</h1>
                        <span>Tiêu đề sách: {book.title}</span>
                        <hr></hr>
                    </div>
                    <span>
                        <h3>Chương số: {numChapter+1}</h3>
                        <small>*Chương mới thêm sẽ nằm ở vị trí cuối cùng trong danh sách chương của sách</small>
                    </span>
                    <div className="text-input">
                        <label>Tiêu đề chương</label>
                        <input type="text" name="name" value={chapterName} onChange={e => {setChapterName(e.target.value)}} placeholder="Nhập tên chương"/>
                    </div>
                </div>     
                <div className="file-input">
                    <h2>Upload Ảnh</h2>
                    <div className='file-input-button'>
                        <input 
                            type="file" 
                            name="chapterImgs" 
                            id="chapterImgs" 
                            accept="image/png, image/jpg, image/jpeg" 
                            onChange={handlePreviewImages}
                            onClick={e => {e.target.value = null}} 
                            style={{display: "none"}} 
                            multiple
                        />
                        <label className='file-input-upload' htmlFor="chapterImgs"><FaUpload/> Upload ảnh</label>
                        <button className='file-input-delete' onClick={deleteAllImgs}>
                            <FaTrash className="icon"/> 
                            <span>Xoá toàn bộ</span>
                        </button>
                    </div>
                    <ImageList chapterImgs={chapterImgs} deleteImg={deleteImg} openImageViewer={openImageViewer} onDragEnd={onDragEnd}/>
                    {isViewerOpen ? 
                        <ImageViewer 
                            src={[clickImg]}
                            currentIndex={0}
                            onClose={closeImageViewer}
                            backgroundStyle={{
                            backgroundColor: "rgba(0,0,0,0.9)"
                            }}
                            closeOnClickOutside={true}
                        /> : 
                        <></>
                    }
                    <div className='chapter-submit'>
                        <button onClick={(e) => {
                            setIsUpload(false)
                            handleSubmit(e)
                        }}> 
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