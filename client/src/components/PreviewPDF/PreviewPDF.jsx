import React from 'react';
import {RiCloseFill} from 'react-icons/ri'
import './style.scss'

const PreviewPDF = (props) => {
    return(
        <div className='preview-pdf' onClick={props.onClose}>
            <div className='preview-pdf-close-button'>
                <button onClick={props.onClose}><RiCloseFill/></button>
            </div>
            <div className='preview-pdf-content'>
                <iframe title="Preview" aria-hidden={true} src={props.src}/>
            </div>
        </div>
    )
}

export default PreviewPDF;