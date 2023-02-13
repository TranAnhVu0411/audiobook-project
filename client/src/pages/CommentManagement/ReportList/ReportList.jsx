import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import './style.scss';
import moment from "moment";
import ReportInfo from '../../BookInfo/Comment/Report/ReportInfo/ReportInfo';
import Pagination from 'react-responsive-pagination';
import '../../../util/stylePagination.scss';

const ReportList = (props) => {
    // Thay đổi filter
    const filterOptions = [  
        { value: 0, label: 'Báo cáo chưa check' },
        { value: 1, label: 'Báo cáo đã check' },
    ];

    const handleFilter = filter => {
        props.handleReportQuery(1, filter.value)
        props.handleCommentChange()
    }

    // Thay đổi page
    const handlePageChange = page => {
        props.handleReportQuery(page, props.filter)
        props.handleCommentChange()
    };

    const [reportInfoView, setReportInfoView] = useState(false);
    const [report, setReport] = useState(null);
    const handleReportRedirect = (report) => {
        setReportInfoView(true)
        setReport(report)
    }
    
    return (
        <div className='report-list'>
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
            <div className='report-table'>
                <table>
                    <thead>
                        <tr>
                            <th style={{width:"30%"}}>Tên tài khoản báo cáo</th>
                            <th style={{width:"30%"}}>Nội dung báo cáo</th>
                            <th style={{width:"30%"}}>Thời gian báo cáo</th>
                            <th style={{width:"10%"}}>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.reports.map((report) => {
                            return(
                            <tr key={report._id}>
                                <td>
                                    <Link to={`/user/${report.reportedUser._id}`}>
                                        {report.reportedUser.username}
                                    </Link>
                                </td>
                                <td>
                                    {report.reportContent}
                                </td>
                                <td>{moment(report.updatedAt).format("DD/MM/YY HH:mm")}</td>
                                <td>
                                    <button onClick={() => handleReportRedirect(report)}>
                                       <span>Xem báo cáo</span>
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

export default ReportList;