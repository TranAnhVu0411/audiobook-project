import React, {useState, useEffect, useContext} from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../image/logo.png";
import { BsPencilSquare, BsInfoCircle} from 'react-icons/bs'
import { FaList } from "react-icons/fa";
import { MdClose, MdLogin, MdLogout} from "react-icons/md";
import {GoTriangleDown, GoTriangleUp} from 'react-icons/go'
import UserNavbar from "./User/UserNavbar";
import AdminNavbar from "./Admin/AdminNavbar";
import { AuthContext } from "../../context/AuthContextProvider";
import { getRole } from '../../context/role';
import "./style.scss";

const RegsiterLogin = () => {
    return (
        <div className="auth-container">
            <Link className="register-login-link" to="/login">
                <MdLogin className="icon"/>
                <h6>Đăng nhập</h6>
            </Link>
            <Link className="register-login-link" to="/register">
                <BsPencilSquare className="icon"/>
                <h6>Đăng ký</h6>
            </Link>
        </div>
    )
}

const Avatar = (props) => {
    const handleLogout = () => {
        props.logout()
    }
    const [openAvt, setOpenAvt] = useState(false);

    useEffect(() => {
        if (props.width<=992){
            setOpenAvt(true)
        }
    }, [props.width]);

    // Trạng thái hover (Khi màn hình lón hơn 992)
    const handleMouseOverAvt = () => {
        if (props.width>992){
            setOpenAvt(true)
        }else{
            return null
        }
    }
    const handleMouseOutAvt = () => {
        if (props.width>992){
            setOpenAvt(false)
        }else{
            return null
        }
    }

    let viewAvtMode = {}
    if(openAvt){
        viewAvtMode.display = "flex"
        viewAvtMode.gap = 30;
        if (props.width > 992){
            viewAvtMode.flexDirection = "column"
        }else{
            viewAvtMode.flexDirection = "row"
        }
       
    }else{
        viewAvtMode.display = "none"
    }
    const handleIconAvatar = () => {
        if(openAvt){
            return <GoTriangleUp className="icon triangle"/>
        }else{
            return <GoTriangleDown className="icon triangle"/>
        }
    }
    return (
        <div className="auth-container">
            <button onMouseOver={handleMouseOverAvt} onMouseOut={handleMouseOutAvt}>
                <img 
                    alt="preview" 
                    src={props.currentUser.info.avatar} 
                />
                <h6>{props.currentUser.info.username}</h6>
                {
                    handleIconAvatar()
                }
            </button>
            <div className='avatar-content' style={viewAvtMode} onMouseOver={handleMouseOverAvt} onMouseOut={handleMouseOutAvt}>
                <Link className="avatar-link" to = {`/user/${props.currentUser.info._id}`}>
                    <BsInfoCircle className="icon"/> 
                    <span>Thông tin</span>
                </Link>
                <Link className="avatar-link" onClick={handleLogout} to = '/'>
                    <MdLogout className="icon"/> 
                    <span>Đăng xuất</span>
                </Link>
            </div>
        </div>
    )
}

const Navbar = () => {
    const [openNav, setOpenNav] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setOpenNav(false);
    },[location])

    const handleToggleNav = () => {
        setOpenNav(!openNav)
    }
    // Chỉnh icon khi ấn vào menu (Khi màn hình nhỏ)
    const handleIconMenu = () => {
        if(openNav){
            return <MdClose/>
        }else{
            return <FaList/>
        }
    }

    // Phục vụ cho navbar (Khi thu nhỏ màn hình)
    const getWindowWidth = () => {
        const {innerWidth: width} = window;
        return width;
    }
    const [width, setWidth] = useState(getWindowWidth)
    useEffect(() => {
        function handleResize() {
          setWidth(getWindowWidth());
        }
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    let viewNavMode = {}
    if (width > 992){
        viewNavMode.display="flex"
    }else{
        if (openNav) {
            viewNavMode.display = "flex"
        } else {
            viewNavMode.display = "none"
        }
    }

    const { currentUser, logout } = useContext(AuthContext);
    const isLogin = () => {
        if (currentUser){
            return <Avatar currentUser = {currentUser} logout={logout} width={width}/>
        }else{
            return <RegsiterLogin />
        }
    }

    const isAdmin = () => {
        if (getRole(currentUser) === 'admin'){
            return <AdminNavbar width = {width} />
        }else{
            return <UserNavbar width = {width}/>
        }
    }

    return (
        <div className="navbar">
            <div className='container'>
                <div className='button-container'>
                    <div className='logo'>
                        <img src={Logo} alt='' />
                        <h1>Sách Nói Online</h1>
                    </div>
                    <button className="nav-button" onClick={handleToggleNav}>
                        {handleIconMenu()}
                    </button>
                </div>
                <div className='nav-container' style={viewNavMode}>
                    {isLogin()}
                    {isAdmin()}
                </div>
            </div>
        </div>
    )
}

export default Navbar;