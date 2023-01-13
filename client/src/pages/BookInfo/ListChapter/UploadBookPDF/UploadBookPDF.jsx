import React, {useState} from 'react';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './style.scss';
import PreviewPDF from "../../../../components/PreviewPDF/PreviewPDF";
import {pdf_axios_instance} from '../../../../service/custom-axios';
import {AiOutlineSave, AiOutlineUndo} from 'react-icons/ai'
import {MdOutlinePreview} from 'react-icons/md'

const UploadBookPDF = (props) => {
    const [warning, setWarning] = useState(true) // Cảnh báo khi upload pdf khác khi sách đó đang có sẵn pdf
    const [pdf, setPdf] = useState(props.pdf)
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    // Xử lý khi click input pdf 
    const handlePDFInputClick = (e) => {
        e.target.value=null;
        if (e.target.name === "pdf"){
            if (props.bookPdfStatus){
                if (warning){
                    if (!window.confirm("PDF của sách này đã tồn tại\nBạn có muốn upload pdf khác không?")){
                        e.preventDefault();
                    }
                }
            }
        }
    }
    // Xử lý upload pdf
    const handlePDF = e => {
        if (e.target.name === "pdf"){
            setPdf({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
            setWarning(false)
        }
    }

    // Xử lý hoàn tác pdf
    const handleResetPdf = () => {
        setPdf({
            file: null,
            url: props.pdf.url
        })
        setWarning(true)
    };

    const handleSubmit = async() => {
        props.setIsLoad(false);
        try{
            let urlForm = new FormData();
            urlForm.append('upload-type', 'PUT')
            urlForm.append('type', 'book');
            urlForm.append('id', props.bookId)
            urlForm.append('data-type', 'pdf')
            const resUrl = await pdf_axios_instance.post('/urls', urlForm)
            // Upload pdf lên cloud
            var pdfHeaders = new Headers();
            pdfHeaders.append("Content-Type", pdf['file'].type);
            await fetch(resUrl.data.url, {
                method: 'PUT',
                headers: pdfHeaders,
                body: pdf.file,
                redirect: 'follow'
            })
            props.handlePdfChange();
            props.setIsLoad(true);
            toast.success("Upload pdf thành công, đang xử lý", {position: toast.POSITION.TOP_CENTER});
        }catch(err){
            props.setIsLoad(true);
            console.log(err)
            toast.error("Xuất hiện lỗi phát sinh khi upload chương", {position: toast.POSITION.TOP_CENTER});
        };
    }

    return(
        <div className="upload-book-pdf">
            <input type='file' name="pdf" id="pdf" accept="application/pdf" onClick={handlePDFInputClick}  onChange={handlePDF} style={{display: "none"}} />
            <label className='file-input-upload' htmlFor="pdf">Upload PDF Sách</label>
            <span>{pdf.url===null?"Có 0 pdf":"Có 1 pdf"}</span>
            <div style={{display: pdf.url===null?"none":"flex"}}>
                <button className="preview" onClick={() => setIsViewerOpen(true)} title="Preview PDF"><MdOutlinePreview/></button> 
                {props.bookPdfStatus?
                    (!warning?
                        <button className="reset" onClick={handleResetPdf} title="Hoàn tác"><AiOutlineUndo/></button> :
                        <></>
                    ):
                    <></>
                }
            </div>
            <div style={{display: (pdf.file!==null)?"flex":"none"}}>
                <button className="save" onClick={handleSubmit} title="Lưu thay đổi"><AiOutlineSave/></button> 
            </div>
            {isViewerOpen ? 
                <PreviewPDF
                    src={pdf.url}
                    onClose={() => setIsViewerOpen(false)}
                /> : 
                <></>
            }
        </div>
    )
}

export default UploadBookPDF;