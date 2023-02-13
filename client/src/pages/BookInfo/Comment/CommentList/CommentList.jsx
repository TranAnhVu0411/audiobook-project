import React, { useState, useEffect } from 'react';
import './style.scss';
import CommentItem from '../CommentItem/CommentItem';


const CommentList = (props) => {
    return (
        <div className='comment-list'>
            {props.comments.map(comment => (
                <CommentItem key={comment.comment._id} comment={comment.comment} handleCommentChange={props.handleCommentChange} report={comment.report===undefined?null:comment.report} />
            ))}
        </div>
    )
}

export default CommentList;