import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {main_axios_instance} from '../../../../../service/custom-axios';
import './style.scss'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import moment from "moment";

const ReportInfo = (props) => {
    console.log(props.report)
    const handleRemoveReport = async() => {
        try {
            const reportRes = await main_axios_instance.put(`/report/update/${props.report._id}`, {
                'status': 'checked'
            });
            const commentRes = await main_axios_instance.put(`/comment/update/${props.report.comment._id}`, {
                'status': 'available'
            });
            toast.success("Cập nhật đánh giá thành công", {position: toast.POSITION.TOP_CENTER});
            props.onClose()
            props.handleCommentChange()
        } catch (err) {
            console.log(err)
            toast.error("Xuất hiện lỗi phát sinh khi cập nhật đánh giá", {position: toast.POSITION.TOP_CENTER});
        }   
    }

    const handleHiddenComment = async() => {
        try {
            const reportRes = await main_axios_instance.put(`/report/update/${props.report._id}`, {
                'status': 'checked'
            });
            const commentRes = await main_axios_instance.put(`/comment/update/${props.report.comment._id}`, {
                'status': 'unavailable'
            });
            const infoRes = await main_axios_instance.get(`/user/${props.report.comment.user}`)
            console.log(infoRes.data)
            const userRes = await main_axios_instance.put(`/user/updatestatus/${props.report.comment.user}`, {
                'violatedCount': infoRes.data.user.violatedCount+1
            })
            console.log(userRes)
            toast.success("Cập nhật đánh giá thành công", {position: toast.POSITION.TOP_CENTER});
            props.onClose()
            props.handleCommentChange()
        } catch (err) {
            console.log(err)
            toast.error("Xuất hiện lỗi phát sinh khi cập nhật đánh giá", {position: toast.POSITION.TOP_CENTER});
        }   
    }

    const disabledButton = props.report.status==='checked'?true:false;

    return(
        <div className='report-info'>
            <div className='report-info-section'>
                <h2>Báo cáo comment vi phạm</h2>
                <div className='report-info-detail'>
                    <div className='report-info-item'>
                        <label>Người báo cáo:</label>
                        <div><Link to={`/user/${props.report.reportedUser._id}`}>{props.report.reportedUser.username}</Link></div>
                    </div>
                    <div className='report-info-item'>
                        <label>Thời gian báo cáo:</label>
                        <div>{moment(props.report.createdAt).format("DD/MM/YY HH:mm")}</div>
                    </div>
                    <div className='report-info-item'>
                        <label>Nội dung báo cáo:</label>
                        <div>{props.report.reportContent}</div>
                    </div>
                    <div className='report-info-comment'>
                        <label>Nội dung đánh giá</label>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: props.report.comment.comment,
                            }}
                        ></p>
                    </div>
                    <div className='report-info-link'>
                        <Link to={`/user/${props.report.comment.user}`}>Thông tin người vi phạm</Link>
                        <Link to={`/book/info/${props.report.comment.book}`}>Thông tin sách</Link>
                    </div>
                </div>
                <div className='report-info-button'>
                    <button onClick={handleHiddenComment} disabled={disabledButton}>Ẩn bình luận</button>
                    <button onClick={handleRemoveReport} disabled={disabledButton}>Huỷ báo cáo</button>
                    <button onClick={props.onClose}>Quay về</button>
                </div>
            </div>
        </div>
    )
}

export default ReportInfo;