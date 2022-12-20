import React, {useState} from "react";
import './style.scss';
import {FaEdit, FaList, FaSave, FaWindowClose} from 'react-icons/fa'

const SentenceInfoItem = (props) => {
    const [text, setText] = useState(props.sentence.text)
    const sentence = props.sentence;
    const [editText, setEditText] = useState(false)
    let viewMode = {}
    let editMode = {}

    if (editText) {
        viewMode.display = "none"
    } else {
        editMode.display = "none"
    }

    const handleCheckboxChange = (e) => {
        // Nếu trong trạng thái edit
        if (props.edit){
            if(e.target.checked){
                // Nếu checked vào sentence khác
                if (window.confirm("Cảnh báo:\n"+
                                "Các thay đổi bạn vừa thực hiện sẽ không được lưu vào bộ nhớ tạm nếu bạn thực hiện tác vụ này.\n"+
                                "Bạn nên lưu các thay đổi trước khi thoát ra.\n"+
                                "Bạn có muốn thực hiện tác vụ này không?")) {
                    props.handleState(sentence.sentenceId)
                }
            }else{
                // Nếu unchecked sentence
                if (e.target.id===props.editSentenceId){
                    // Nếu sentence unchecked là sentence đang edit
                    if (window.confirm("Cảnh báo:\n"+
                                "Các thay đổi bạn vừa thực hiện sẽ không được lưu vào bộ nhớ tạm nếu bạn thực hiện tác vụ này.\n"+
                                "Bạn nên lưu các thay đổi trước khi thoát ra.\n"+
                                "Bạn có muốn thực hiện tác vụ này không?")) {
                        props.handleState(sentence.sentenceId)
                    }
                }
            }
        }else{
            props.handleState(sentence.sentenceId)
        }
    }
    
    return (
        <div className='sentence-info-box'>
            <div className='sentence-info-box-color'> 
                <input 
                    type="checkbox" 
                    id={sentence.sentenceId}  
                    checked={sentence.state} 
                    onChange={handleCheckboxChange}/>
                <input 
                    type="color" 
                    id={sentence.sentenceId}
                    name="color" 
                    value={sentence.color} 
                    onChange={(e) => {props.handleColor(sentence.sentenceId, e.target.value)}}
                />
            </div>
            <div className='sentence-info-box-text'>
                <div style={viewMode}>
                    {text}
                </div>
                <textarea 
                    style={editMode} 
                    value={text}
                    onChange={e => {
                        setText(e.target.value)
                    }}
                />
            </div>
            <div className='sentence-info-box-button'>
                <div style={viewMode}>
                    <button className="drag"><FaList/></button>
                    <button className="edit" onClick={() => {setEditText(true)}}><FaEdit/></button>
                </div>
                <div style={editMode}>
                    <button 
                        className="save" 
                        onClick={() => {
                            props.handleText(sentence.sentenceId, text)
                            setEditText(false)
                        }} 
                    >
                        <FaSave/>
                    </button>
                    <button className="discard" onClick={() => {setEditText(false)}}><FaWindowClose/></button>
                </div>
            </div>
        </div>     
    )
}

export default SentenceInfoItem;