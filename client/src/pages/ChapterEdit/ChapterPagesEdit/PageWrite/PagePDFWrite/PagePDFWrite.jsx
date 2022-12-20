import React, {useState} from 'react';
import './style.scss'

const PagePDFWrite = (props) => {
    const [index, setIndex] = useState(0)
    const handleIndex = e => {
        setIndex(e.target.value);
    };

    return (
        <div className='page-pdf-write'>
            <div className='page-pdf-write-form'>
                <label>Vị trí trang lưu trong PDF Sách</label>
                <input type="number" name="index" value={index} onChange={handleIndex} placeholder="Nhập vị trí trang"/>
            </div>
            <div className='page-pdf-write-submit'>
                <button>
                    Lưu trang
                </button>
            </div>
        </div>
    )
}

export default PagePDFWrite;