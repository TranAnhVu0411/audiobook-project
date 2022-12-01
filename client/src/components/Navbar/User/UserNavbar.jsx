import React, {useEffect, useState} from "react";
import { Link, useLocation } from "react-router-dom";
import {MdOutlineHome, MdOutlineCategory, MdSearch} from "react-icons/md"
import {GoTriangleDown, GoTriangleUp} from 'react-icons/go'
import "./style.scss";

const UserNavbar = (props) => {
    // Phục vụ cho menu category
    const [openCat, setOpenCat] = useState(false);
    const location = useLocation()

    useEffect(() => {
        setOpenCat(false);
    }, [location])

    // Trạng thái click (Khi màn hình nhỏ hơn 992)
    const handleClickCat = () => {
        if (props.width>992){
            return null
        }else{
            setOpenCat(!openCat)
        }
    }

    // Trạng thái hover (Khi màn hình lón hơn 992)
    const handleMouseOverCat = () => {
        if (props.width>992){
            setOpenCat(true)
        }else{
            return null
        }
    }
    const handleMouseOutCat = () => {
        if (props.width>992){
            setOpenCat(false)
        }else{
            return null
        }
    }

    let viewCatMode = {}
    if(openCat){
        viewCatMode.display = "grid"
        viewCatMode.gridTemplateColumns = 'auto auto auto';
        viewCatMode.gap = 30;
    }else{
        viewCatMode.display = "none"
    }

    // Chỉnh icon khi ấn vào category
    const handleIconCategory = () => {
        if(openCat){
            return <GoTriangleUp className="icon triangle"/>
        }else{
            return <GoTriangleDown className="icon triangle"/>
        }
    }

    return (
        <div className='user-nav'>
            <Link className="nav-link" to="/">
                <MdOutlineHome className="icon"/>
                <h6>Trang chủ</h6>
            </Link>
            <div className="category">
                <button className="nav-link" onClick={handleClickCat} onMouseOver={handleMouseOverCat} onMouseOut={handleMouseOutCat}>
                    <MdOutlineCategory className="icon"/>
                    <h6>Thể loại</h6>
                    {
                        handleIconCategory()
                    }
                </button>
                <div className="category-content" style={viewCatMode} onMouseOver={handleMouseOverCat} onMouseOut={handleMouseOutCat}>
                    <Link className="nav-link" to="/book/category/kinh_doanh">Kinh doanh</Link>
                    <Link className="nav-link" to="/book/category/ky_nang_song">Kỹ năng sống</Link>
                    <Link className="nav-link" to="/book/category/tai_chinh">Tài chính</Link>
                    <Link className="nav-link" to="/book/category/marketing">Marketing</Link>
                    <Link className="nav-link" to="/book/category/ton_giao">Tôn giáo</Link>
                    <Link className="nav-link" to="/book/category/tam_ly">Tâm lý</Link>
                    <Link className="nav-link" to="/book/category/song_khoe">Sống khoẻ</Link>
                    <Link className="nav-link" to="/book/category/hanh_phuc">Hạnh phúc</Link>
                    <Link className="nav-link" to="/book/category/tieu_thuyet">Tiểu thuyết</Link>
                    <Link className="nav-link" to="/book/category/thieu_nhi">Thiếu nhi</Link>
                </div>
            </div>
            <Link className="nav-link" to="/book/advance-search">
                <MdSearch className="icon"/>
                <h6>Tìm kiếm</h6>
            </Link>
        </div>
    )
}

export default UserNavbar;