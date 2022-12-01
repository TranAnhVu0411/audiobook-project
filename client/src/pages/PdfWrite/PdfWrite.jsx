import React, {useState, useEffect} from "react";
import {main_axios_instance, pdf_axios_instance} from '../../service/custom-axios';
import {useLocation} from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { FaRegEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './style.scss';
import 'react-tabs/style/react-tabs.css';
import ReactTooltip from 'react-tooltip';

const PdfWrite = () => {
    const location = useLocation();
    const [book, setBook] = useState({});
    const [isLoad, setIsLoad] = useState(false);
    const [isUpload, setIsUpload] = useState(true);
    const bookId = location.pathname.split("/")[3];
    

    const [chapterForm, setChapterForm] = useState({
        id: "",
        chapterIndex: "",
        chapterName: "",
        chapterPageFrom: "",
        chapterPageTo: "",
    })
    const [mode, setMode] = useState({state: 'submit', id: ""})
    const [chapterList, setChapterList] = useState([])
    const [chapterPDF, setChapterPDF] = useState(null)

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

    const handleChapterForm = e => {
        setChapterForm(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    // Xử lý upload ảnh
    const handlePDF = e => {
        if (e.target.name === "chapterPDF"){
            setChapterPDF(e.target.files[0])
        }
    }

    const resetChapterForm = () => {
        setChapterForm({
            id: "",
            chapterIndex: 0,
            chapterName: "",
            chapterPageFrom: 0,
            chapterPageTo: 0,
        })
    }

    const handleShowEdit = (id) => {
        let editChapter = {}
        for (let i =0; i<chapterList.length; i++){
            if (chapterList[i].id===id){
                editChapter = chapterList[i]
                break;
            }
        }
        setChapterForm(prev => ({...prev,
            id: editChapter.id,
            chapterIndex: editChapter.chapterIndex,
            chapterName: editChapter.chapterName,
            chapterPageFrom: editChapter.chapterPageFrom,
            chapterPageTo: editChapter.chapterPageTo,
        }))
        setMode({state: 'edit', id: id})
    }

    const handleDestroyEdit = () => {
        resetChapterForm()
        setMode({state: 'submit', id: ""})
    }

    const handleDeleteItem = (id) => {
        setChapterList([
            ...chapterList.filter(chapter => {
              return chapter.id !== id;
            }),
          ])
    }

    const handleSubmitItem = (e) => {
        if (mode.state === "submit"){
            let newChapter = {
                id: uuidv4(),
                chapterIndex: chapterForm.chapterIndex,
                chapterName: chapterForm.chapterName,
                chapterPageFrom: chapterForm.chapterPageFrom,
                chapterPageTo: chapterForm.chapterPageTo
            };
            setChapterList(previousChapterList => [...previousChapterList, newChapter])
        }else{
            setChapterList(chapterList.map(chapter => {
                if (chapter.id === chapterForm.id){
                    chapter.chapterIndex = chapterForm.chapterIndex
                    chapter.chapterName = chapterForm.chapterName
                    chapter.chapterPageFrom = chapterForm.chapterPageFrom
                    chapter.chapterPageTo = chapterForm.chapterPageTo
                    return chapter
                }
                return chapter
            }))
        }
        resetChapterForm();
        setMode({state: 'submit', id: ""})
    }

    const handleSubmit = async(e) => {
        setIsUpload(false)
        e.preventDefault();
        let chaptersForm = new FormData();
        chapterList.forEach(chapter => {
            chaptersForm.append(`chapters`, JSON.stringify(chapter));
        });
        chaptersForm.append("bookId", bookId)
        chaptersForm.append("uploadType", 'pdf')
        let pdfForm = new FormData();
        pdfForm.append(`pdf`, chapterPDF);
        let bookStatusForm = new FormData();
        bookStatusForm.append('status', 'waiting');
        try{
            if (chapterPDF === null){
                throw "empty pdf"
            }
            const resBookStatus = await pdf_axios_instance.get(`/books/pdf/${bookId}`, bookStatusForm)
            console.log(resBookStatus)
            fetch(resBookStatus.data['url'], {
                method: 'put',
                body: pdfForm,
            })
            const resChapters = await pdf_axios_instance.post('/chapters', chaptersForm)
            console.log(resChapters)
            setIsUpload(true);
            toast.success("Upload pdf thành công, đang xử lý", {position: toast.POSITION.TOP_CENTER});
        }catch(err){
            setIsUpload(true);
            if (err === 'empty pdf') {
                console.log(err)
                toast.error("Vui lòng tải PDF lên", {position: toast.POSITION.TOP_CENTER});
            }else{
                console.log(err)
                toast.error("Xuất hiện lỗi phát sinh khi upload chương", {position: toast.POSITION.TOP_CENTER});
            }
        };

    }

    if (isLoad && isUpload){
        return (
            <div className="pdf-write">
                <div className="chapter-form">
                    <div className="pdf-write-header">
                        <h1>Upload PDF sách</h1>
                        <span>Tiêu đề: {book.title}</span>
                        <hr></hr>
                    </div>
                    <div className="file-input">
                        <input type='file' name="chapterPDF" id="chapterPDF" accept="application/pdf" onChange={handlePDF}/>
                    </div>
                    <div className="text-input">
                        <label>Chương số</label>
                        <input type="number" name="chapterIndex" value={chapterForm.chapterIndex} min={1} onChange={handleChapterForm} placeholder="Nhập số chương"/>
                    </div>
                    <div className="text-input">
                        <label>Tiêu đề chương</label>
                        <input type="text" name="chapterName" value={chapterForm.chapterName} onChange={handleChapterForm} placeholder="Nhập tên chương"/>
                    </div>
                    <div className="text-input">
                        <label>Bắt đầu từ trang</label>
                        <input type="number" name="chapterPageFrom" value={chapterForm.chapterPageFrom} min={1} onChange={handleChapterForm} placeholder="Nhập trang bắt đầu"/>
                    </div>
                    <div className="text-input">
                        <label>Kết thúc đến trang</label>
                        <input type="number" name="chapterPageTo" value={chapterForm.chapterPageTo} min={1} onChange={handleChapterForm} placeholder="Nhập trang kết thúc"/>
                    </div>
                    <div className='item-submit'>
                        <button className="item-submit-button" onClick={() => handleSubmitItem()}> 
                            <span>{mode.state==='submit' ? "Thêm vào bảng":"Cập nhật"}</span>
                        </button>
                        {mode.state==='submit' ? (
                            <></>
                        ):(
                            <button className="destroy-edit-button" onClick={() => handleDestroyEdit()}> 
                                <span>Huỷ</span>
                            </button>
                        )}
                    </div>
                </div>    
                <div className="chapter-table">
                    <table>
                        <thead>
                            <tr>
                                <th style={{width:"10%"}}>Số chương</th>
                                <th style={{width:"60%"}}>Tên chương</th>
                                <th style={{width:"10%"}}>Trang bắt đầu</th>
                                <th style={{width:"10%"}}>Trang kết thúc</th>
                                <th style={{width:"10%"}} colSpan={2}>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chapterList.map(chapter => {
                               return(
                               <tr key={chapter.id} className={`${mode.state==='edit' && mode.id===chapter.id ? "updating" : ""}`}>
                                    <td>{chapter.chapterIndex}</td>
                                    <td>{chapter.chapterName}</td>
                                    <td>{chapter.chapterPageFrom}</td>
                                    <td>{chapter.chapterPageTo}</td>
                                    <td>
                                        <button onClick={() => handleShowEdit(chapter.id)}>
                                            <FaRegEdit/>
                                        </button>
                                    </td>
                                    <td>
                                        {mode.state==='edit' && mode.id===chapter.id ? (
                                            <>
                                                <button data-tip data-for="rating-tooltip">
                                                    <FaTrash/>
                                                </button>
                                                <ReactTooltip id='rating-tooltip' effect="solid">
                                                    <span>Bạn không thể xoá khi đang sửa bản ghi</span>
                                                </ReactTooltip>
                                            </>
                                        ) : (
                                            <button onClick={() => handleDeleteItem(chapter.id)}>
                                                <FaTrash/>
                                            </button>
                                        )}   
                                    </td>
                                </tr>
                               )
                            })}
                        </tbody>
                    </table>
                    <div>
                        <button onClick={handleSubmit}>
                            Lưu thay đổi
                        </button>
                    </div>
                </div> 
            </div>
        )
    }else{
        return <LoadingScreen />
    }
}

export default PdfWrite;