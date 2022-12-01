import React, { Fragment } from 'react';
import { FaEye } from 'react-icons/fa'
import './style.scss'

const ImageList = (props) => {
    return (
        <div className='image-list'>
            {props.chapterImgs.map((chapterImg) => {
                return (
                    <Fragment key={chapterImg.id}>
                        <div className='image-item'>
                            <button className="delete-button" onClick={() => props.deleteImg(chapterImg.id)}>
                                x
                            </button>
                            <img src = {chapterImg.imageShow} alt="previewimage" />
                            <button className='preview-button' onClick={() => props.getClickImg(chapterImg.id)}>
                                <FaEye/>
                                <span>preview</span>
                            </button>
                        </div>
                    </Fragment>
                )})
            }
        </div>
    )
}

export default ImageList;