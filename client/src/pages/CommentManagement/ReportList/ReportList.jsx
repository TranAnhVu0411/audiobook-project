import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import './style.scss';
import moment from "moment";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {main_axios_instance} from '../../../service/custom-axios';
import ReportInfo from '../../BookInfo/Comment/Report/ReportInfo/ReportInfo';

const ReportList = (props) => {
    const filterOptions = [  
        { value: 0, label: 'Báo cáo chưa check' },
        { value: 1, label: 'Báo cáo đã check' },
    ];
    const [filter, setFilter] = useState(filterOptions[0])
    const [showReports, setShowReports] = useState(props.reports['notchecked'])
    useEffect(() => {
        if (filter.value===0){
            setShowReports(props.reports['notchecked'])
        }else if (filter.value===1){
            setShowReports(props.reports['checked'])
        }
    }, [props.reports])

    const handleFilter = currentFilter => {
        if (currentFilter.value===0){
            setShowReports(props.reports['notchecked'])
        }else if (currentFilter.value===1){
            setShowReports(props.reports['checked'])
        }
        setFilter(currentFilter);
    }

    const [reportInfoView, setReportInfoView] = useState(false);
    const [report, setReport] = useState(null);
    const handleReportRedirect = (report) => {
        setReportInfoView(true)
        setReport(report)
    }
    
    return (
        <div className='report-list'>
            <div className='filter-config'>
                <span>Lọc báo cáo theo:</span>
                <Select
                    className="filter-options"
                    classNamePrefix="select"
                    name="color"
                    options={filterOptions}
                    value={filter}
                    onChange = {handleFilter}
                />
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
                        {showReports.map((report) => {
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