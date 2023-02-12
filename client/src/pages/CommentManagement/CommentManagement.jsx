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
    const [comments, setComments] = useState({available: [], unavailable: [], pending: []})
    const [reports, setReports] = useState({notchecked: [], checked: []});
    const [isLoad, setIsLoad] = useState(false);
    
    const [changeComment, setChangeComment] = useState(false) // Tham số trigger useEffect
    const handleCommentChange = () => {
        setChangeComment(true)
    }

    useEffect(() => {
        const fetchData = async () => {
            let commentsRes = await main_axios_instance.get(`/comment/all`);
            let reportsRes = await main_axios_instance.get(`/report/all`);
            setComments({
                available: commentsRes.data.available,
                unavailable: commentsRes.data.unavailable,
                pending: commentsRes.data.pending
            })
            setReports({
                notchecked: reportsRes.data.notchecked,
                checked: reportsRes.data.checked
            })
            setIsLoad(true)
        }
        fetchData();
        setIsLoad(true)
        setChangeComment(false);
    }, [changeComment]);

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
                            <CommentList comments={comments} reports={reports.notchecked} handleCommentChange={handleCommentChange}/>
                        </TabPanel>
                        <TabPanel>
                            <ReportList reports={reports} handleCommentChange={handleCommentChange} />
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