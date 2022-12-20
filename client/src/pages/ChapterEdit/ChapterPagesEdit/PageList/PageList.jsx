import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaList, FaInfo } from 'react-icons/fa'
import './style.scss'
import ReactDragListView from "react-drag-listview";

const PageList = (props) => {
    const navigate = useNavigate()
    return (
        <ReactDragListView
            lineClassName="dragLine"
            handleSelector='button.drag-button'
            nodeSelector='div.page-item'
            onDragEnd={(fromIndex, toIndex) =>
                props.onDragEnd(fromIndex, toIndex)
            }
        >
            <div className='page-list'>
                {props.pageList.map((page) => {
                    return (
                        <Fragment key={page.id}>
                            <div className='page-item'>
                                <button className="drag-button">
                                    <FaList/>
                                </button>
                                <button className="delete-button" onClick={() => props.deletePage(page.id)}>
                                    x
                                </button>
                                <img src = {page.url} alt="previewimage" />
                                <div className="preview-info">
                                    <button className='preview-button' onClick={() => props.openImageViewer(page.id)}>
                                        <FaEye/>
                                        <span>Preview</span>
                                    </button>
                                    <button className='info-button' onClick={() => navigate(`/page/${page.id}/edit`)}>
                                        <FaInfo/>
                                        <span>Chi tiết</span>
                                    </button>
                                </div>
                            </div>
                        </Fragment>
                    )})
                }
            </div>
        </ReactDragListView>
    )
}

export default PageList;