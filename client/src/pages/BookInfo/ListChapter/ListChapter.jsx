import React, { Fragment, useContext, useState } from 'react';
import { AuthContext } from "../../../context/AuthContextProvider";
import { getRole } from '../../../context/role';
import ReactTooltip from 'react-tooltip';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import { FaHeadphonesAlt, FaRegEdit, FaFilePdf, FaImages, FaList, FaRegSave, FaRegWindowClose } from 'react-icons/fa'
import { CgReorder } from 'react-icons/cg'
import {GoTriangleLeft, GoTriangleRight} from 'react-icons/go';
import ReactDragListView from "react-drag-listview";
import {pdf_axios_instance} from '../../../service/custom-axios';
import axios from 'axios';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import UploadBookPDF from './UploadBookPDF/UploadBookPDF'

const ListChapter = (props) => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    const handleTableButton = (chapter_id) => {
        if (getRole(currentUser)==='guest'){
            return (
                <>
                    <button data-tip data-for="chapter-tooltip" onClick={() => {navigate('/login')}} title="Đọc audio book">
                        <FaHeadphonesAlt/>
                    </button>
                    <ReactTooltip id='chapter-tooltip' effect="solid">
                        <span>Bạn phải đăng nhập để có thể sử dụng chức năng này</span>
                    </ReactTooltip>
                </>
            )
        }else{
            return (
                <div className='chapter-item-button'>
                    {getRole(currentUser)==='admin' ?
                        <Fragment>
                            <button onClick={() => navigate(`/chapter/${chapter_id}/edit`)}>
                                <FaRegEdit/>
                            </button>
                            <button className='chapter-dragger' style={{display: isReorder ? "flex" : "none"}}>
                                <FaList/>
                            </button>
                        </Fragment> 
                        :
                        <Fragment>
                            {
                                currentUser.info.status === "available" ? (
                                    <button onClick={() => navigate(`/chapter/${chapter_id}`)}>
                                        <FaHeadphonesAlt/>
                                    </button>
                                ):(
                                    <>
                                        <button data-tip data-for="chapter-tooltip" title="Đọc audio book">
                                            <FaHeadphonesAlt/>
                                        </button>
                                        <ReactTooltip id='chapter-tooltip' effect="solid">
                                            <span>Bạn không thực hiện được chức năng này do tài khoản của bạn đã bị khoá</span>
                                        </ReactTooltip>
                                    </>
                                )
                            }
                        </Fragment> 
                    }
                </div>
            )
        }
    }

    // biến thiết lập trạng thái mở/đóng upload button
    const [openUpload, setOpenUpload] = useState(false);
    const handleIcon = () => {
        if(openUpload){
            return <GoTriangleLeft className="icon"/>
        }else{
            return <GoTriangleRight className="icon"/>
        }
    }
    let viewUploadMode = {}
    if(openUpload){
        viewUploadMode.display = "flex"
        viewUploadMode.gap = 10;
        viewUploadMode.flexDirection="row"
    }else{
        viewUploadMode.display = "none"
    }

    // Thay đổi thứ tự trong chapters
    let [isReorder, setIsReorder] = useState(false);
    let [chapterList, setChapterList] = useState(props.chapters)
    let [originalChapterList, setOriginalChapterList] = useState(props.chapters)
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = (fromIndex, toIndex) => {
        /* IGNORES DRAG IF OUTSIDE DESIGNATED AREA */
        if (toIndex < 0) return;
    
        const list = reorder(chapterList, fromIndex, toIndex);
        return setChapterList(list);
    };
    
    // Lưu thay đổi lên database
    const saveChaptersReorder = async() => {
        props.setIsLoad(false)
        try{
            let updateRequestsList = []
            for (let i = 0; i<chapterList.length; i++) {
                let chapterForm = new FormData();
                chapterForm.append('index', i+1);
                updateRequestsList.push(pdf_axios_instance.put(`/chapters/${chapterList[i]._id.$oid}`, chapterForm))
            }
            let updateResponsesList = await axios.all(updateRequestsList)
            console.log(updateResponsesList)
            setOriginalChapterList(chapterList)
            props.setIsLoad(true)
            toast.success("Update vị trí chương thành công", {position: toast.POSITION.TOP_CENTER});
        }catch(err){
            console.log(err)
            props.setIsLoad(true)
            toast.error("Update vị trí chương thất bại", {position: toast.POSITION.TOP_CENTER});
        }
    }

    return (
        <div className="list-chapter">
            <div className="list-chapter-button" style={{display: getRole(currentUser)==='admin'?'flex':'none'}}>
                <UploadBookPDF
                    bookPdfStatus={props.bookPdfStatus} 
                    pdf={props.pdf}
                    bookId={props.bookId}
                    handlePdfChange={props.handlePdfChange}
                    setIsLoad={props.setIsLoad}
                />
                <div className='upload-chapter-buttons'>
                    <button className="button" onClick={() => setOpenUpload(!openUpload)}>
                        <span>Thêm chương</span>
                        {
                            handleIcon()
                        }
                    </button>
                    <div className="upload-chapter-options" style={viewUploadMode}>
                        <button onClick = {() => navigate(`/book/info/${props.bookId}/chapter/new`)}>
                            <FaImages className="icon"/> 
                            <span>Thêm theo ảnh</span>
                        </button>
                        <button 
                            onClick = {() => 
                                props.bookPdfStatus?
                                navigate(`/book/info/${props.bookId}/pdf/new`):
                                toast.warn("Vui lòng upload pdf sách", {position: toast.POSITION.TOP_CENTER})
                            }
                            >
                            <FaFilePdf className="icon"/> 
                            <span>Thêm theo PDF sách</span>
                        </button>
                    </div>
                </div>
            </div>
            <ReactDragListView
                lineClassName="dragLine"
                handleSelector='button.chapter-dragger'
                onDragEnd={(fromIndex, toIndex) =>
                    onDragEnd(fromIndex, toIndex)
                }
            >
                <table>
                    <thead>
                        <tr>
                            <th style={{width:"15%"}}>Chương số</th>
                            <th style={{width:"70%"}}>Tên chương</th>
                            <th style={{width:"15%"}}>
                                <div style={{display: props.chapters.length<=1 ? 'none': (isReorder ? 'none' : 'flex')}}>
                                    <button onClick={() =>(setIsReorder(!isReorder))} title="Thay đổi thứ tự chương">
                                        <CgReorder/>
                                    </button>
                                </div>
                                <div style={{display: props.chapters.length<=1 ? 'none': (!isReorder ? 'none' : 'flex'), gap: 10}}>
                                    <button 
                                        onClick={() =>{
                                            saveChaptersReorder(chapterList)
                                            setIsReorder(!isReorder)
                                        }}
                                        title="Lưu thứ tự chương mới"
                                    >
                                        <FaRegSave/>
                                    </button>
                                    <button 
                                        onClick={() =>{
                                            setChapterList(originalChapterList)
                                            setIsReorder(!isReorder)
                                        }}
                                        title="Huỷ thay đổi"
                                    >
                                        <FaRegWindowClose/>
                                    </button>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {chapterList.map((chapter, idx) => {
                            return(
                            <tr key={chapter._id.$oid}>
                                <td>{idx+1}</td>
                                <td>{chapter.name}</td>
                                <td>
                                    {handleTableButton(chapter._id.$oid)}
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
            </ReactDragListView>
        </div>
    )
}

export default ListChapter;