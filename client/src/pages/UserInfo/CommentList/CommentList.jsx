import React, { Fragment } from 'react';
import './style.scss';
import moment from "moment";

const CommentList = (props) => {
    return (
        <div className='comment-info-list'>
            {props.comments.length===0?
            (<>
                <span>Không có comment</span>
            </>):
            (<>
                {props.comments.map(comment => (
                    <Fragment key={comment._id}>
                        <div className='comment-info-item'>
                            <div className='comment-book-info'>
                                <img src={comment.book.image}/>
                                <h4>{comment.book.title}</h4>
                            </div>
                            <div className='comment-info'>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: comment.comment,
                                    }}
                                ></p>
                                <label>{moment(comment.updatedAt).format("DD/MM/YY HH:mm")}</label>
                            </div>
                        </div>
                    </Fragment>
                ))}
            </>)
            }
        </div>
    )
}

export default CommentList;