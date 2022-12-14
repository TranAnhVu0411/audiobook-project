import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import ChapterInfoEdit from "./ChapterInfoEdit/ChapterInfoEdit"
import ChapterPagesEdit from "./ChapterPagesEdit/ChapterPagesEdit"
import {pdf_axios_instance} from '../../service/custom-axios';
import axios from "axios";
import "./style.scss";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import noImage from '../../image/noImg.png';

const ChapterEdit = () => {
    const location = useLocation();
    const chapterId = location.pathname.split("/").at(-2);
    const [isLoad, setIsLoad] = useState(false);
    const [isUpload, setIsUpload] = useState(true);
    const [chapterName, setChapterName] = useState("");
    const [chapterPages, setChapterPages] = useState([])

    useEffect(() => {
        const fetchData = async() => {
            try{
                const chapterRes = await pdf_axios_instance.get(`/chapters/${chapterId}`)
                console.log(chapterRes)
                setChapterName(chapterRes.data['chapter']["name"])
                let urlRequestsList = []
                // get presigned URL list
                for (let i = 0; i<chapterRes.data['pages'].length; i++) {
                    let urlForm = new FormData();
                    urlForm.append('upload-type', 'GET');
                    urlForm.append('type', 'page');
                    urlForm.append('id', chapterRes.data['pages'][i]['_id']["$oid"])
                    urlForm.append('data-type', 'image')
                    urlRequestsList.push(pdf_axios_instance.post('/urls', urlForm))
                }
                let urlResponsesList = await axios.all(urlRequestsList)
                console.log(urlResponsesList)
                let pagesInfo = [];
                for(let i = 0; i<chapterRes.data['pages'].length; i++) {
                    pagesInfo.push({
                        "id": chapterRes.data['pages'][i]['_id']["$oid"],
                        "imageStatus": chapterRes.data['pages'][i]['imageStatus'],
                        "ocrStatus": chapterRes.data['pages'][i]['ocrStatus'],
                        "pdfStatus": chapterRes.data['pages'][i]['pdfStatus'],
                        "audioStatus": chapterRes.data['pages'][i]['audioStatus'],
                        "url": urlResponsesList[i].data['url']
                    })
                }
                setChapterPages(pagesInfo)
            
                setIsLoad(true);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData() 
    }, [chapterId])

    // X??? l?? vi???c s???a t??n ch????ng
    const handleChapterName = async(name) => {
        if (name !== chapterName){
            try{
                setIsUpload(false)
                let chapterForm = new FormData();
                chapterForm.append('name', name);
                let updateRes = pdf_axios_instance.put(`/chapters/${chapterId}`, chapterForm)
                console.log(updateRes)
                setChapterName(name)
                setIsUpload(true)
                toast.success("Update th??ng tin ch????ng th??nh c??ng", {position: toast.POSITION.TOP_CENTER});
            }catch(err){
                console.log(err)
                setIsUpload(true)
                toast.error("Update th??ng tin ch????ng th???t b???i", {position: toast.POSITION.TOP_CENTER});
            }
        }
    }

    // X??? l?? vi???c s???a th??? t??? trang/xo?? trang
    const handleChapterPages = async(pageList, deletePageList) => {
            try{
                setIsUpload(false)
                // Xo?? trang
                if (deletePageList.length > 0){
                    let deleteDocumentRequestsList = []
                    let urlRequestsList = []
                    for (let i = 0; i<deletePageList.length; i++){
                        let urlForm = new FormData();
                        urlForm.append('upload-type', 'DELETE');
                        urlForm.append('type', 'page');
                        urlForm.append('id', deletePageList[i]['id'])
                        urlRequestsList.push(pdf_axios_instance.post('/urls', urlForm))
                        deleteDocumentRequestsList.push(pdf_axios_instance.delete(`/pages/${deletePageList[i]['id']}`))
                    }
                    // L???y Presigned URL cho vi???c xo?? d??? li???u 
                    let urlResponsesList = await axios.all(urlRequestsList)
                    let deleteFileRequestsList = []
                    let deleteFolderRequestsList = []
                    for (let i = 0; i<urlResponsesList.length; i++) {
                        let data = urlResponsesList[i].data
                        for (const type in data) {
                            if (type !== 'folder_url'){
                                if (data[type] !== 'not exist'){
                                    deleteFileRequestsList.push(fetch(data[type], {
                                        method: 'DELETE',
                                        redirect: 'follow'
                                    }))
                                }
                            }else{
                                deleteFolderRequestsList.push(fetch(data[type], {
                                    method: 'DELETE',
                                    redirect: 'follow'
                                }))
                            }
                        }
                    }

                    // Th???c hi???n qu?? tr??nh xo?? d??? li???u tr??n cloud (Xo?? file tr?????c, xo?? folder sau)
                    const deleteFileResponsesList = await Promise.all(deleteFileRequestsList)
                    console.log(deleteFileResponsesList)
                    const deleteFolderResponsesList = await Promise.all(deleteFolderRequestsList)
                    console.log(deleteFolderResponsesList)

                    // Xo?? c??c b???n ghi trong CSDL
                    let deleteDocumentResponsesList = await axios.all(deleteDocumentRequestsList)
                    console.log(deleteDocumentResponsesList)
                }
                // C???p nh???t th??? t??? trang
                let updateRequestsList = []
                for (let i = 0; i<pageList.length; i++){
                    let updateForm = new FormData();
                    updateForm.append('index', i+1);
                    updateRequestsList.push(pdf_axios_instance.put(`/pages/${pageList[i]['id']}`, updateForm))
                }
                let updateResponsesList = await axios.all(updateRequestsList)
                console.log(updateResponsesList)

                setChapterPages(pageList)
                setIsUpload(true)
                toast.success("Update list trang th??nh c??ng", {position: toast.POSITION.TOP_CENTER});
            }catch(err){
                console.log(err)
                setIsUpload(true)
                toast.error("Update list trang th???t b???i", {position: toast.POSITION.TOP_CENTER});
            }
    }

    const handlePageImageWrite = async(file) => {
        try{
            setIsUpload(false);
            // Th??m trang m???i v??o database
            let pageForm = new FormData();
            pageForm.append('chapterId', chapterId)
            pageForm.append('index', chapterPages.length)
            let pageWriteRes = await pdf_axios_instance.post('/pages', pageForm)
            console.log(pageWriteRes)
            let pageId = pageWriteRes.data.pageId

            // C???p nh???t l???i list pages cho chapter m???i t???o ra
            let chapterAddForm = new FormData();
            chapterAddForm.append('pageId', pageId)
            let chapterAddRes = await pdf_axios_instance.put(`/chapters/${chapterId}`, chapterAddForm)
            console.log(chapterAddRes)

            // T???o Presigned URL
            let urlForm = new FormData();
            urlForm.append('upload-type', 'PUT');
            urlForm.append('type', 'page');
            urlForm.append('id', pageId)
            urlForm.append('data-type', 'image')
            let urlRes = await pdf_axios_instance.post('/urls', urlForm)
            console.log(urlRes)

            // Upload ???nh l??n cloud
            let pageHeaders = new Headers();
            pageHeaders.append("Content-Type", file.type);
            let uploadRes = await fetch(urlRes.data.url, {
                method: 'PUT',
                headers: pageHeaders,
                body: file,
                redirect: 'follow'
            })
            console.log(uploadRes);

            // X??? l?? OCR+Audio
            let preprocessForm = new FormData();
            preprocessForm.append('pageId', pageId)
            let preprocessRes = await pdf_axios_instance.post('/preprocess/page', preprocessForm)
            console.log(preprocessRes);

            // L???y d??? li???u trang m???i t???o
            let pageRes = await pdf_axios_instance.get(`/pages/${pageId}`)
            console.log(pageRes)
            let newPage = {}
            newPage.id = pageId
            newPage.imageStatus = pageRes.data['page']['imageStatus']
            newPage.ocrStatus = pageRes.data['page']['ocrStatus']
            newPage.pdfStatus = pageRes.data['page']['pdfStatus']
            newPage.audioStatus = pageRes.data['page']['audioStatus']
            if (pageRes.data['page']['imageStatus']==='ready'){
                let newUrlForm = new FormData();
                newUrlForm.append('upload-type', 'GET');
                newUrlForm.append('type', 'page');
                newUrlForm.append('id', pageId);
                newUrlForm.append('data-type', 'image')
                let newUrlRes = await pdf_axios_instance.post('/urls', newUrlForm)
                newPage.url = newUrlRes.data['url']
            }else{
                newPage.url = noImage
            }

            setChapterPages([...chapterPages, newPage])
            setIsUpload(true);
            toast.success("Th??m trang th??nh c??ng, ??ang ch??? x??? l??", {position: toast.POSITION.TOP_CENTER});
        }catch(err){
            console.log(err)
            setIsUpload(true)
            toast.error("Th??m trang th???t b???i", {position: toast.POSITION.TOP_CENTER});
        }
    }


    if (isLoad && isUpload){
        return (
            <div className="chapter-edit">
                <ChapterInfoEdit chapterName={chapterName} handleChapterName={handleChapterName}/>
                <ChapterPagesEdit 
                    chapterPages={chapterPages} 
                    handleChapterPages={handleChapterPages}
                    handlePageImageWrite={handlePageImageWrite}
                />
            </div>
        )
    }else{
        return <LoadingScreen />
    }
}

export default ChapterEdit;