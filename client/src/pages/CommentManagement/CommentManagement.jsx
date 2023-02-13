import React, {useState, useEffect} from "react";
import {main_axios_instance} from '../../service/custom-axios';
import {AiOutlineComment} from 'react-icons/ai'
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import CommentList from "./CommentList/CommentList";
import "./style.scss"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ReportList from "./ReportList/ReportList";

const CommentManagement = () => {
    const [comments, setComments] = useState([])
    const [commentFilter, setCommentFilter] = useState(0)
    const [commentPageOffset, setCommentPageOffset] = useState(1); // Trang hiện tại của comment
    const [commentTotalItem, setCommentTotalItem] = useState(0); // Tổng số comment
    const [commentPageCount, setCommentPageCount] = useState(0); // Tổng số trang

    const [reports, setReports] = useState([]);
    const [reportFilter, setReportFilter] = useState(0)
    const [reportPageOffset, setReportPageOffset] = useState(1); // Trang hiện tại của report
    const [reportTotalItem, setReportTotalItem] = useState(0); // Tổng số report
    const [reportPageCount, setReportPageCount] = useState(0); // Tổng số trang
    const [isLoad, setIsLoad] = useState(false);
    
    const [changeComment, setChangeComment] = useState(false) // Tham số trigger useEffect
    const handleCommentChange = () => {
        setChangeComment(true)
    }

    useEffect(() => {
        const fetchData = async () => {
            let commentsRes = await main_axios_instance.get(`/comment/all?filter=${commentFilter}&page=${commentPageOffset}`);
            setComments(commentsRes.data.comments)
            setCommentTotalItem(commentsRes.data.total)
            setCommentPageCount(commentsRes.data.pageCount)

            let reportsRes = await main_axios_instance.get(`/report/all?filter=${reportFilter}&page=${reportPageOffset}`);
            console.log(reportsRes.data)
            setReports(reportsRes.data.reports)
            setReportTotalItem(reportsRes.data.total)
            setReportPageCount(reportsRes.data.pageCount)
            setIsLoad(true)
        }
        fetchData();
        setIsLoad(true)
        setChangeComment(false);
    }, [changeComment]);

    const handleCommentQuery = (pageOffset, filter) => {
        setCommentPageOffset(pageOffset)
        setCommentFilter(filter)
    }

    const handleReportQuery = (pageOffset, filter) => {
        setReportPageOffset(pageOffset)
        setReportFilter(filter)
    }

    if (isLoad){
        return (
            <div className="comment-management">
                <div className="comment-management-header">
                    <AiOutlineComment className="icon"/>
                    <span>Quản lý comment</span>
                </div>
                <div className='comment-management-table'>
                    <Tabs>
                        <TabList>
                            <Tab>
                                <div className='tab-header'>
                                    <span>Comment</span>
                                </div>
                            </Tab>
                            <Tab>
                                <div className='tab-header'>
                                    <span>Báo cáo</span>
                                </div>
                            </Tab>
                        </TabList>
                        <TabPanel>
                            <CommentList 
                                comments={comments} 
                                filter = {commentFilter}
                                pageOffset = {commentPageOffset}
                                totalItem = {commentTotalItem}
                                pageCount = {commentPageCount}
                                handleCommentQuery={handleCommentQuery} 
                                handleCommentChange={handleCommentChange}
                            />
                        </TabPanel>
                        <TabPanel>
                            <ReportList 
                                reports={reports}
                                filter = {reportFilter}
                                pageOffset = {reportPageOffset}
                                totalItem = {reportTotalItem}
                                pageCount = {reportPageCount}
                                handleReportQuery={handleReportQuery} 
                                handleCommentChange={handleCommentChange} />
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        )    
    }else{
        <LoadingScreen/>
    }
    
}

export default CommentManagement;