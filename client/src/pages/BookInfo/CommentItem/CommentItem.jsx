import React, { useContext, useState } from 'react';
import './style.scss';
import { AuthContext } from "../../../context/AuthContextProvider";
import { getRole } from '../../../context/role';
import CommentWrite from '../CommentWrite/CommentWrite';
import moment from "moment";

const CommentItem = (props) => {
    const { currentUser } = useContext(AuthContext);
    const [ editView, setEditView ] = useState(false);

    const closeEditView = () => {
        setEditView(false)
    }

    return (
        <div className='comment-item'>
            <img 
                alt="preview" 
                src={props.comment.user.avatar} 
            />
            <div className='comment-content'>
                <div className='comment-content-info'>
                    <div className='user-name'>
                        <span>{props.comment.user.username}</span>
                    </div>
                    <div className='seperator-comment'>
                    </div>
                    
                        {editView ? (
                            <>
                                 <div className='comment-edit'>
                                    <CommentWrite editedComment={props.comment} closeEditView={closeEditView} handleCommentChange={props.handleCommentChange} />
                                </div>
                            </>
                        ):(
                            <>
                                <div className='comment-text'>
                                    <p
                                            dangerouslySetInnerHTML={{
                                                __html: props.comment.comment,
                                            }}
                                    ></p> 
                                </div> 
                            </>
                        )}
                </div>
                <div className='comment-content-button'>
                    <div>
                        {moment(props.comment.updatedAt).format("DD/MM/YY HH:mm")}
                    </div>
                    {(getRole(currentUser)!=='guest' && currentUser.info._id !== props.comment.user._id) ? (
                            <>
                                <button>
                                    <span>Báo cáo</span>
                                </button>
                            </>
                    ): (
                        <>
                        </>
                    )}
                    
                    {(getRole(currentUser)!=='guest' && currentUser.info._id === props.comment.user._id && !editView) ? (
                            <>
                                <button onClick = {() => {setEditView(true);}}>
                                    <span>Chỉnh sửa</span>
                                </button>
                            </>
                    ): (
                        <>
                        </>
                    )}  
                </div>
            </div>
        </div>         
    )
}

export default CommentItem;