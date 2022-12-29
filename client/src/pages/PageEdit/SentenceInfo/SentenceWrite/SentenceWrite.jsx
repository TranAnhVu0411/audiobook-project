import React, {useState} from "react";
import './style.scss';

const SentenceWrite = (props) => {
    const [text, setText] = useState("")
    
    return (
        <div className='sentence-write' style={props.viewMode}>
            <div className="sentence-write-text-input">
                <label>Văn bản:</label>
                <textarea 
                    value={text}
                    onChange={e => {
                        setText(e.target.value)
                    }}
                />
            </div>
            <div className="sentence-write-submit">
                <button onClick={() => {
                    props.handleWriteSentence(text)
                    setText("")
                }} >
                    Thêm câu
                </button>
            </div>
            <small>* Câu được thêm sẽ nằm ở vị trí cuối cùng của danh sách câu</small>
        </div>  
    )
}

export default SentenceWrite;