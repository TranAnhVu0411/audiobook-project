import React, { useState, useEffect } from 'react';
import './style.scss';
import CommentItem from '../CommentItem/CommentItem';


const CommentList = (props) => {
    const [showCommentList, setShowCommentList] = useState([])
    useEffect(() =>{
        let commentList = []
        props.comments.forEach(comment => {
            if (props.commentFilter.value===0){
                if (props.reports.some(report => (report.comment._id === comment._id))){
                    let report=props.reports.filter(report =>{
                        return report.comment._id === comment._id
                    })[0]
                    commentList.push({...comment, report: report})
                }
                else{
                    commentList.push({...comment, report: null})
                }
            }
            else if (props.commentFilter.value===1){
                if (comment.status==='pending'){
                    let report=props.reports.filter(report =>{
                        return report.comment._id === comment._id
                    })[0]
                    commentList.push({...comment, report: report})
                }
            }
            else if (props.commentFilter.value===2){
                if (comment.status==='available'){
                    commentList.push({...comment, report: null})
                }
            }
            else if (props.commentFilter.value===3){
                if (comment.status==='unavailable'){
                    commentList.push({...comment, report: null})
                }
            }
        })
        setShowCommentList(commentList)
    }, [props.commentFilter, props.comments, props.reports])
    console.log(showCommentList)
    
    return (
        <div className='comment-list'>
            {showCommentList.map(comment => (
                <CommentItem key={comment._id} comment={comment} handleCommentChange={props.handleCommentChange} report={comment.report} />
            ))}
        </div>
    )
}

export default CommentList;