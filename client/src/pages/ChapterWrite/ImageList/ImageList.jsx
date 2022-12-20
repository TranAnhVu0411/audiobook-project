import React, { Fragment } from 'react';
import { FaEye, FaList } from 'react-icons/fa'
import './style.scss'
import ReactDragListView from "react-drag-listview";

const ImageList = (props) => {
    return (
        <ReactDragListView
            lineClassName="dragLine"
            handleSelector='button.drag-button'
            nodeSelector='div.image-item'
            onDragEnd={(fromIndex, toIndex) =>
                props.onDragEnd(fromIndex, toIndex)
            }
        >
            <div className='image-list'>
                {props.chapterImgs.map((chapterImg) => {
                    return (
                        <Fragment key={chapterImg.id}>
                            <div className='image-item'>
                                <button className="drag-button">
                                    <FaList/>
                                </button>
                                <button className="delete-button" onClick={() => props.deleteImg(chapterImg.id)}>
                                    x
                                </button>
                                <img src = {chapterImg.imageShow} alt="previewimage" />
                                <button className='preview-button' onClick={() => props.openImageViewer(chapterImg.id)}>
                                    <FaEye/>
                                    <span>Preview</span>
                                </button>
                            </div>
                        </Fragment>
                    )})
                }
            </div>
        </ReactDragListView>
    )
}

export default ImageList;