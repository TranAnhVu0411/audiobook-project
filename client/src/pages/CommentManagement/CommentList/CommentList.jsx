import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import './style.scss';
import moment from "moment";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {main_axios_instance} from '../../../service/custom-axios';
import ReportInfo from '../../BookInfo/Comment/Report/ReportInfo/ReportInfo';

const CommentList = (props) => {
    const filterOptions = [  
        { value: 0, label: 'Comment chưa bị báo cáo' },
        { value: 1, label: 'Comment bị báo cáo' },
        { value: 2, label: 'Comment bị ẩn' },
    ];
    const [filter, setFilter] = useState(filterOptions[0])
    const [showComments, setShowComments] = useState(props.comments['available'])
    useEffect(() => {
        console.log(filter)
        if (filter.value===0){
            setShowComments(props.comments['available'])
        }else if (filter.value===1){
            setShowComments(props.comments['pending'])
        }else{
            setShowComments(props.comments['unavailable'])
        }
        // setShowComments(props.comments['available'])
    }, [props.comments])

    const handleFilter = currentFilter => {
        if (currentFilter.value===0){
            setShowComments(props.comments['available'])
        }else if (currentFilter.value===1){
            setShowComments(props.comments['pending'])
        }else{
            setShowComments(props.comments['unavailable'])
        }
        setFilter(currentFilter);
    }
    console.log(props.comments)

    const [reportInfoView, setReportInfoView] = useState(false);
    const [report, setReport] = useState(null);
    const handleCommentRedirect = async (id) => {
        if (filter.value === 1){
            setReportInfoView(true)
            setReport(props.reports.filter(report =>{
                return report.comment._id === id
            })[0])
        }else if(filter.value === 0){
            try {
                const commentRes = await main_axios_instance.put(`/comment/update/${id}`, {
                    'status': 'unavailable'
                });
                toast.success("Cập nhật đánh giá thành công", {position: toast.POSITION.TOP_CENTER});
                props.handleCommentChange()
            }catch(error){
                console.log(error);
                toast.error("Xuất hiện lỗi phát sinh khi cập nhật đánh giá", {position: toast.POSITION.TOP_CENTER});
            }
        }else{
            try {
                const commentRes = await main_axios_instance.put(`/comment/update/${id}`, {
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
        <div className='comment-management-list'>
            <div className='filter-config'>
                <span>Lọc comment theo:</span>
                <Select
                    className="filter-options"
                    classNamePrefix="select"
                    name="color"
                    options={filterOptions}
                    value={filter}
                    onChange = {handleFilter}
                />
            </div>
            <div className='comment-table'>
                <table>
                    <thead>
                        <tr>
                            <th style={{width:"25%"}}>Tên sách</th>
                            <th style={{width:"25%"}}>Tên tài khoản</th>
                            <th style={{width:"25%"}}>Comment</th>
                            <th style={{width:"10%"}}>Thời gian</th>
                            <th style={{width:"15%"}}>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showComments.map((comment) => {
                            return(
                            <tr key={comment._id}>
                                <td>
                                    <Link to={`/book/${comment.book._id}`}>
                                        {comment.book.title}
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/user/${comment.user._id}`}>
                                        {comment.user.username}
                                    </Link>
                                </td>
                                <td>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: comment.comment,
                                        }}
                                    ></p>
                                </td>
                                <td>{moment(comment.updatedAt).format("DD/MM/YY HH:mm")}</td>
                                <td>
                                    <button onClick={() => handleCommentRedirect(comment._id)}>
                                        <span>
                                            {
                                            (filter.value===0)?
                                                "Ẩn comment":
                                                (filter.value===2)?"Hiện comment":
                                                    "Xem báo cáo"
                                            }
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {reportInfoView ? 
                <ReportInfo
                    onClose={() => setReportInfoView(false)}
                    viewState={reportInfoView}
                    report={report}
                    handleCommentChange={props.handleCommentChange}
                /> : 
                <></>
            }
        </div>
    )
}

export default CommentList;