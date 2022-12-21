import React, {useEffect, useState} from "react";
// import { AiOutlineEdit, AiOutlineSave, AiOutlineClose } from "react-icons/ai"
// import {pdf_axios_instance} from '../../../service/custom-axios';
import './style.scss';
// import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PageList from "./PageList/PageList";
import PageWrite from "./PageWrite/PageWrite"
import ImageViewer from "react-simple-image-viewer";

const ChapterPagesEdit = (props) => {
    const [pageList, setPageList] = useState([]) // Page List chỉnh sửa
    const [deletePageList, setDeletePageList] = useState([]) // Danh sách các Page sẽ bị xoá

    useEffect(() => {
        setPageList(props.chapterPages)
    }, [props.chapterPages]) 

    // Xoá ảnh
    const deletePage = (id) => {
        let p = pageList.filter(page => (page.id === id))[0]
        setDeletePageList(previousList => [...previousList, p])
        setPageList([
            ...pageList.filter(page => {
              return page.id !== id;
            }),
          ]);
    };

    // Preview 
    const [clickImg, setClickImg] = useState(null)
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const openImageViewer = (id) => {
        let p = pageList.filter(page => (page.id === id))[0]
        setClickImg(p.url);
        setIsViewerOpen(true);
      }

    const closeImageViewer = () => {
        setClickImg(null);
        setIsViewerOpen(false);
    };

    // Reorder vị trí ảnh
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = (fromIndex, toIndex) => {
        /* IGNORES DRAG IF OUTSIDE DESIGNATED AREA */
        if (toIndex < 0) return;
    
        const list = reorder(pageList, fromIndex, toIndex);
        return setPageList(list);
    };

    const handleReset = () => {
        setPageList(props.chapterPages)
        setDeletePageList([])
    }

    return (
        <div className="chapter-pages-edit">
            <div className='chapter-pages-edit-header'>
                <h2>Danh sách trang</h2>
                <button onClick={handleReset}>
                    Hoàn tác
                </button>
                <button onClick={() => props.handleChapterPages(pageList, deletePageList)}>
                    Lưu thay đổi
                </button>
            </div>
            <PageList pageList={pageList} deletePage={deletePage} openImageViewer={openImageViewer} onDragEnd={onDragEnd}/>
            <PageWrite handlePageImageWrite={props.handlePageImageWrite}/>
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

export default ChapterPagesEdit;