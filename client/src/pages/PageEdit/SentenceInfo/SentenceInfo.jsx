import React, { useState } from 'react';
import './style.scss'
import {BiSelectMultiple, BsPlusSquare, BsArrowClockwise, BsTrash, BsList} from 'react-icons/bs'
import ReactDragListView from "react-drag-listview";
import SentenceInfoItem from './SentenceInfoItem/SentenceInfoItem';

const SentenceInfo = (props) => {
    return (
        <div className='sentence-info'>
            <div className='sentence-info-button'>
                <button>
                    <BsPlusSquare />
                </button>        
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