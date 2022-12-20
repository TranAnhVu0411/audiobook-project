import React, { useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import {v4 as uuidv4} from "uuid";
import { BsZoomIn, BsZoomOut, BsArrowClockwise } from "react-icons/bs"
import './style.scss'
import Rectangle from './Rectangle';
import PageImage from './PageImage';

const SCALEBY = 1.02

const PageCanvas = (props) => {
    // Các bounding box được khởi tạo trước
    const [rectangles, setRectangles] = React.useState(props.initialRectangles);
    useEffect(() => {
        setRectangles(props.initialRectangles)
        setNewRectangle([])
    }, [props.initialRectangles])
    
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
    const [stageScale, setStageScale] = useState(1.)

    // Sử dụng để vẽ hình mới
    const [newRectangle, setNewRectangle] = useState([]);

    const handleMouseDown = e => {
        if (props.edit){
            if (e.target.constructor.name === 'Image'){
                if (selectedId === null && newRectangle.length === 0){
                    const { x, y } = e.target.getStage().getRelativePointerPosition();
                    const id = uuidv4();
                    setNewRectangle([{ x, y, width: 0, height: 0, stroke: 'blue', strokeWidth: 2, id: id }]);
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
                stroke: 'blue', 
                strokeWidth: 2
                };
                if (rectangleToAdd.width===0 || rectangleToAdd.height===0){
                    setNewRectangle([]);
                }else{
                    rectangles.push(rectangleToAdd);
                    setNewRectangle([]);
                    setRectangles(rectangles);
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
                    stroke: 'blue', 
                    strokeWidth: 2
                }
                ]);
            }
        }
    };

    const handleMouseEnter = e => {
        if (props.edit){
            e.target.getStage().container().style.cursor = "crosshair";
        }
    };

    const handleKeyDown = e => {
        // Xoá bounding box khi ấn delete/backspace
        if (props.edit){
            if (e.keyCode === 8 || e.keyCode === 46) {
                if (selectedId !== null) {
                const newRectangles = rectangles.filter(
                    rectangle => rectangle.id !== selectedId
                );
                setRectangles(newRectangles);
                }
            }
        }
    };

    const handleRefresh = () => {
        // Các bounding box được khởi tạo trước
        setRectangles(props.initialRectangles);
        setNewRectangle([])
    }
    console.log('edit', props.edit)

    const rectangleToDraw = [...rectangles, ...newRectangle];
    // console.log(rectangleToDraw[0])

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
                        <BsZoomIn/>
                    </button>
                    <button
                    title="Thu nhỏ" 
                    onClick={() => {
                        setStageScale(stageScale/SCALEBY)
                        let newCanvasMeasures = {width: canvasMeasures.width/SCALEBY, height: canvasMeasures.height/SCALEBY}
                        setCanvasMeasures(newCanvasMeasures)
                    }}>
                        <BsZoomOut/>
                    </button>
                    <button title="Reset về trạng thái ban đầu" onClick={handleRefresh}>
                        <BsArrowClockwise/>
                    </button>
            </div>
            <div className='canvas' tabIndex={1} onKeyDown={handleKeyDown}>
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
                                    const rects = rectangles.slice();
                                    let temp = newAttrs
                                    temp.sentenceId = sentenceId;
                                    rects[i] = newAttrs;
                                    setRectangles(rects);
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