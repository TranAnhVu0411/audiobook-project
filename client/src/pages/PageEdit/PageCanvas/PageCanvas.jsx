import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import {v4 as uuidv4} from "uuid";
import { BiZoomIn, BiZoomOut, BiSave } from "react-icons/bi"
import './style.scss'
import Rectangle from './Rectangle';
import PageImage from './PageImage';

const SCALEBY = 1.02

const PageCanvas = (props) => {
    // Id bounding box được chọn
    const [selectedId, selectShape] = React.useState(null);
    // Kích thước canvas
    const [canvasMeasures, setCanvasMeasures] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const [originalMeasures, setOriginalMeasures] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    // Phục vụ cho phóng to/thu nhỏ
    const divCanvas = useRef(null)
    const [divCanvasWidth, setDivCanvasWidth] = useState(window.innerWidth)
    useLayoutEffect(() => {
        console.log(divCanvas.current.offsetWidth)
        console.log(originalMeasures.width)
        setDivCanvasWidth(divCanvas.current.offsetWidth);
      }, []);
    const [stageScale, setStageScale] = useState(divCanvasWidth/originalMeasures.width)
    // const [stageScale, setStageScale] = useState(3/4)
    // console.log(originalMeasures.width)

    // Sử dụng để vẽ hình mới
    const [newRectangle, setNewRectangle] = useState([]);

    const handleMouseDown = e => {
        if (props.edit){
            if (e.target.constructor.name === 'Image'){
                if (selectedId === null && newRectangle.length === 0){
                    const { x, y } = e.target.getStage().getRelativePointerPosition();
                    const id = uuidv4();
                    setNewRectangle([{ x, y, width: 0, height: 0, stroke: props.color, strokeWidth: 2, id: id }]);
                }
            }
        }
    };
    
    const handleMouseUp = e => {
        if (props.edit){
            if (newRectangle.length === 1) {
                const sx = newRectangle[0].x;
                const sy = newRectangle[0].y;
                const { x, y } = e.target.getStage().getRelativePointerPosition();
                const id = uuidv4();
                const rectangleToAdd = {
                x: sx,
                y: sy,
                width: x - sx,
                height: y - sy,
                id: id, 
                stroke: props.color, 
                strokeWidth: 2
                };
                if (rectangleToAdd.width===0 || rectangleToAdd.height===0){
                    setNewRectangle([]);
                }else{
                    let newRectList = [...props.displayRectangles, rectangleToAdd];
                    setNewRectangle([]);
                    props.setDisplayRectangles(newRectList)
                }
            }
        }
    };
    
    const handleMouseMove = e => {
        if (props.edit){
            if (newRectangle.length === 1) {
                const sx = newRectangle[0].x;
                const sy = newRectangle[0].y;
                const { x, y } = e.target.getStage().getRelativePointerPosition();
                const id = uuidv4();
                setNewRectangle([
                {
                    x: sx,
                    y: sy,
                    width: x - sx,
                    height: y - sy,
                    id: id, 
                    stroke: props.color, 
                    strokeWidth: 2
                }
                ]);
            }
        }
    };

    const handleMouseEnter = e => {
        e.target.getStage().container().style.cursor = "crosshair";
    };

    const handleKeyDown = e => {
        // Xoá bounding box khi ấn delete/backspace
        if (props.edit){
            if (e.keyCode === 8 || e.keyCode === 46) {
                if (selectedId !== null) {
                const newRectangles = props.displayRectangles.filter(
                    rectangle => rectangle.id !== selectedId
                );
                props.setDisplayRectangles(newRectangles);
                }
            }
        }
    };

    const rectangleToDraw = [...props.displayRectangles, ...newRectangle];

    return (
        <div className='page-canvas'>
            <div className='config-button'>
                    <button
                    title="Phóng to" 
                    onClick={() => {
                        setStageScale(stageScale*SCALEBY);
                        let newCanvasMeasures = {width: canvasMeasures.width*SCALEBY, height: canvasMeasures.height*SCALEBY}
                        setCanvasMeasures(newCanvasMeasures)
                    }}>
                        <BiZoomIn/>
                    </button>
                    <button
                    title="Thu nhỏ" 
                    onClick={() => {
                        setStageScale(stageScale/SCALEBY)
                        let newCanvasMeasures = {width: canvasMeasures.width/SCALEBY, height: canvasMeasures.height/SCALEBY}
                        setCanvasMeasures(newCanvasMeasures)
                    }}>
                        <BiZoomOut/>
                    </button>
                    <button title="Lưu thay đổi" onClick={props.saveBoundingBox} style={{display: props.edit?"flex":"none"}}>
                        <BiSave/>
                    </button>
            </div>
            <div className='canvas' tabIndex={1} onKeyDown={handleKeyDown} ref={divCanvas}>
                <Stage 
                    scaleX={stageScale}
                    scaleY={stageScale}
                    width={canvasMeasures.width} 
                    height={canvasMeasures.height} 
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                >
                    <Layer>
                        <PageImage
                            setCanvasMeasures={setCanvasMeasures}
                            setOriginalMeasures={setOriginalMeasures}
                            divCanvasWidth={divCanvasWidth}
                            setStageScale={setStageScale}
                            imageUrl={props.imageUrl}
                            onMouseDown={() => {
                                // deselect when clicked on empty area
                                selectShape(null);
                            }}
                        />
                        {rectangleToDraw.map((rect, i) => {
                            // Loại bỏ sentenceId
                            let sentenceId = rect.sentenceId;
                            let rectCopy = JSON.parse(JSON.stringify(rect))
                            delete rectCopy.sentenceId 
                            return (
                                <Rectangle
                                key={i}
                                sentenceId = {sentenceId}
                                shapeProps={rectCopy}
                                isSelected={rect.id === selectedId}
                                onSelect={() => {
                                    selectShape(rect.id);
                                }}
                                onChange={(newAttrs) => {
                                    const rects = props.displayRectangles.slice();
                                    let temp = newAttrs
                                    temp.sentenceId = sentenceId;
                                    rects[i] = newAttrs;
                                    props.setDisplayRectangles(rects);
                                }}
                                canvasMeasures = {canvasMeasures}
                                originalMeasures={originalMeasures}
                                edit={props.edit}
                                />
                            );
                        })}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
}

export default PageCanvas