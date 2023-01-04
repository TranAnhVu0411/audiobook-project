import React, {useState, useEffect} from 'react';
import { useLocation } from "react-router-dom";
import {pdf_axios_instance} from '../../service/custom-axios';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { BsZoomIn, BsZoomOut, BsHeadphones } from 'react-icons/bs';

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
    }, [])

    // Toolbar
    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance

    // Highlight audio
    const [audioView, setAudioView] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlay, setPlay] = useState(false);
    const [currentSentenceId, setCurrentSentenceId] = useState(null);

    const timeUpdate = (e) => {
        const highlightMetadata = metaData['sentences'].find((sentence) => {
            return sentence.endTime > e.target.currentTime;
        });
        if(currentSentenceId!==highlightMetadata['sentenceId']){
            document.querySelectorAll('.highlight-box.highlight').forEach((el) => el.classList.remove('highlight'));
            for(let i = 0; i < highlightMetadata["highlightAreas"].length; i++){
                const highlightElement = document.querySelector(`#s${highlightMetadata["sentenceId"]}${i}`)
                highlightElement.classList.add('highlight');
            }
            setCurrentSentenceId(highlightMetadata['sentenceId']);
        }
    }

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

    if (isLoad){
        return (
            <div className='audio-book'>
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
                                    <div className='zoom-gotopage-section'>
                                        <div className='zoom-section'>
                                            <div>
                                                <ZoomOut>
                                                    {(props) => (
                                                        <button onClick={props.onClick}>
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
                                                        <button onClick={props.onClick}>
                                                            <BsZoomIn/>
                                                        </button>
                                                    )}
                                                </ZoomIn>
                                            </div>
                                        </div>
                                        <div className='gotopage-section'>
                                            <CurrentPageInput/>
                                            <span>/</span>
                                            <NumberOfPages/>
                                        </div>
                                        <div>
                                            <button 
                                                onClick={() => {setAudioView(!audioView)}} 
                                                style = {{
                                                    backgroundColor: audioView?'black':'white',
                                                    color: audioView?'white':'black',
                                                }}
                                            >
                                                <BsHeadphones/>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            );
                        }}
                    </Toolbar>
                </div>
                <audio 
                    controls 
                    className="player"
                    style={{display: audioView?'flex':'none'}} 
                    src={url.audio}
                    onTimeUpdate={timeUpdate}
                />
                <div className='pdf-viewer'>
                    <Viewer fileUrl={url.pdf} plugins={[toolbarPluginInstance, highlightPluginInstance]} />
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