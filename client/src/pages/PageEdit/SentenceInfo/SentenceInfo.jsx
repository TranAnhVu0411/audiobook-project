import React, { useState } from 'react';
import './style.scss'
import {GoPlus, GoTriangleDown, GoTriangleUp } from 'react-icons/go'
import ReactDragListView from "react-drag-listview";
import SentenceInfoItem from './SentenceInfoItem/SentenceInfoItem';
import SentenceWrite from './SentenceWrite/SentenceWrite';

const SentenceInfo = (props) => {
    // Nút thu gọn thanh thêm câu
    const [open, setOpen] = useState({
        state: true,
        icon: <GoTriangleUp/>
    })
    const handleToogleSearch = () => {
        if(open.state){
            setOpen({
                state: false,
                icon: <GoTriangleDown/>

            })
        }else{
            setOpen({
                state: true,
                icon: <GoTriangleUp/>
            })
        }
    }
    let viewMode = {}
    if(open.state){
        viewMode.display = "flex"
    }else{
        viewMode.display = "none"
    }

    return (
        <div className='sentence-info'>
            <div className='sentence-info-button'>
                <button title="Thêm câu mới" onClick={handleToogleSearch}>
                    <GoPlus />
                    {open.icon}
                </button>
                <SentenceWrite viewMode={viewMode} handleWriteSentence={props.handleWriteSentence} />     
            </div>
            <div className='sentence-info-list'>
                <ReactDragListView
                    lineClassName="dragLine"
                    nodeSelector='div.sentence-info-box'
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
                            handleColor={props.handleColor}
                            handleText={props.handleText}
                            edit={props.edit} 
                            editSentenceId = {props.editSentenceId}
                        />
                    )           
                })}
                </ReactDragListView>
            </div>
        </div>
    );
}

export default SentenceInfo