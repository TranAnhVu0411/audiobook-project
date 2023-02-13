import React, {useState, useEffect} from "react";
import {main_axios_instance} from '../../service/custom-axios';
import {BiBook, BiBookReader, BiLinkExternal} from "react-icons/bi"
import { Link } from "react-router-dom";
import moment from "moment";
import "./style.scss";
import ReportInfo from '../BookInfo/Comment/Report/ReportInfo/ReportInfo';

const DashBoard = () => {
    const [totalBook, setTotalBook] = useState(0)
    const [totalUser, setTotalUser] = useState(1)
    const [currentReports, setCurrentReports] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const bookres = await main_axios_instance.get("/book/total/");
            const userres = await main_axios_instance.get("/user/total/");
            const reportres = await main_axios_instance.get("/report/current/");
            setTotalBook(bookres.data.total);
            setTotalUser(userres.data.total);
            setCurrentReports(reportres.data.reports)
        }
        fetchData();
    }, []);

    const [changeComment, setChangeComment] = useState(false) // Tham số trigger useEffect
    const handleCommentChange = () => {
        setChangeComment(true)
    }
    useEffect(() => {
        const fetchData = async () => {
            const reportres = await main_axios_instance.get("/report/current/");
            setCurrentReports(reportres.data.reports)
        }
        fetchData();
        setChangeComment(false);
    }, [changeComment]);
    const [reportInfoView, setReportInfoView] = useState(false);
    const [report, setReport] = useState(null);
    const handleReportRedirect = (report) => {
        setReportInfoView(true)
        setReport(report)
    }

    return (
        <div className="dashboard">
            <div className="total">
                <div className="total-element">
                    <Link to="/booklist">
                        <BiLinkExternal className="goto" />
                    </Link>
                    <BiBook className="icon"/>
                    <h1>Tổng số sách hiện có: {totalBook}</h1>
                </div>
                <div className="total-element">
                    <Link to="/userlist">
                        <BiLinkExternal className="goto" />
                    </Link>
                    <BiBookReader className="icon"/>
                    <h1>Tổng số tài khoản đăng ký: {totalUser}</h1>
                </div>
            </div>
            <div className="report">
                <Link to="/comment">
                    <BiLinkExternal className="goto" />
                </Link>
                <h1>Báo cáo đánh giá gần đây</h1>
                {currentReports.length===0?
                    <span>Không có báo cáo</span>:
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
                                {currentReports.map((report) => {
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
                }
            </div>
            {reportInfoView ? 
                <ReportInfo
                    onClose={() => setReportInfoView(false)}
                    viewState={reportInfoView}
                    report={report}
                    handleCommentChange={handleCommentChange}
                /> : 
                <></>
            }
        </div>
    )
}

export default DashBoard;