import React, {useState, useRef} from 'react';
import ImageViewer from "react-simple-image-viewer";
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

    const handleDeleteImage = e => {
        fileInput.current.value=null;
        setImage({
            file: null,
            url: null
        })
        
    };

    // Preview 
    const [clickImg, setClickImg] = useState(null)
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const openImageViewer = () => {
        setClickImg(image.url);
        setIsViewerOpen(true);
    }

    const closeImageViewer = () => {
        setClickImg(null);
        setIsViewerOpen(false);
    };

    return (
        <div className='page-image-write'>
            <div className='page-image-write-form'>
                <div className='file-input-header'>
                    <label>Ảnh trang:</label>
                    <div style={{display: image.url===null?"none":"flex"}}>
                        <button className='delete' onClick={handleDeleteImage}>Xoá ảnh</button>
                        <button className='preview' onClick={openImageViewer}>Preview Ảnh</button> 
                    </div>
                </div>
                <input type="file" name="image" id="image" accept="image/png, image/jpg, image/jpeg" onChange={handlePreviewImage} ref={fileInput}/>
            </div>
            <div className='page-image-write-submit'>
                <button>
                    Lưu trang
                </button>
            </div>
            {isViewerOpen ? 
                <ImageViewer 
                    src={[clickImg]}
                    currentIndex={0}
                    onClose={closeImageViewer}
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