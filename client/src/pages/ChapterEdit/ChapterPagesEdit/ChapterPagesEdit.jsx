import React, {useEffect, useState} from "react";
import './style.scss';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PageList from "./PageList/PageList";
import ImageViewer from "react-simple-image-viewer";
import PageImageWrite from './PageImageWrite/PageImageWrite'
import PagePDFWrite from './PagePDFWrite/PagePDFWrite'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

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
            <div className='chapter-pages-list'>
                <div className="chapter-pages-list-header">
                    <h2>Danh sách trang</h2>
                    <button onClick={handleReset}>
                        Hoàn tác
                    </button>
                    <button onClick={() => props.handleChapterPages(pageList, deletePageList)}>
                        Lưu thay đổi
                    </button>
                </div>
                <PageList pageList={pageList} deletePage={deletePage} openImageViewer={openImageViewer} onDragEnd={onDragEnd}/>
            </div>
            <div className='chapter-pages-write'>
                <div className="chapter-pages-write-header">
                    <h2>Thêm trang mới</h2>
                    <small>* Trang được lưu sẽ nằm ở vị trí cuối cùng của chương</small>
                </div>
                <Tabs>
                    <TabList>
                        <Tab>Thêm theo ảnh</Tab>
                        <Tab disabled={!props.bookPdfStatus} onClick={() => {
                            if(!props.bookPdfStatus){
                                toast.warn("Vui lòng upload pdf sách", {position: toast.POSITION.TOP_CENTER})
                            }
                        }}>Thêm theo PDF</Tab>
                    </TabList>
                    <TabPanel>
                        <PageImageWrite handlePageImageWrite={props.handlePageImageWrite}/>
                    </TabPanel>
                    <TabPanel>
                        <PagePDFWrite pdfUrl={props.pdfUrl} numPages={props.numPages} handlePagePdfWrite={props.handlePagePdfWrite}/>
                    </TabPanel>
                </Tabs>
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

export default ChapterPagesEdit;