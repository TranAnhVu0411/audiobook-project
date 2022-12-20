import React, { useContext } from "react";
import {useNavigate} from 'react-router-dom'
import error from '../../image/error.png'
import './style.scss';
import { AuthContext } from "../../context/AuthContextProvider";
import { getRole } from "../../context/role";

const Error = () => {
    const {currentUser} = useContext(AuthContext)
    const navigate = useNavigate();
    const handleClick = () => {
        if (getRole(currentUser)==='admin'){
            navigate('/dashboard')
        }else{
            navigate('/')
        }
    }
    return (
        <div className="error">
            <img src={error} alt='Lỗi'/>
            <div className="error-content">
                <div className="error-name">404 Page Not Found</div>
                <div>Xin lỗi! Tôi không tìm thấy nội dung bạn cần</div>
                <div className="home-button">
                    <button onClick={handleClick}>Quay lại trang chủ</button>
                </div>
            </div>
        </div>
    )
}

export default Error;