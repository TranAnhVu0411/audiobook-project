import React, {useState, useRef} from 'react';
import ImageViewer from "react-simple-image-viewer";
import { MdDelete, MdPreview } from 'react-icons/md'
import './style.scss';

const PageImageWrite = (props) => {
    const fileInput = useRef(null);
    const [image, setImage] = useState({
        file: null,
        url: null
    });

    const handlePreviewImage = e => {
        if (e.target.name === 'image'){
            setImage({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleDeleteImage = () => {
        fileInput.current.value=null;
        setImage({
            file: null,
            url: null
        })
    };

    // Preview 
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    return (
        <div className='page-image-write'>
            <div className='page-image-write-form'>
                <div className='file-input-header'>
                    <label>Ảnh trang:</label>
                    <div style={{display: image.url===null?"none":"flex"}}>
                        <button className='delete' onClick={handleDeleteImage} title="Xoá ảnh"><MdDelete /></button>
                        <button className='preview' onClick={() => setIsViewerOpen(true)} title="Preview ảnh"><MdPreview/></button> 
                    </div>
                </div>
                <input type="file" name="image" id="image" accept="image/png, image/jpg, image/jpeg" onChange={handlePreviewImage} ref={fileInput}/>
            </div>
            <div className='page-image-write-submit'>
                <button onClick={() => {props.handlePageImageWrite(image.file)}}>
                    Lưu trang
                </button>
            </div>
            {isViewerOpen ? 
                <ImageViewer 
                    src={[image.url]}
                    currentIndex={0}
                    onClose={() => setIsViewerOpen(false)}
                    backgroundStyle={{
                    backgroundColor: "rgba(0,0,0,0.9)"
                    }}
                    closeOnClickOutside={true}
                /> : 
                <></>
            }
        </div>
    )
}

export default PageImageWrite;