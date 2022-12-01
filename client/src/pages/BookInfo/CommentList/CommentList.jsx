import React from 'react';
import './style.scss';
import CommentItem from '../CommentItem/CommentItem';


const CommentList = (props) => {
    return (
        <div className='comment-list'>
            {props.comments.map(comment => (
                <CommentItem key={comment._id} comment={comment} handleCommentChange={props.handleCommentChange}/>
            ))}
        </div>
    )
}

export default CommentList;