import React, {useState, useContext, useEffect} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.scss';
import { AuthContext } from "../../../context/AuthContextProvider";
import { getRole } from '../../../context/role';
import {main_axios_instance} from '../../../service/custom-axios';
import ReactTooltip from 'react-tooltip';
import { useNavigate } from 'react-router-dom';

const CommentWrite = (props) => {
    const [comment, setComment] = useState('');
    const { currentUser } = useContext(AuthContext);
    const [isEdit, setIsEdit] = useState(false);
    const navigate = useNavigate()
    const resetInput = () => {
        setComment('')
    }
    useEffect(() => {
        if (props.editedComment){
            // nếu đang ở chế độ chỉnh sửa comment
            setComment(props.editedComment.comment)
            setIsEdit(true)
        }else{
            // Nếu đang ở chế độ thêm comment mới
            setComment('')
            setIsEdit(false)
        }
    }, [props.editedComment])
    const handlePostComment = async(e) => {
        // ấn enter => đăng comment
        // ấn enter + shift => xuống dòng
        if (e.keyCode===13 && !e.shiftKey){
            if (isEdit){
                if (comment !== props.editedComment.comment){
                    const res = await main_axios_instance.put(`/comment/update/${props.editedComment._id}`, {
                        comment: comment,
                    })
                    console.log(res)
                    props.closeEditView()
                    props.handleCommentChange()
                }else{
                    props.closeEditView()
                }
            }else{
                const res = await main_axios_instance.post('/comment/create/', {
                    comment: comment,
                    bookId: props.book._id,
                    userId: currentUser.info._id
                })
                console.log(res)
                props.handleCommentChange()
                resetInput()
            }    
        }
    }
    
    return (
        <div className='comment-write'>
            
            {getRole(currentUser) === 'guest' ? (
                    <>
                        <div className="comment-input" data-tip data-for="comment-tooltip" onClick={() => {navigate('/login')}}>
                            <ReactQuill 
                                placeholder="Mời bạn thảo luận, bình luận có văn hoá để tránh bị khoá tài khoản" 
                                className="editor" theme="snow" 
                                readOnly={true}
                            />
                        </div>
                        <ReactTooltip id='comment-tooltip' effect="solid">
                            <span>Bạn phải đăng nhập để có thể sử dụng chức năng này</span>
                        </ReactTooltip>
                    </>
                ) : (
                    <div className="comment-input" data-tip data-for="comment-tooltip">
                        <ReactQuill 
                            placeholder="Mời bạn thảo luận, bình luận có văn hoá để tránh bị khoá tài khoản" 
                            className="editor" theme="snow" 
                            value={comment} 
                            onChange={setComment}
                            onKeyDown={handlePostComment}
                        />
                    </div>
                )}
        </div>
    )
}

export default CommentWrite;