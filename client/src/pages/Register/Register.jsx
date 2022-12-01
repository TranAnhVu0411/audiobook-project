import React, { useState} from "react"
import { useNavigate } from "react-router-dom"
import noUser from '../../image/noUser.png';
import {BsFillCameraFill, BsTrashFill} from 'react-icons/bs'
import {main_axios_instance} from '../../service/custom-axios';
import './style.scss'
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

const Register = () => {
    const [isUpload, setIsUpload] = useState(true); // Phục vụ cho upload dữ liệu lúc write/update
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        rewritepassword: ""
    })
    const [image, setImage] = useState({
        imageSave: null,
        imageShow: noUser
    });

    const [noimage, setNoImage] = useState(null) // Lưu file object ảnh trống
    fetch(noUser).then(async response => {
        const contentType = response.headers.get('content-type')
        const blob = await response.blob()
        const file = new File([blob], 'temp.png', { contentType })
        setNoImage(file)
    })

    const handleChange = e => {
        setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const handlePreviewImage = e => {
        if (e.target.name === 'image'){
            setImage({
                imageSave: e.target.files[0],
                imageShow: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleDeleteImage = e => {
        setImage({
            imageSave: null,
            imageShow: noUser
        })
    }

    const handleSubmit = async e => {
        setIsUpload(false)
        e.preventDefault();
        try{
            let userForm = new FormData();
            userForm.append('username', inputs.username);
            userForm.append('email', inputs.email);
            userForm.append('password', inputs.password);
            userForm.append('avatar', image.imageSave?image.imageSave:noimage);

            const res = await main_axios_instance.post("/auth/register/", userForm);
            console.log(res)
            if (res && res.data && res.data.accessToken) {
                setIsUpload(true);
                navigate('/login');
            }
        }catch(err){
            console.log(err)
        }
    }
    if(isUpload){
        return(
            <div className="register">
                <div className="form">
                    <h1>Đăng ký</h1>
                    <div className="form-input">
                        <div className="input-image">
                            <input type="file" name="image" id="image" accept="image/png, image/jpg, image/jpeg" onChange={handlePreviewImage} style={{display: "none"}}/>
                            <img alt="preview" src={image.imageShow} />
                            <label htmlFor="image">
                                <BsFillCameraFill />
                            </label>
                            <button onClick={handleDeleteImage}>
                                <BsTrashFill />
                            </button>
                        </div>
                        <div className="input-text">
                            <input required name='username' type="text" placeholder="Username" onChange={handleChange} />
                            <input required name='email' type="email" placeholder="Email" onChange={handleChange} />
                            <input required name='password' type="password" placeholder="Password" onChange={handleChange} />
                            <input required name='rewritepassword' type="password" placeholder="Nhập lại password" onChange={handleChange} />
                            <button onClick={handleSubmit}>Đăng ký</button>
                        </div>
                    </div>
                </div>
            </div>   
        )
    }else{
        <LoadingScreen/>
    }
}

export default Register