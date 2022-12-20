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
        index: "",
        name: "",
        from: "",
        to: "",
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
            index: "",
            name: "",
            from: "",
            to: "",
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
            index: editChapter.index,
            name: editChapter.name,
            from: editChapter.from,
            to: editChapter.to,
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
                index: chapterForm.index,
                name: chapterForm.name,
                from: chapterForm.from,
                to: chapterForm.to
            };
            setChapterList(previousChapterList => [...previousChapterList, newChapter])
        }else{
            setChapterList(chapterList.map(chapter => {
                if (chapter.id === chapterForm.id){
                    chapter.index = chapterForm.index
                    chapter.name = chapterForm.name
                    chapter.from = chapterForm.from
                    chapter.to = chapterForm.to
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
        
        try{
            if (chapterPDF === null){
                throw "empty pdf"
            }

            let urlForm = new FormData();
            urlForm.append('type', 'book');
            urlForm.append('id', bookId)
            urlForm.append('data-type', 'pdf')
            const resUrl = await pdf_axios_instance.post('/url', urlForm)
            console.log(resUrl)
            var pdfHeaders = new Headers();
            pdfHeaders.append("Content-Type", chapterPDF.type);
            await fetch(resUrl.data.url, {
                method: 'PUT',
                headers: pdfHeaders,
                body: chapterPDF,
                redirect: 'follow'
            })

            for (let i = 0; i <chapterList.length; i++) {
                let chapterForm = new FormData();
                chapterForm.append("index", chapterList[i].index)
                chapterForm.append("name", chapterList[i].name)
                chapterForm.append("bookId", bookId)
                chapterForm.append("status", "notready")
                chapterForm.append("from", chapterList[i].from)
                chapterForm.append("to", chapterList[i].to)
                const resChapter = await pdf_axios_instance.post('/chapters', chapterForm)
                console.log(resChapter)
            }
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
                        <input type="number" name="index" value={chapterForm.index} min={1} onChange={handleChapterForm} placeholder="Nhập số chương"/>
                    </div>
                    <div className="text-input">
                        <label>Tiêu đề chương</label>
                        <input type="text" name="name" value={chapterForm.name} onChange={handleChapterForm} placeholder="Nhập tên chương"/>
                    </div>
                    <div className="text-input">
                        <label>Bắt đầu từ trang</label>
                        <input type="number" name="from" value={chapterForm.from} min={1} onChange={handleChapterForm} placeholder="Nhập trang bắt đầu"/>
                    </div>
                    <div className="text-input">
                        <label>Kết thúc đến trang</label>
                        <input type="number" name="to" value={chapterForm.to} min={1} onChange={handleChapterForm} placeholder="Nhập trang kết thúc"/>
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
                                    <td>{chapter.index}</td>
                                    <td>{chapter.name}</td>
                                    <td>{chapter.from}</td>
                                    <td>{chapter.to}</td>
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