import React, { useContext, useState } from 'react';
import './style.scss';
import { AuthContext } from "../../../../context/AuthContextProvider";
import { getRole } from '../../../../context/role';
import CommentWrite from '../CommentWrite/CommentWrite';
import ReportForm from '../Report/ReportForm/ReportForm';
import ReportInfo from '../Report/ReportInfo/ReportInfo';
import {main_axios_instance} from '../../../../service/custom-axios';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import moment from "moment";

const CommentItem = (props) => {
    const { currentUser } = useContext(AuthContext);
    const [ editView, setEditView ] = useState(false);

    const [reportView, setReportView] = useState(false);
    const [reportInfoView, setReportInfoView] = useState(false);

    // Thay đổi format của comment ứng với mỗi status
    const handleCommentStyle = () => {
        if (getRole(currentUser)==='admin'){
            if (props.comment.status==='pending'){
                return({
                    backgroundColor: "rgb(255, 132, 0)"
                })
            }else if(props.comment.status==='unavailable'){
                return({
                    backgroundColor: "gray"
                })
            }
        }
    }

    // Thay đổi format của text
    const handleCommentText = () => {
        if(getRole(currentUser)!=='admin'){
            if (props.comment.user.status === 'unavailable'){
                return (
                    <div className='comment-text'>
                        <p className='warning'>
                            Bình luận bị ẩn do tài khoản bị khoá
                        </p> 
                    </div> 
                )
            }
            if(props.comment.status==='available'){
                return (editView ? (
                    <>
                        <div className='comment-edit'>
                            <CommentWrite 
                                editedComment={props.comment} 
                                closeEditView={() => {
                                    setEditView(false)
                                }} 
                                handleCommentChange={props.handleCommentChange} 
                            />
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
            ))}else{
                return(<>
                    <div className='comment-text'>
                        <p className='warning'>
                            {props.comment.status ==='pending'?
                                "Bình luận đang trong quá trình xem xét báo cáo" :
                                "Bình luận bị ẩn do vi phạm điều khoản"
                            }
                        </p> 
                    </div> 
                </>)
            }
        }else{
            return(<>
                <div className='comment-text'>
                    <p
                            dangerouslySetInnerHTML={{
                                __html: props.comment.comment,
                            }}
                    ></p> 
                </div> 
            </>)
        }
    }

    const handleCommentRedirect = async () => {
        if (props.comment.status==='pending'){
            setReportInfoView(true)
        }else if(props.comment.status==='available'){
            try {
                const commentRes = await main_axios_instance.put(`/comment/update/${props.comment._id}`, {
                    'status': 'unavailable'
                });
                const userRes = await main_axios_instance.put(`/user/updatestatus/${props.comment.user._id}`, {
                    'violatedCount': props.comment.user.violatedCount+1
                })
                toast.success("Cập nhật đánh giá thành công", {position: toast.POSITION.TOP_CENTER});
                props.handleCommentChange()
            }catch(error){
                console.log(error);
                toast.error("Xuất hiện lỗi phát sinh khi cập nhật đánh giá", {position: toast.POSITION.TOP_CENTER});
            }
        }else{
            try {
                const commentRes = await main_axios_instance.put(`/comment/update/${props.comment._id}`, {
                    'status': 'available'
                });
                toast.success("Cập nhật đánh giá thành công", {position: toast.POSITION.TOP_CENTER});
                props.handleCommentChange()
            }catch(error){
                console.log(error);
                toast.error("Xuất hiện lỗi phát sinh khi cập nhật đánh giá", {position: toast.POSITION.TOP_CENTER});
            }
        }
    }

    return (
        <div className='comment-item'>
            <img 
                alt="preview" 
                src={props.comment.user.avatar} 
            />
            <div className='comment-content'>
                <div className='comment-content-info' style={handleCommentStyle()}>
                    <div className='user-name'>
                        <span>{props.comment.user.username}</span>
                    </div>
                    <div className='seperator-comment'>
                    </div>
                    {handleCommentText()}
                </div>
                <div className='comment-content-button'>
                    <div>
                        {moment(props.comment.updatedAt).format("DD/MM/YY HH:mm")}
                    </div>
                    {(getRole(currentUser)==='user' && currentUser.info._id !== props.comment.user._id && props.comment.status==='available' && props.comment.user.status==="available") ? (
                            <>
                                <button 
                                    onClick={() => setReportView(true)}
                                    title={`${currentUser.info.status==="unavailable"?"Bạn không thực hiện được chức năng này do tài khoản của bạn đã bị khoá":""}`}
                                    disabled={currentUser.info.status==="unavailable"}
                                >
                                    <span>Báo cáo</span>
                                </button>
                            </>
                    ): (
                        <>
                        </>
                    )}
                    
                    {(getRole(currentUser)==='user' && currentUser.info._id === props.comment.user._id && !editView && props.comment.status==='available') ? (
                            <>
                                <button 
                                    onClick = {() => {setEditView(true);}}
                                    title={`${currentUser.info.status==="unavailable"?"Bạn không thực hiện được chức năng này do tài khoản của bạn đã bị khoá":""}`}
                                    disabled={currentUser.info.status==="unavailable"}
                                >
                                    <span>Chỉnh sửa</span>
                                </button>
                            </>
                    ): (
                        <>
                        </>
                    )}  

                    {(getRole(currentUser)==='admin') ? (
                            <>
                                <button onClick={() => handleCommentRedirect()}>
                                    <span>
                                        {
                                        (props.comment.status==='available')?
                                            "Ẩn comment":
                                            (props.comment.status==='unavailable')?"Hiện comment":
                                                "Xem báo cáo"
                                        }
                                    </span>
                                </button>
                            </>
                    ): (
                        <>
                        </>
                    )}  
                </div>
            </div>
            {reportView ? 
                <ReportForm
                    onClose={() => setReportView(false)}
                    userId={currentUser.info._id}
                    commentId={props.comment._id}
                    handleCommentChange={props.handleCommentChange}
                /> : 
                <></>
            }
            {reportInfoView ? 
                <ReportInfo
                    onClose={() => setReportInfoView(false)}
                    viewState={reportInfoView}
                    report={props.report}
                    handleCommentChange={props.handleCommentChange}
                /> : 
                <></>
            }
        </div>         
    )
}

export default CommentItem;