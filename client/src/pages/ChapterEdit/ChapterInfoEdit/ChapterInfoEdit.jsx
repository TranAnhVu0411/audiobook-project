import React, {useState} from "react";
import { AiOutlineEdit, AiOutlineSave, AiOutlineClose } from "react-icons/ai"
import './style.scss';


const ChapterInfoEdit = (props) => {
    const [chapterNameInput, setChapterNameInput] = useState(props.chapter.name)
    const [editing, setEditing] = useState(false)
    let viewMode = {}
    let editMode = {}

    if (editing) {
        viewMode.display = "none"
    } else {
        editMode.display = "none"
    }
    
    return (
        <div className="chapter-info-edit">
            <div className="chapter-edit-header">
                <h1>Thông tin chương truyện</h1>
                <hr></hr>
            </div>
            <div className="info-form-header">
                <span><label>Chương số: </label><span>{props.chapter.index}</span></span>
                <div className="info-form-button">
                    <label>Tiêu đề chương</label>
                    <div style={viewMode}>
                        <button style={{backgroundColor: "#428bca"}} onClick={() => {setEditing(true)}} title="Chỉnh sửa tên chương">
                            <AiOutlineEdit/>
                        </button>
                    </div>
                    <div style={editMode}>
                        <button 
                            style={{backgroundColor: "#5eb95b"}} 
                            onClick={() => {
                                props.handleChapterName(chapterNameInput);
                                setEditing(false);
                            }}
                            title="Lưu thay đổi"
                        >
                            <AiOutlineSave/>
                        </button>
                        <button 
                            style={{backgroundColor: "#D8000C"}} 
                            onClick={() => {
                                setEditing(false);
                                setChapterNameInput(props.chapter.name);
                            }} 
                            title="Huỷ thay đổi"
                        >
                            <AiOutlineClose/>
                        </button>
                    </div>
                </div>
            </div>
            <div className="info-form">
                <input 
                    type='text' 
                    style={editMode} 
                    value={chapterNameInput}
                    onChange={e => {
                        setChapterNameInput(e.target.value)
                    }}
                />
                <span style={viewMode}>
                    {props.chapter.name}
                </span>
            </div>
        </div>
    )
}

export default ChapterInfoEdit;