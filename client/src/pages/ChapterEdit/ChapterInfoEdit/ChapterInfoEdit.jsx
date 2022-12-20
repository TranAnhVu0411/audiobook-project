import React, {useState} from "react";
import { AiOutlineEdit, AiOutlineSave, AiOutlineClose } from "react-icons/ai"
import {pdf_axios_instance} from '../../../service/custom-axios';
import './style.scss';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ChapterInfoEdit = (props) => {
    const [originalChapterName, setOriginalChapterName] = useState(props.chapterInfo.name)
    const [chapterName, setChapterName] = useState(props.chapterInfo.name)
    const [editing, setEditing] = useState(false)
    let viewMode = {}
    let editMode = {}

    if (editing) {
        viewMode.display = "none"
    } else {
        editMode.display = "none"
    }

    const handleUpdate = async() => {
        if (chapterName === originalChapterName){
            setEditing(false)
        }else{
            try{
                props.setIsUpload(false)
                let chapterForm = new FormData();
                chapterForm.append('name', chapterName);
                let updateRes = pdf_axios_instance.put(`/chapters/${props.chapterId}`, chapterForm)
                console.log(updateRes)
                setOriginalChapterName(chapterName)
                props.setIsUpload(true)
                setEditing(false)
                toast.success("Update thông tin chương thành công", {position: toast.POSITION.TOP_CENTER});
            }catch(err){
                console.log(err)
                props.setIsUpoad(true)
                toast.error("Update thông tin chương thất bại", {position: toast.POSITION.TOP_CENTER});
            }
        }
    }
    
    return (
        <div className="chapter-info-edit">
            <div className="chapter-edit-header">
                <h1>Thông tin chương truyện</h1>
                <hr></hr>
            </div>
            <div className="info-form-header">
                <label>Tiêu đề chương</label>
                <div style={viewMode}>
                    <button style={{backgroundColor: "#428bca"}} onClick={() => {setEditing(true)}}>
                        <AiOutlineEdit/>
                    </button>
                </div>
                <div style={editMode}>
                    <button style={{backgroundColor: "#5eb95b"}} onClick={handleUpdate}>
                        <AiOutlineSave/>
                    </button>
                    <button style={{backgroundColor: "#D8000C"}}onClick={() => {
                        setChapterName(originalChapterName);
                        setEditing(false);
                    }}>
                        <AiOutlineClose/>
                    </button>
                </div>
            </div>
            <div className="info-form">
                <input 
                    type='text' 
                    style={editMode} 
                    value={chapterName}
                    onChange={e => {
                        setChapterName(e.target.value)
                    }}
                />
                <span style={viewMode}>
                    {chapterName}
                </span>
            </div>
        </div>
    )
}

export default ChapterInfoEdit;