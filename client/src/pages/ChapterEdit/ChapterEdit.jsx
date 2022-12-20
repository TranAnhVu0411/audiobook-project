import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import ChapterInfoEdit from "./ChapterInfoEdit/ChapterInfoEdit"
import ChapterPagesEdit from "./ChapterPagesEdit/ChapterPagesEdit"
import {pdf_axios_instance} from '../../service/custom-axios';
import axios from "axios";
import "./style.scss";

const ChapterEdit = () => {
    const location = useLocation();
    const chapterId = location.pathname.split("/").at(-2);
    const [isLoad, setIsLoad] = useState(false);
    const [isUpload, setIsUpload] = useState(true);
    const [chapterInfo, setChapterInfo] = useState(null);
    const [chapterPages, setChapterPages] = useState([])

    useEffect(() => {
        const fetchData = async() => {
            try{
                const chapterRes = await pdf_axios_instance.get(`/chapters/${chapterId}`)
                console.log(chapterRes)
                setChapterInfo(chapterRes.data['chapter'])
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
                        "index": chapterRes.data['pages'][i]['index'],
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



    if (isLoad && isUpload){
        return (
            <div className="chapter-edit">
                <ChapterInfoEdit chapterId={chapterId} chapterInfo={chapterInfo} setIsUpload={setIsUpload}/>
                <ChapterPagesEdit chapterPages={chapterPages}/>
            </div>
        )
    }else{
        return <LoadingScreen />
    }
}

export default ChapterEdit;