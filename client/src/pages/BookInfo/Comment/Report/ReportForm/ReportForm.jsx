import React, {Fragment, useState} from 'react';
import {main_axios_instance} from '../../../../../service/custom-axios';
import './style.scss'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const reportInput = [
    {index: 1, text: 'Nội dung đánh giá thô tục, phản cảm'},
    {index: 2, text: 'Nội dung đánh giá chứa quảng cáo'},
    {index: 3, text: 'Nội dung đánh giá spam'},
    {index: 4, text: 'Lý do khác'}
]

const ReportForm = (props) => {
    const [reportIndex, setReportIndex] = useState(0)
    const [reportContent, setReportContent] = useState("")
    const onOptionChange = e => {
        setReportIndex(e.target.value)
        if (e.target.value==4){
            setReportContent("")
        }else{
            setReportContent(reportInput[e.target.value-1].text)
        }
    }

    const handleReportSubmit = async() => {
        try{
            const reportRes = await main_axios_instance.post('/report/create/', {
                'commentId': props.commentId,
                'userId': props.userId,
                'content': reportContent
            });
            console.log(reportRes)
            const commentRes = await main_axios_instance.put(`/comment/update/${props.commentId}`, {
                status: 'pending',
            })
            console.log(commentRes)
            toast.success("Gửi báo cáo thành công", {position: toast.POSITION.TOP_CENTER});
            props.onClose()
            props.handleCommentChange()
        }catch(err){
            console.log(err)
            toast.error("Xuất hiện lỗi phát sinh khi gửi báo cáo", {position: toast.POSITION.TOP_CENTER});
        }
    }

    return(
        <div className='report-form'>
            <div className='report-form-section'>
                <h2>Báo comment vi phạm</h2>
                <div className='report-form-input'>
                    {reportInput.map((input) => {
                        return (
                            <Fragment key={input.index}>
                                <div>
                                    <input type="radio" id="html" name="input" value={input.index} onChange={onOptionChange}/>
                                    <label htmlFor="html">{input.text}</label>
                                </div>
                            </Fragment>
                        )
                    })}
                    <textarea 
                        value={reportContent} 
                        onChange={e => {setReportContent(e.target.value)}}
                        style={{display: reportIndex==4?"flex":"none"}}
                    />
                </div>

                <div className='report-form-button'>
                    <button onClick={props.onClose}>Huỷ</button>
                    <button onClick={handleReportSubmit} disabled={reportIndex===0}>Gửi báo cáo</button>
                </div>
            </div>
        </div>
    )
}

export default ReportForm;