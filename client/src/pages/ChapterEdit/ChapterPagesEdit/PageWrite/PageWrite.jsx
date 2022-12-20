import React, {useState} from 'react';
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './style.scss'
import PageImageWrite from './PageImageWrite/PageImageWrite'
import PagePDFWrite from './PagePDFWrite/PagePDFWrite'

const PageWrite = (props) => {
    // Nút thu gọn thanh tìm kiếm
    const [open, setOpen] = useState({
        state: true,
        icon: <GoTriangleUp/>
    })
    const handleToogleSearch = () => {
        if(open.state){
            setOpen({
                state: false,
                icon: <GoTriangleDown/>

            })
        }else{
            setOpen({
                state: true,
                icon: <GoTriangleUp/>
            })
        }
    }
    let viewMode = {}
    if(open.state){
        viewMode.display = "flex"
        viewMode.alignSelf = "center" 
    }else{
        viewMode.display = "none"
    }

    return (
        <div className='page-write'>
            <div className='expand-button'>
                <button onClick={handleToogleSearch}>
                    <span>Thêm trang</span>
                    {open.icon}
                </button>
                <small>* Trang được lưu sẽ nằm ở vị trí cuối cùng của chương</small>
            </div>
            <div style={viewMode}>
                <Tabs>
                    <TabList>
                        <Tab>Thêm theo ảnh</Tab>
                        <Tab>Thêm theo PDF</Tab>
                    </TabList>

                    <TabPanel>
                        <PageImageWrite />
                    </TabPanel>
                    <TabPanel>
                        <PagePDFWrite />
                    </TabPanel>
                </Tabs>
            </div>
        </div>
        

    )
}

export default PageWrite;