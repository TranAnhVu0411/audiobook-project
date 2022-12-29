import React, { useState } from 'react';
import './style.scss'
import { FaRegEdit, FaRegPlusSquare, FaRegTrashAlt } from 'react-icons/fa'
import ReactDragListView from "react-drag-listview";
import SentenceInfoItem from './SentenceInfoItem/SentenceInfoItem';
import SentenceWrite from './SentenceWrite/SentenceWrite';

const SentenceInfo = (props) => {
    return (
        <div className='sentence-info'>
            <div className='sentence-info-button'>
                <button 
                    title={`${props.newState?"Tắt chế độ thêm câu mới":"Bật chế độ thêm câu mới"}`}
                    onClick={props.handleNew}
                    style = {{backgroundColor: `${props.newState?"black":"#428bca"}`, cursor: `${props.editState?'not-allowed':'pointer'}`}}
                    disabled={props.editState}
                >
                    <FaRegPlusSquare />
                </button>
                <button 
                    title={`${props.editState?"Tắt chế độ chỉnh sửa bounding box":"Bật chế độ chỉnh sửa bounding box"}`}
                    onClick={props.handleEdit}
                    style = {{
                        display: `${props.checkedSentenceId.length===1?"flex":"none"}`, 
                        backgroundColor: `${props.editState?"black":"#428bca"}`
                    }}
                >
                    <FaRegEdit/>
                </button>
                <button 
                    title="Xoá các câu được check"
                    onClick={props.handleDelete}
                    style = {{
                        display: `${props.checkedSentenceId.length===1?"flex":"none"}`, 
                    }}
                >
                    <FaRegTrashAlt/>
                </button>
            </div>
            <div className='sentence-info-list'>
                {props.newState?
                <SentenceWrite handleWriteSentence={props.handleWriteSentence} /> :
                <ReactDragListView
                    lineClassName="dragLine"
                    nodeSelector={`${props.editState? "null": "div.sentence-info-box"}`}
                    handleSelector='button.drag'
                    onDragEnd={(fromIndex, toIndex) =>
                        props.onDragEnd(fromIndex, toIndex)
                    }
                >
                    {props.sentenceInfo.map((sentence) => {
                        return(
                            <SentenceInfoItem 
                                key={sentence.sentenceId} 
                                sentence={sentence} 
                                handleState={props.handleState} 
                                handleText={props.handleText}
                                editState={props.editState}
                            />
                        )           
                    })}
                </ReactDragListView>
                }
            </div>
        </div>
    );
}

export default SentenceInfo