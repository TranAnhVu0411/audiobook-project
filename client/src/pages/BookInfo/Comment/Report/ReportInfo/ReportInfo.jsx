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
            const userRes = await main_axios_instance.put(`/user/update/${props.report.comment.user}`, {
                'violatedCount': infoRes.data['user']['violatedCount']+1
            })
            toast.success("Cập nhật đánh giá thành công", {position: toast.POSITION.TOP_CENTER});
            props.onClose()
            props.handleCommentChange()
        } catch (err) {
            console.log(err)
            toast.error("Xuất hiện lỗi phát sinh khi cập nhật đánh giá", {position: toast.POSITION.TOP_CENTER});
        }   
    }

    return(
        <div className='report-info'>
            <div className='report-info-section'>
                <h2>Báo cáo comment vi phạm</h2>
                <div className='report-info-detail'>
                    <div className='report-info-item'>
                        <label>Người báo cáo:</label>
                        <div><Link>{props.report.reportedUser.username}</Link></div>
                    </div>
                    <div className='report-info-item'>
                        <label>Thời gian báo cáo:</label>
                        <div>{moment(props.report.createdAt).format("DD/MM/YY HH:mm")}</div>
                    </div>
                    <div className='report-info-item'>
                        <label>Nội dung báo cáo:</label>
                        <div>{props.report.reportContent}</div>
                    </div>
                </div>
                <div className='report-info-button'>
                    <button onClick={handleHiddenComment}>Ẩn bình luận</button>
                    <button onClick={handleRemoveReport}>Huỷ báo cáo</button>
                    <button onClick={props.onClose}>Quay về</button>
                </div>
            </div>
        </div>
    )
}

export default ReportInfo;