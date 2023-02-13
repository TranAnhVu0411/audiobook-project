import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import './style.scss';
import moment from "moment";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {main_axios_instance} from '../../../service/custom-axios';
import ReportInfo from '../../BookInfo/Comment/Report/ReportInfo/ReportInfo';
import Pagination from 'react-responsive-pagination';
import '../../../util/stylePagination.scss';

const CommentList = (props) => {
    // Thay đổi filter
    const filterOptions = [  
        { value: 0, label: 'Comment chưa bị báo cáo' },
        { value: 1, label: 'Comment bị báo cáo' },
        { value: 2, label: 'Comment bị ẩn' },
    ];

    const handleFilter = filter => {
        props.handleCommentQuery(1, filter.value)
        props.handleCommentChange()
    }
    
    // Thay đổi page
    const handlePageChange = page => {
        props.handleCommentQuery(page, props.filter)
        props.handleCommentChange()
    };

    const [reportInfoView, setReportInfoView] = useState(false);
    const [report, setReport] = useState(null);
    const handleCommentRedirect = async (comment) => {
        if (props.filter === 1){
            setReportInfoView(true)
            setReport(comment.report)
        }else if(props.filter === 0){
            try {
                const commentRes = await main_axios_instance.put(`/comment/update/${comment.comment._id}`, {
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
                const commentRes = await main_axios_instance.put(`/comment/update/${comment.comment._id}`, {
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
            <div className='query-config'>
                <div className='filter-config'>
                <span>Lọc comment theo:</span>
                    <Select
                        className="filter-options"
                        classNamePrefix="select"
                        name="color"
                        options={filterOptions}
                        value={filterOptions[props.filter]}
                        onChange = {handleFilter}
                    />
                </div>
                <Pagination
                    className='pagination'
                    total={props.pageCount}
                    current={props.pageOffset}
                    onPageChange={page => {handlePageChange(page)}}
                />
            </div>
            <div className='result-number'>
                {props.totalItem} kết quả  
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
                        {props.comments.map((comment) => {
                            return(
                            <tr key={comment.comment._id}>
                                <td>
                                    <Link to={`/book/${comment.comment.book._id}`}>
                                        {comment.comment.book.title}
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/user/${comment.comment.user._id}`}>
                                        {comment.comment.user.username}
                                    </Link>
                                </td>
                                <td>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: comment.comment.comment,
                                        }}
                                    ></p>
                                </td>
                                <td>{moment(comment.comment.updatedAt).format("DD/MM/YY HH:mm")}</td>
                                <td>
                                    <button onClick={() => handleCommentRedirect(comment)}>
                                        <span>
                                            {
                                            (props.filter===0)?
                                                "Ẩn comment":
                                                (props.filter===2)?"Hiện comment":
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