import React, { useEffect, useState } from 'react';
import {pdf_axios_instance} from '../../service/custom-axios';
import { useLocation } from 'react-router-dom';
import './style.scss'
import {v4 as uuidv4} from "uuid";
import PageCanvas from './PageCanvas/PageCanvas';
import RandomColor from 'randomcolor'
import SentenceInfo from './SentenceInfo/SentenceInfo'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
    let [displayRectangles, setDisplayRectangles] = useState([])

    // Biến quản lý việc edit trong canvas
    const [edit, setEdit] = useState(false)
    // Biến quản lý màu sẽ sử dụng để edit
    const [color, setColor] = useState(null)
    // Biến lưu id câu đang chỉnh sửa
    const [editSentenceId, setEditSentenceId] = useState(null)
    // Biến lưu id câu đang được click
    const [clickedSentenceId, setClickedSentenceId] = useState([])

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
        let currentClickedSentenceId = sentenceInfo.reduce((currentClickedSentenceId, sentence) => {
            if (sentence.state){
                currentClickedSentenceId.push(sentence.sentenceId)
            }
            return currentClickedSentenceId
        }, []) 
        // List id và color tương ứng
        let idColorMapper = sentenceInfo.reduce((idColorMapper, sentence) => {
            if (sentence.state){
                idColorMapper.push({id: sentence.sentenceId, color: sentence.color}) 
            }
            return idColorMapper
        }, []) 

        // Nếu chỉ có 1 sentence click => đang trong chế độ edit
        let tempEdit = true // Do edit và color chưa cập nhật ngay trong hàm này => sử dụng biến tạm
        let tempColor = null
        if (currentClickedSentenceId.length === 1){
            tempEdit = true
            tempColor = idColorMapper[0].color
            setEdit(true);
            setColor(idColorMapper[0].color);
            setEditSentenceId(currentClickedSentenceId[0])
        }
        else{
            tempEdit = false
            tempColor = null
            setEdit(false);
            setColor(null);
            setEditSentenceId(null)
        }
        console.log('clicked', clickedSentenceId)
        setClickedSentenceId(currentClickedSentenceId);

        // Nếu không edit/Trạng thái trước đó đang click vào 2 sentence/chưa click vào sentence nào => Vẽ lại toàn bộ
        if (!tempEdit || clickedSentenceId.length!=1){
            let tempInitialRectangle = []
            for(let i =0; i<sentenceBoundingBox.length; i++){
                // Nếu sentenceId của bounding box nằm trong list id
                if(currentClickedSentenceId.includes(sentenceBoundingBox[i].sentenceId)){
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
            setDisplayRectangles(tempInitialRectangle)
        }
        // Nếu những điều trên không thoả mãn => đổi màu bounding box
        else{
            let tempInitialRectangle = displayRectangles.map(rect => {return {...rect, stroke: tempColor}})
            setDisplayRectangles(tempInitialRectangle)
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

    // Lưu bounding box mới tạo
    const saveBoundingBox = () => {
        let tempSentenceBB = [];
        for(let i = 0; i < sentenceBoundingBox.length; i++) {
            if (sentenceBoundingBox[i].sentenceId !== editSentenceId){
                tempSentenceBB.push(sentenceBoundingBox[i])
            }
        }
        for(let i = 0; i<displayRectangles.length; i++){
            if (displayRectangles[i].sentenceId!==undefined){
                tempSentenceBB.push(displayRectangles[i])
            }else{
                tempSentenceBB.push({...displayRectangles[i], sentenceId: editSentenceId})
            }
        }
        setSentenceBoundingBox(tempSentenceBB)
        toast.success("Thêm bounding box thành công", {position: toast.POSITION.TOP_CENTER});
    }

    // Lưu câu mới tạo
    const handleWriteSentence = (text, color) => {
        const newSentence = {
            sentenceId: 'new-'+uuidv4(),
            text: text,
            color: color,
            state: false
          };
        setSentenceInfo([...sentenceInfo, newSentence])
    }

    return (
        <div className='page-edit'>
            <div className='page-edit-header'>
                <h1>Thông tin trang sách</h1>
                <hr></hr>
            </div>
            <div className='page-edit-section'>
                <PageCanvas 
                    displayRectangles = {displayRectangles} 
                    setDisplayRectangles = {setDisplayRectangles}
                    imageUrl={imageUrl}
                    color={color}
                    edit={edit}
                    saveBoundingBox={saveBoundingBox}
                />
                <SentenceInfo 
                    sentenceInfo = {sentenceInfo} 
                    handleState = {handleState}
                    handleColor = {handleColor}
                    handleText = {handleText}
                    onDragEnd = {onDragEnd}
                    handleWriteSentence = {handleWriteSentence}
                    edit = {edit}
                    editSentenceId = {editSentenceId}
                />
            </div>
            <div className='page-edit-submit'>
                <button>Lưu thay đổi</button>
            </div>
        </div>
    );
}

export default PageEdit;