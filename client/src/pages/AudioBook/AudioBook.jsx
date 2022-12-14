import React, {useState, useEffect} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import {pdf_axios_instance} from '../../service/custom-axios';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import {BsZoomIn, BsZoomOut, BsHeadphones, BsFullscreenExit, BsFullscreen, BsFillCaretRightFill, BsFillCaretLeftFill} from 'react-icons/bs';

// Import the main component
import { Viewer } from '@react-pdf-viewer/core';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

import { toolbarPlugin } from '@react-pdf-viewer/toolbar';

import {
    highlightPlugin,
} from '@react-pdf-viewer/highlight';

import './style.scss';


const AudioBook = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const chapterId = location.pathname.split("/").at(-1);
    const [metaData, setMetadata] = useState({})
    const [url, setUrl] = useState({
        pdf: null,
        audio: null
    })
    const [isLoad, setIsLoad] = useState(false)

    useEffect(() => {
        const fetchData = async() => {
            try{
                const metaRes = await pdf_axios_instance.get(
                    `/chapter_meta/${chapterId}`
                )
                setMetadata(metaRes.data)

                let pdfUrlForm = new FormData();
                pdfUrlForm.append('upload-type', 'GET');
                pdfUrlForm.append('type', 'chapter');
                pdfUrlForm.append('id', chapterId)
                pdfUrlForm.append('data-type', 'pdf')
                let pdfUrlRes = await pdf_axios_instance.post('urls', pdfUrlForm)

                let audioUrlForm = new FormData();
                audioUrlForm.append('upload-type', 'GET');
                audioUrlForm.append('type', 'chapter');
                audioUrlForm.append('id', chapterId)
                audioUrlForm.append('data-type', 'audio')
                let audioUrlRes = await pdf_axios_instance.post('urls', audioUrlForm)

                setUrl({pdf: pdfUrlRes.data['url'], audio: audioUrlRes.data['url']})
                setIsLoad(true)
            }catch (err) {
                setIsLoad(true)
                console.log(err);
            }
        }
        fetchData()
    }, [chapterId])

    // Toolbar
    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance

    // Render Highlight
    const renderHighlights = (props) => (
        <div className='hello'>
            {metaData['sentences'].map((sentence) => (
                <div key={sentence['sentenceId']}>
                    {sentence.highlightAreas
                        // Filter all highlights on the current page
                        .filter((area) => area.pageIndex === props.pageIndex)
                        .map((area, idx) => (
                            <div
                                className='highlight-box'
                                key={idx}
                                id={`s${sentence['sentenceId']}${idx}`}
                                style={Object.assign(
                                    props.getCssProperties(area, props.rotation)
                                )}
                            ></div>
                        ))}
                </div>
            ))}
        </div>
    );

    const highlightPluginInstance = highlightPlugin({
        renderHighlights,
    });

    // Audio
    const { jumpToHighlightArea } = highlightPluginInstance;

    const [audioView, setAudioView] = useState(false);
    const [currentSentenceId, setCurrentSentenceId] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);

    // Hi???n th??? highlight khi ch???y auido
    const timeUpdate = (e) => {
        const highlightMetadata = metaData['sentences'].find((sentence) => {
            return sentence.endTime >= e.target.currentTime;
        });
        if(currentSentenceId!==highlightMetadata['sentenceId']){
            document.querySelectorAll('.highlight-box.highlight').forEach((el) => el.classList.remove('highlight'));
            for(let i = 0; i < highlightMetadata["highlightAreas"].length; i++){
                const highlightElement = document.querySelector(`#s${highlightMetadata["sentenceId"]}${i}`)
                highlightElement.classList.add('highlight');
            }
            setCurrentSentenceId(highlightMetadata['sentenceId']);
            jumpToHighlightArea(highlightMetadata.highlightAreas[0]);
        }
    }

    // Set l???i th???i gian ch???y khi thay ?????i v??? tr?? trang (l?? highlight ?????u ti??n c???a page ??ang hi???n th???)
    const handlePageChange = (e) => {
        const highlightMetadata = metaData['sentences'].find((sentence) => {
            return sentence.pageIndex == e.currentPage;
        });
        setCurrentTime(highlightMetadata.endTime-highlightMetadata.duration)
    };

    const handleAudioView = () => {
        let audioTag = document.querySelectorAll('#audiobook-audio')[0]
        if (audioView) {
            // Xo?? to??n b??? highlight
            document.querySelectorAll('.highlight-box.highlight').forEach((el) => el.classList.remove('highlight'));
            // Ng???t audio khi kh??ng b???t audio view
            audioTag.pause()
        }else{
            // B???t audio khi b???t audio view
            audioTag.play()
            // Set th???i gian b???t ?????u c???a audio theo v??? tr?? trang 
            audioTag.currentTime=currentTime
        }
        setAudioView(!audioView)
    }

    const handlePreviousChapter = async() => {
        const checkRes = await pdf_axios_instance(`/chapters/${chapterId}?state=previous`)
        if (checkRes.data['pdfStatus']==='ready'&&checkRes.data['audioStatus']==='ready'){
            // N???u pdf v?? audio ch??a s???n s??ng => ????a ra c???nh b??o
            navigate(`/chapter/${checkRes.data['chapter']["_id"]["$oid"]}`)
        }else{
            // N???u kh??ng => chuy???n trang
            window.alert('Ch????ng ??ang trong qu?? tr??nh ch???nh s???a, xin vui l??ng th??? l???i sau')
        }
    }

    // T????ng t??? nh?? tr??n
    const handleNextChapter = async() => {
        const checkRes = await pdf_axios_instance(`/chapters/${chapterId}?state=next`)
        if (checkRes.data['pdfStatus']==='ready'&&checkRes.data['audioStatus']==='ready'){
            navigate(`/chapter/${checkRes.data['chapter']["_id"]["$oid"]}`)
        }else{
            window.alert('Ch????ng ??ang trong qu?? tr??nh ch???nh s???a, xin vui l??ng th??? l???i sau')
        }
    }

    // Full Screen
    const [fullScreen, setFullScreen] = useState(true);

    if (isLoad){
        return (
            <div className={`audio-book ${fullScreen?'fullscreen-mode':'normal-mode'}`}>
                <div className="pdf-toolbar">
                    <Toolbar>
                        {(props) => {
                            const {
                                CurrentPageInput,
                                NumberOfPages,
                                CurrentScale,
                                ZoomIn,
                                ZoomOut,
                            } = props;
                            return (
                                <>
                                    <div className='zoom-section'>
                                        <div>
                                            <ZoomOut>
                                                {(props) => (
                                                    <button onClick={props.onClick} title="Ph??ng to">
                                                        <BsZoomOut/>
                                                    </button>
                                                )}
                                            </ZoomOut>
                                        </div>
                                        <div>
                                            <CurrentScale/>
                                        </div>
                                        <div>
                                            <ZoomIn>
                                                {(props) => (
                                                    <button onClick={props.onClick} title="Thu nh???">
                                                        <BsZoomIn/>
                                                    </button>
                                                )}
                                            </ZoomIn>
                                        </div>
                                    </div>
                                    <div className='gotopage-section'>
                                        <span style={{width: '4rem'}}><CurrentPageInput/></span>
                                        <span>of</span>
                                        <NumberOfPages/>
                                    </div>
                                    <div className='ultilize-section'>
                                        <button 
                                            className='chapter-change-button'
                                            onClick={handlePreviousChapter} 
                                            disabled={metaData['chapter']['index']===1?true:false}
                                        >
                                            <BsFillCaretLeftFill/><span>Ch????ng tr?????c</span>
                                        </button>
                                        <button 
                                            className='chapter-change-button'
                                            onClick={handleNextChapter}  
                                            disabled={metaData['chapter']['index']===metaData['numChapter']?true:false}
                                        >
                                            <span>Ch????ng sau</span><BsFillCaretRightFill/>
                                        </button>
                                        <button 
                                            onClick={handleAudioView} 
                                            style = {{
                                                backgroundColor: audioView?'black':'white',
                                                color: audioView?'white':'black',
                                            }}
                                            title={audioView?'T???t audio':'B???t audio'}
                                        >
                                            <BsHeadphones/>
                                        </button>
                                        <button 
                                            onClick={() => setFullScreen(!fullScreen)}
                                            title={fullScreen?'T???t to??n m??n h??nh':'B???t to??n m??n h??nh'}
                                        >
                                            {fullScreen?<BsFullscreenExit/>:<BsFullscreen/>}
                                        </button>
                                    </div>
                                </>
                            );
                        }}
                    </Toolbar>
                </div>
                <div style={{display: audioView?'flex':'none'}} >
                    <audio 
                        id = 'audiobook-audio'
                        controls 
                        src={url.audio}
                        onTimeUpdate={timeUpdate}
                    />
                </div>
                <div 
                    className='pdf-viewer' 
                    style={fullScreen?
                        (audioView?{height: '80vh'}:{height: '100vh'}):
                        (audioView?{height: '70vh'}:{height: '80vh'})}>
                    <Viewer 
                        fileUrl={url.pdf}
                        onPageChange={handlePageChange} 
                        plugins={[toolbarPluginInstance, highlightPluginInstance]} />
                </div>
            </div>
        )
    }else{
        return(
            <LoadingScreen/>
        )
    }
}

export default AudioBook;