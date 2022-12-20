import React, { useEffect, useState } from 'react';
import {pdf_axios_instance} from '../../service/custom-axios';
import { useLocation } from 'react-router-dom';
import './style.scss'
import {v4 as uuidv4} from "uuid";
import PageCanvas from './PageCanvas/PageCanvas';
import RandomColor from 'randomcolor'
import SentenceInfo from './SentenceInfo/SentenceInfo'

const PageEdit = () => {
    // url của ảnh
    let [imageUrl, setImageUrl] = useState("")

    // Dữ liệu list câu, có cấu trúc các thành phần
    // {
    //     color: ,
    //     text: ,
    //     sentenceId: ,
    //     state: , (Cho việc lựa chọn câu trên giao diện, lúc khởi tạo để false)
    // }

    let [originalSentenceInfo, setoriginalSentenceInfo] = useState([]) // Dữ liệu list câu original, phục vụ cho reset
    let [sentenceInfo, setSentenceInfo] = useState([])

    // Dữ liệu list bounding box của câu, có cấu trúc thành phần
    // {
    //     x: ,
    //     y: ,
    //     width: ,
    //     height: ,
    //     id: ,
    //     sentenceId: ,
    //  }
    let [originalSentenceBoundingBox, setoriginalSentenceBoundingBox] = useState([]) // Dữ liệu list bounding box original, phục vụ cho reset
    let [sentenceBoundingBox, setSentenceBoundingBox] = useState([])

    // List bounding box sẽ hiển thị trên canvas, có cấu trúc các thành phần
    // {
    //     x: ,
    //     y: ,
    //     width: ,
    //     height: ,
    //     id: ,
    //     sentenceId: ,
    //     stroke: ,
    // }
    let [initialRectangles, setInitialRectangles] = useState([])

    // Biến quản lý việc edit trong canvas
    const [edit, setEdit] = useState(false)
    // Biến quản lý màu sẽ sử dụng
    const [color, setColor] = useState(null)

    const location = useLocation();
    const pageId = location.pathname.split("/").at(-2);
    useEffect(() => {
        const fetchData = async() => {
            const pageRes = await pdf_axios_instance.get(`/pages/${pageId}`)
            console.log(pageRes)

            let urlForm = new FormData();
            urlForm.append('upload-type', 'GET');
            urlForm.append('type', 'page');
            urlForm.append('id', pageRes.data['page']['_id']["$oid"])
            urlForm.append('data-type', 'image')
            const urlRes = await pdf_axios_instance.post('/urls', urlForm)
            setImageUrl(urlRes.data['url'])

            let tempSentenceInfo = []
            let tempSentenceBB = []
            for(let i = 0; i<pageRes.data['sentences'].length; i++){
                let tempInfo = {}
                let color = RandomColor()
                tempInfo.color = color
                tempInfo.text = pageRes.data['sentences'][i]['text']
                tempInfo.sentenceId = pageRes.data['sentences'][i]['_id']["$oid"]
                tempInfo.state = false
                tempSentenceInfo.push(tempInfo)
                for (let j = 0; j<pageRes.data['sentences'][i]['boundingBox'].length; j++) {
                    let tempBB = {}
                    tempBB.x = pageRes.data['sentences'][i]['boundingBox'][j]['x']
                    tempBB.y = pageRes.data['sentences'][i]['boundingBox'][j]['y']
                    tempBB.width = pageRes.data['sentences'][i]['boundingBox'][j]['width']
                    tempBB.height = pageRes.data['sentences'][i]['boundingBox'][j]['height']
                    tempBB.id = uuidv4()
                    tempBB.sentenceId = pageRes.data['sentences'][i]['_id']["$oid"]
                    tempSentenceBB.push(tempBB)
                }
            }
            setoriginalSentenceInfo(tempSentenceInfo)
            setSentenceInfo(tempSentenceInfo)
            setoriginalSentenceBoundingBox(tempSentenceBB)
            setSentenceBoundingBox(tempSentenceBB)
        }
        fetchData()
    }, [])

    // Quản lý state của câu (Nếu state == true: hiển thị bounding box của câu đó)
    const handleState = (id) => {
        const updatedSentenceInfo = sentenceInfo.map(sentence => {
            if (sentence.sentenceId === id) {
                return {
                    ...sentence,
                    state: !sentence.state,
                }
            }
                return sentence;
            }
        )
        setSentenceInfo(updatedSentenceInfo)
        handleShowBB(updatedSentenceInfo)
    }

    // Quản lý màu của câu
    const handleColor = (id, color) => {
        const updatedSentenceInfo = sentenceInfo.map(sentence => {
            if (sentence.sentenceId === id) {
                return {
                    ...sentence,
                    color: color,
                }
            }
                return sentence;
            }
        )
        setSentenceInfo(updatedSentenceInfo)
        handleShowBB(updatedSentenceInfo)
    }

    // Hiển thị bounding box của các câu
    const handleShowBB = (sentenceInfo) => {
        // List id được click
        let clickedSentenceId = sentenceInfo.reduce((clickedSentenceId, sentence) => {
            if (sentence.state){
                clickedSentenceId.push(sentence.sentenceId)
            }
            return clickedSentenceId
        }, []) 
        // List id và color tương ứng
        let idColorMapper = sentenceInfo.reduce((idColorMapper, sentence) => {
            if (sentence.state){
                idColorMapper.push({id: sentence.sentenceId, color: sentence.color}) 
            }
            return idColorMapper
        }, []) 

        let tempInitialRectangle = []
        for(let i =0; i<sentenceBoundingBox.length; i++){
            // Nếu sentenceId của bounding box nằm trong list id
            if(clickedSentenceId.includes(sentenceBoundingBox[i].sentenceId)){
                // Trích xuất màu 
                let color = idColorMapper.filter(idColor => {
                        if (idColor.id===sentenceBoundingBox[i].sentenceId){
                            return idColor.color
                        }
                    }
                )[0].color
                tempInitialRectangle.push({
                        ...sentenceBoundingBox[i], 
                        stroke: color
                    })
                }
            }
        setInitialRectangles(tempInitialRectangle)

        if (clickedSentenceId.length === 1){
            setEdit(true);
            setColor(idColorMapper[0].color);
        }
        else{
            setEdit(false);
            setColor(null);
        }
    }

    // Quản lý text của câu
    const handleText = (id, text) => {
        const updatedSentenceInfo = sentenceInfo.map(sentence => {
            if (sentence.sentenceId === id) {
                return {
                    ...sentence,
                    text: text,
                }
            }
                return sentence;
            }
        )
        setSentenceInfo(updatedSentenceInfo)
    }

    // Quản lý thay đổi vị trí của câu
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = (fromIndex, toIndex) => {
        /* IGNORES DRAG IF OUTSIDE DESIGNATED AREA */
        if (toIndex < 0) return;
    
        const list = reorder(sentenceInfo, fromIndex, toIndex);
        return setSentenceInfo(list);
    };

    console.log(sentenceInfo)

    return (
        <div className='page-edit'>
            <div className='page-edit-header'>
                <h1>Thông tin trang sách</h1>
                <hr></hr>
            </div>
            <div className='page-edit-section'>
                <PageCanvas 
                    initialRectangles = {initialRectangles} 
                    imageUrl={imageUrl}
                    color={color}
                    edit={edit}
                />
                <SentenceInfo 
                    sentenceInfo = {sentenceInfo} 
                    handleState = {handleState}
                    handleColor = {handleColor}
                    handleText = {handleText}
                    onDragEnd = {onDragEnd}
                />
            </div>
            <div className='page-edit-submit'>
                <button>Lưu thay đổi</button>
            </div>
        </div>
    );
}

export default PageEdit;