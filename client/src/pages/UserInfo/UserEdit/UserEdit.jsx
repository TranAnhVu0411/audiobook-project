import React, {useEffect, useState} from 'react';
import {AiFillEdit, AiFillDelete} from 'react-icons/ai';
import noUser from '../../../image/noUser.png';
import {main_axios_instance} from '../../../service/custom-axios';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './style.scss';

const UserEdit = (props) => {
    const [avatar, setAvatar] = useState(props.avatar)
    const [username, setUsername] = useState(props.username)

    const [noimage, setNoImage] = useState(null) // Lưu file object ảnh trống
    useEffect(() =>{
        fetch(noUser).then(async response => {
            const contentType = response.headers.get('content-type')
            const blob = await response.blob()
            const file = new File([blob], 'temp.png', { contentType })
            setNoImage(file)
        })
    }, [])

    const handlePreviewImage = e => {
        if (e.target.name === 'image'){
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    }

    const handleDeleteImage = e => {
        setAvatar({
            file: null,
            url: noUser
        })
    }

    const handleSubmit = async e => {
        props.setIsUpload(false)
        e.preventDefault();
        try{
            let userForm = new FormData();
            userForm.append('username', username)
            userForm.append('image', avatar.file?avatar.file:noimage)
            console.log(userForm);
            const res = await main_axios_instance.put(`/user/update/${props.userId}`, userForm);
            props.setIsUpload(true)
            console.log(res);
            props.onClose()
            toast.success("Cập nhật thông tin tài khoản thành công", {position: toast.POSITION.TOP_CENTER});
        }catch(err){
            props.setIsUpload(true)
            console.log(err)
            toast.error("Xuất hiện lỗi phát sinh khi cập nhật thông tin tài khoản", {position: toast.POSITION.TOP_CENTER});
        }
    }
    return (
        <div className='user-edit'>
            <div className='user-edit-form'>
                <h2>Cập nhật thông tin</h2>
                <div className='user-form-input'>
                    <div className="user-image-input">
                        <input type="file" name="image" id="image" accept="image/png, image/jpg, image/jpeg" onChange={handlePreviewImage} style={{display: "none"}}/>
                        <img alt="preview" src={avatar.url} />
                        <label htmlFor="image">
                            <AiFillEdit />
                        </label>
                        <button onClick={handleDeleteImage}>
                            <AiFillDelete />
                        </button>
                    </div>
                    <div className='user-name-input'>
                        <label>Username:</label>
                        <input type='text' value={username} onChange = {e => setUsername(e.target.value)}/>
                    </div>
                </div>
                <div className='user-edit-button'>
                    <button onClick={props.onClose} className="cancel">Huỷ</button>
                    <button onClick={handleSubmit} className='update'>Cập nhật</button>
                </div>
            </div>
        </div>
    )
}

export default UserEdit;