import React, {useContext, useState} from "react"
import {useNavigate} from 'react-router-dom'
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContextProvider";
import './style.scss'

const Login = () => {
    const navigate = useNavigate()
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        remember: true
    });
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await login(inputs)
          console.log(res)
          if (res.data.info.role==='user'){
            navigate('/')
          }else{
            navigate('/dashboard')
          }
        } catch (err) {
            console.log(err)
        }
    };

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRemember = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
    }
    
    return (
        <div className="login">
            <div className="form">
                <h1>Đăng nhập</h1>
                <form>
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required/>
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required/>
                    <div className="remember">
                        <input type="checkbox" name="remember" checked={inputs.remember} onChange={handleRemember} />
                        <label>Remember me</label>
                    </div>
                    <button onClick={handleSubmit}>Đăng nhập</button>
                    <span>Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Login