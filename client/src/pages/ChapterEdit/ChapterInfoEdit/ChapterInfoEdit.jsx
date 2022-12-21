import React, {useState} from "react";
import { AiOutlineEdit, AiOutlineSave, AiOutlineClose } from "react-icons/ai"
import './style.scss';


const ChapterInfoEdit = (props) => {
    const [chapterNameInput, setChapterNameInput] = useState(props.chapterName)
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
                <label>Tiêu đề chương</label>
                <div style={viewMode}>
                    <button style={{backgroundColor: "#428bca"}} onClick={() => {setEditing(true)}}>
                        <AiOutlineEdit/>
                    </button>
                </div>
                <div style={editMode}>
                    <button style={{backgroundColor: "#5eb95b"}} onClick={ () => {
                            props.handleChapterName(chapterNameInput);
                            setEditing(false);
                        }
                    }>
                        <AiOutlineSave/>
                    </button>
                    <button style={{backgroundColor: "#D8000C"}}onClick={() => {setEditing(false);}}>
                        <AiOutlineClose/>
                    </button>
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
                    {props.chapterName}
                </span>
            </div>
        </div>
    )
}

export default ChapterInfoEdit;