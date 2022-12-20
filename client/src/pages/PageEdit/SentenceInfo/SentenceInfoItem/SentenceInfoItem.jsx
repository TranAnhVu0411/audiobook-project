import React, {useState} from "react";
import './style.scss';
import {FaEdit, FaList, FaSave, FaWindowClose} from 'react-icons/fa'

const SentenceInfoItem = (props) => {
    const [text, setText] = useState(props.sentence.text)
    const sentence = props.sentence;
    const [editing, setEditing] = useState(false)
    let viewMode = {}
    let editMode = {}

    if (editing) {
        viewMode.display = "none"
    } else {
        editMode.display = "none"
    }
    
    return (
        <div className='sentence-info-box'>
            <div className='sentence-info-box-color'> 
                <input 
                    type="checkbox" 
                    id={sentence.sentenceId}  
                    checked={sentence.state} 
                    onChange={() => props.handleState(sentence.sentenceId)}/>
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
                    <button className="edit" onClick={() => {setEditing(true)}}><FaEdit/></button>
                </div>
                <div style={editMode}>
                    <button 
                        className="save" 
                        onClick={() => {
                            props.handleText(sentence.sentenceId, text)
                            setEditing(false)
                        }} 
                    >
                        <FaSave/>
                    </button>
                    <button className="discard"onClick={() => {setEditing(false)}}><FaWindowClose/></button>
                </div>
            </div>
        </div>     
    )
}

export default SentenceInfoItem;