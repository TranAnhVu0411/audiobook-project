import React, {useState, useEffect} from "react";
import { Link, useLocation } from "react-router-dom";
import {MdMenuBook, MdOutlineSupervisedUserCircle, MdOutlineSpaceDashboard} from "react-icons/md"
import {GoTriangleDown, GoTriangleUp} from 'react-icons/go'
import {GiBookshelf} from 'react-icons/gi'
import {BiBookAdd} from 'react-icons/bi'
import "./style.scss";
const AdminNavbar = (props) => {
    // Phục vụ cho menu quản lý sách
    const [openBM, setOpenBM] = useState(false);
    const location = useLocation()

    useEffect(() => {
        setOpenBM(false);
    }, [location])

    // Trạng thái click (Khi màn hình nhỏ hơn 992)
    const handleClickBM = () => {
        if (props.width>992){
            return null
        }else{
            setOpenBM(!openBM)
        }
    }

    // Trạng thái hover (Khi màn hình lón hơn 992)
    const handleMouseOverBM = () => {
        if (props.width>992){
            setOpenBM(true)
        }else{
            return null
        }
    }
    const handleMouseOutBM = () => {
        if (props.width>992){
            setOpenBM(false)
        }else{
            return null
        }
    }

    let viewBMMode = {}
    if(openBM){
        viewBMMode.display = "flex"
        viewBMMode.gap = 30;
        if (props.width > 992){
            viewBMMode.flexDirection = "column"
        }else{
            viewBMMode.flexDirection = "row"
        }
    }else{
        viewBMMode.display = "none"
    }

    // Chỉnh icon khi ấn vào Quản lý sách 
    const handleIconBM = () => {
        if(openBM){
            return <GoTriangleUp className="icon triangle"/>
        }else{
            return <GoTriangleDown className="icon triangle"/>
        }
    }

    return (
        <div className='admin-nav'>
            <Link className="nav-link" to="/dashboard">
                <MdOutlineSpaceDashboard className="icon"/>
                <h6>Dashboard</h6>
            </Link>
            <div className="book-management">
                <button className="nav-link" onClick={handleClickBM} onMouseOver={handleMouseOverBM} onMouseOut={handleMouseOutBM}>
                    <MdMenuBook className="icon"/>
                    <h6>Quản lý sách</h6>
                    {
                        handleIconBM()
                    }
                </button>
                <div className="book-management-content" style={viewBMMode} onMouseOver={handleMouseOverBM} onMouseOut={handleMouseOutBM}>
                    <Link className="book-management-link" to = '/booklist'>
                        <GiBookshelf className='icon' /> 
                        <span>Danh sách sách</span>
                    </Link>
                    <Link className="book-management-link" to = '/book/new'>
                        <BiBookAdd className='icon' />
                        <span>Thêm sách mới</span>
                    </Link>
                </div>
            </div>
            <Link className="nav-link" to="#">
                <MdOutlineSupervisedUserCircle className="icon"/>
                <h6>Quản lý tài khoản</h6>
            </Link>
        </div>
    )
}

export default AdminNavbar;