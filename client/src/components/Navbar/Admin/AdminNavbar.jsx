import React, {useState, useEffect} from "react";
import { Link, useLocation } from "react-router-dom";
import {MdMenuBook, MdOutlineSupervisedUserCircle, MdSupervisedUserCircle, MdOutlineSpaceDashboard} from "react-icons/md"
import {GoTriangleDown, GoTriangleUp} from 'react-icons/go'
import {GiBookshelf} from 'react-icons/gi'
import {BiBookAdd, BiCommentDetail} from 'react-icons/bi'
import "./style.scss";
const AdminNavbar = (props) => {
    // Phục vụ cho menu quản lý sách
    const [openBM, setOpenBM] = useState(false);
    const [openUM, setOpenUM] = useState(false);
    const location = useLocation()

    useEffect(() => {
        setOpenBM(false);
        setOpenUM(false)
    }, [location])

    // Trạng thái click (Khi màn hình nhỏ hơn 992)
    const handleClick = (type) => {
        if (props.width>992){
            return null
        }else{
            if (type==='book'){
                setOpenBM(!openBM)
            }else{
                setOpenUM(!openUM)
            }
        }
    }

    // Trạng thái hover (Khi màn hình lón hơn 992)
    const handleMouseOver = (type) => {
        if (props.width>992){
            if (type==='book'){
                setOpenBM(true)
            }else{
                setOpenUM(true)
            }
        }else{
            return null
        }
    }
    const handleMouseOut = (type) => {
        if (props.width>992){
            if (type==='book'){
                setOpenBM(false)
            }else{
                setOpenUM(false)
            }
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

    let viewUMMode = {}
    if(openUM){
        viewUMMode.display = "flex"
        viewUMMode.gap = 30;
        if (props.width > 992){
            viewUMMode.flexDirection = "column"
        }else{
            viewUMMode.flexDirection = "row"
        }
    }else{
        viewUMMode.display = "none"
    }

    // Chỉnh icon khi ấn vào Quản lý sách 
    const handleIcon = (open) => {
        if(open){
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
            <div className="dropdown-nav">
                <button 
                    className="nav-link" 
                    onClick={() => handleClick("book")} 
                    onMouseOver={() => handleMouseOver("book")} 
                    onMouseOut={() => handleMouseOut("book")}
                >
                    <MdMenuBook className="icon"/>
                    <h6>Quản lý sách</h6>
                    {
                        handleIcon(openBM)
                    }
                </button>
                <div 
                    className="dropdown-nav-content" 
                    style={viewBMMode} 
                    onMouseOver={() => handleMouseOver("book")} 
                    onMouseOut={() => handleMouseOut("book")}
                >
                    <Link className="dropdown-nav-link" to = '/booklist'>
                        <GiBookshelf className='icon' /> 
                        <span>Danh sách sách</span>
                    </Link>
                    <Link className="dropdown-nav-link" to = '/book/new'>
                        <BiBookAdd className='icon' />
                        <span>Thêm sách mới</span>
                    </Link>
                </div>
            </div>
            <div className="dropdown-nav">
                <button 
                    className="nav-link" 
                    onClick={() => handleClick("user")} 
                    onMouseOver={() => handleMouseOver("user")} 
                    onMouseOut={() => handleMouseOut("user")}
                >
                    <MdOutlineSupervisedUserCircle className="icon"/>
                    <h6>Quản lý tài khoản</h6>
                    {
                        handleIcon(openUM)
                    }
                </button>
                <div 
                    className="dropdown-nav-content" 
                    style={viewUMMode} 
                    onMouseOver={() => handleMouseOver("user")} 
                    onMouseOut={() => handleMouseOut("user")}
                >
                    <Link className="dropdown-nav-link" to = '/userlist'>
                        <MdSupervisedUserCircle className='icon' /> 
                        <span>Quản lý tài khoản</span>
                    </Link>
                    <Link className="dropdown-nav-link" to = '/comment'>
                        <BiCommentDetail className='icon' />
                        <span>Quản lý đánh giá</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AdminNavbar;