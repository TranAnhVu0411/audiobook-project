import React, {useState} from 'react';
import './style.scss'
import PreviewPDF from "../../../../components/PreviewPDF/PreviewPDF";
import {MdOutlinePreview} from 'react-icons/md'

const PagePDFWrite = (props) => {
    const [index, setIndex] = useState("")
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const handleIndex = e => {
        if (e.target.value>0&&e.target.value<=props.numPages){
            setIndex(e.target.value);
        }
    };

    return (
        <div className='page-pdf-write'>
            <div className='page-pdf-write-form'>
                <span>
                    <label>Vị trí trang lưu trong PDF Sách</label>
                    <button className="preview" onClick={() => setIsViewerOpen(true)} title="Preview PDF"><MdOutlinePreview/></button> 
                </span>
                <input type="number" name="index" value={index} min={1} max={props.numPages} onChange={handleIndex} placeholder="Nhập vị trí trang"/>
            </div>
            <div className='page-pdf-write-submit'>
                <button onClick={() => props.handlePagePdfWrite(index)}>
                    Lưu trang
                </button>
            </div>
            {isViewerOpen ? 
                <PreviewPDF
                    src={props.pdfUrl}
                    onClose={() => setIsViewerOpen(false)}
                /> : 
                <></>
            }
        </div>
    )
}

export default PagePDFWrite;