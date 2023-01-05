import React, { useEffect, useState } from 'react';
import {pdf_axios_instance} from '../../service/custom-axios';
import { useLocation } from 'react-router-dom';
import './style.scss'
import {v4 as uuidv4} from "uuid";
import PageCanvas from './PageCanvas/PageCanvas';
import SentenceInfo from './SentenceInfo/SentenceInfo'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import axios from 'axios';

const PageEdit = () => {
    // url của ảnh
    let [imageUrl, setImageUrl] = useState("")

    // Dữ liệu list câu, có cấu trúc các thành phần
    // {
    //     text: ,
    //     sentenceId: ,
    //     state: , (Cho việc lựa chọn câu trên giao diện, lúc khởi tạo để false)
    // }

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
    let [sentenceBoundingBox, setSentenceBoundingBox] = useState([])

    // List bounding box sẽ hiển thị trên canvas, có cấu trúc các thành phần
    // {
    //     x: ,
    //     y: ,
    //     width: ,
    //     height: ,
    //     id: ,
    //     sentenceId: ,
    // }
    let [displayRectangles, setDisplayRectangles] = useState([])

    // Màu bounding box và highlight
    let [bbColor, setBbColor] = useState("#000000")
    let [highlightColor, setHighlightColor] = useState("#d4ff32")

    // Cho phép hiển thị highlight
    let [enableHighlight, setEnableHighlight] = useState('true')

    // Biến quản lý việc edit bounding box trong canvas
    const [editState, setEditState] = useState(false)
    // Danh sách các câu được checked
    const [checkedSentenceId, setCheckedSentenceId] = useState([])

    // Biến quản lý việc tạo mới câu và bounding box trong canvas
    const [newState, setNewState] = useState(false)

    // Danh sách các sentence id bị loại bỏ
    const [removeSentenceId, setRemoveSentenceId] = useState([])

    const location = useLocation();
    const pageId = location.pathname.split("/").at(-2);

    const [isUpload, setIsUpload] = useState(true);
    const [isLoad, setIsLoad] = useState(false)

    useEffect(() => {
        const fetchData = async() => {
            const pageRes = await pdf_axios_instance.get(`/pages/${pageId}`)
            // console.log(pageRes)

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
            setSentenceInfo(tempSentenceInfo)
            setSentenceBoundingBox(tempSentenceBB)
            setRemoveSentenceId([])
            setIsLoad(true)
        }
        fetchData()
    }, [isLoad, isUpload])

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

    // Hiển thị bounding box của các câu
    const handleShowBB = (sentenceInfo) => {
        // List id được click
        let currentCheckedSentenceId = sentenceInfo.reduce((currentCheckedSentenceId, sentence) => {
            if (sentence.state){
                currentCheckedSentenceId.push(sentence.sentenceId)
            }
            return currentCheckedSentenceId
        }, []) 
        setCheckedSentenceId(currentCheckedSentenceId)

        let tempInitialRectangle = []
        for(let i =0; i<sentenceBoundingBox.length; i++){
            // Nếu sentenceId của bounding box nằm trong list id
            if(currentCheckedSentenceId.includes(sentenceBoundingBox[i].sentenceId)){
                tempInitialRectangle.push({
                    ...sentenceBoundingBox[i], 
                })
            }
        }
        setDisplayRectangles(tempInitialRectangle)
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
            if (sentenceBoundingBox[i].sentenceId !== checkedSentenceId[0]){
                tempSentenceBB.push(sentenceBoundingBox[i])
            }
        }
        for(let i = 0; i<displayRectangles.length; i++){
            if (displayRectangles[i].sentenceId!==undefined){
                tempSentenceBB.push(displayRectangles[i])
            }else{
                tempSentenceBB.push({...displayRectangles[i], sentenceId: checkedSentenceId[0]})
            }
        }
        setSentenceBoundingBox(tempSentenceBB)
        setEditState(false)
        toast.success("Cập nhật bounding box thành công", {position: toast.POSITION.TOP_CENTER});
    }

    // Lưu câu mới tạo và bounding box
    const handleWriteSentence = (text) => {
        let id = 'new-'+uuidv4()
        const newSentence = {
            sentenceId: id,
            text: text,
            state: true
        };
        setSentenceInfo([...sentenceInfo, newSentence])
        setSentenceBoundingBox(sentenceBoundingBox.concat(displayRectangles.map(rect => {return {...rect, sentenceId: id}})))
        setDisplayRectangles(displayRectangles.map(rect => {return {...rect, sentenceId: id}}))
        setCheckedSentenceId([id])
        setNewState(false)
        toast.success("Thêm mới câu thành công", {position: toast.POSITION.TOP_CENTER});
    }

    // Xử lý hiển thị/thoát chế độ edit bounding box
    const handleEdit = () =>{
        // Nếu đang trong trạng thái chỉnh sửa bb câu mà quay lại => cảnh báo người dùng
        if (editState){
            if (window.confirm("Nếu thoát ra bạn, mọi thay đổi sẽ không được lưu lại\nBạn có chắc chắn muốn thực hiện tác vụ trên?")){
                // Khôi phục lại hình ban đầu
                handleShowBB(sentenceInfo);
                setEditState(!editState);
            }
        }else{
            setEditState(!editState);   
        }
    }

    // Xử lý hiển thị/thoát chế độ thêm mới câu
    const handleNew = () => {
        // Nếu chưa trong trạng thái thêm mới câu + bb 
        // => Chuyển trạng thái, huỷ tất cả các sentence đang click, các bounding box đang hiển thị
        if (!newState){
            let tempSentenceInfo = sentenceInfo.map(s => {return {...s, state: false}})
            setSentenceInfo(tempSentenceInfo)
            setCheckedSentenceId([])
            setDisplayRectangles([])
            setNewState(!newState);
        // Nếu đang trong trạng thái thêm mới câu + bb mà quay lại => cảnh báo người dùng
        }else{
            if (window.confirm("Nếu thoát ra bạn, mọi thay đổi sẽ không được lưu lại\nBạn có chắc chắn muốn thực hiện tác vụ trên?")){
                setNewState(!newState);
            }
        }
    }

    const handleDelete = () => {
        if (window.confirm("Nếu thực hiện, mọi thay đổi sẽ không được hoàn tác lại\nBạn có chắc chắn muốn thực hiện tác vụ trên?")){    
            let removeId = sentenceInfo.reduce((removeId, sentence) => {
                if (sentence.state){
                    removeId.push(sentence.sentenceId)
                }
                return removeId
            }, [])
            setRemoveSentenceId(removeSentenceId.concat(removeId.filter(id => {
                // Nếu sentence đó không có trong csdl ban đầu => Không cần lưu
                return !id.includes("new")
            })))
            setSentenceInfo([
                ...sentenceInfo.filter(sentence => {
                    return !removeId.includes(sentence.sentenceId);
                }),
            ])
            setSentenceBoundingBox([
                ...sentenceBoundingBox.filter(bb => {
                    return !removeId.includes(bb.sentenceId);
                }),
            ])
            setDisplayRectangles([])
            setCheckedSentenceId([])
        }
    }

    const handleSubmit = async() => {
        try{
            // Update trạng thái của page
            let statusForm = new FormData()
            statusForm.append('audioStatus', 'processing')
            let statusRes = await pdf_axios_instance.put(`/pages/${pageId}`, statusForm)
            console.log(statusRes)
            
            // Xoá câu
            let deleteRequestsList = []
            for(let i = 0; i < removeSentenceId.length; i++){
                deleteRequestsList.push(pdf_axios_instance.delete(`/sentences/${removeSentenceId[i]}`))
            }
            let deleteResponsesList = await axios.all(deleteRequestsList)
            console.log(deleteResponsesList)



            // Update/Create thông tin sentence
            let requestsList = []
            for (let i = 0; i < sentenceInfo.length; i++){
                let sentenceForm = new FormData();
                sentenceForm.append(
                    'boundingBox', 
                    JSON.stringify(sentenceBoundingBox.filter(bb => {
                        if(bb.sentenceId===sentenceInfo[i].sentenceId){
                            return bb
                        }
                    }))
                )
                sentenceForm.append('text', sentenceInfo[i].text)
                sentenceForm.append('index', i+1)
                
                if (sentenceInfo[i].sentenceId.includes('new-')){
                    // Nếu sentenceId có new => sentence mới => post
                    sentenceForm.append('pageId', pageId)
                    requestsList.push(pdf_axios_instance.post(`/sentences`, sentenceForm))
                }else{
                    // Nếu không, cập nhật thông tin sentence
                    requestsList.push(pdf_axios_instance.put(`/sentences/${sentenceInfo[i].sentenceId}`, sentenceForm))
                }
            }
            let responsesList = await axios.all(requestsList)
            console.log(responsesList)

            // Chỉnh sửa audio cho sách
            let preprocessForm = new FormData()
            preprocessForm.append('pageId', pageId)
            let preprocessRes = await pdf_axios_instance.put('/preprocess/audio', preprocessForm) 
            console.log(preprocessRes)
            setIsUpload(true);
            toast.success("Cập nhật trang thành công, đang chờ xử lý", {position: toast.POSITION.TOP_CENTER});
        }catch(err){
            console.log(err)
            setIsUpload(true)
            toast.error("Cập nhật trang thất bại", {position: toast.POSITION.TOP_CENTER});
        }
    }

    if (isUpload && isLoad) {
        return (
            <div className='page-edit'>
                <div className='page-edit-header'>
                    <h1>Thông tin trang sách</h1>
                    <hr></hr>
                </div>
                <div className='page-edit-section'>
                    <PageCanvas 
                        displayRectangles = {displayRectangles}
                        bbColor={bbColor} 
                        setBbColor={setBbColor}
                        setDisplayRectangles = {setDisplayRectangles}
                        highlightRectangles = {enableHighlight?sentenceBoundingBox:[]}
                        setHighlightColor={setHighlightColor}
                        highlightColor={highlightColor}
                        enableHighlight={enableHighlight}
                        setEnableHighlight={setEnableHighlight}
                        imageUrl={imageUrl}
                        editState={editState}
                        newState={newState}
                        saveBoundingBox={saveBoundingBox}
                    />
                    <SentenceInfo 
                        sentenceInfo = {sentenceInfo} 
                        handleState = {handleState}
                        handleText = {handleText}
                        onDragEnd = {onDragEnd}
                        handleWriteSentence = {handleWriteSentence}
                        editState={editState}
                        handleEdit={handleEdit}
                        checkedSentenceId={checkedSentenceId}
                        newState={newState}
                        handleNew={handleNew}
                        handleDelete={handleDelete}
                    />
                </div>
                <div className='page-edit-submit'>
                    <button 
                        onClick={() => {
                            setIsUpload(false)
                            handleSubmit()
                        }
                    }>Lưu thay đổi</button>
                </div>
            </div>
        );
    }else{
        return(
            <LoadingScreen/>
        )
    }
}

export default PageEdit;