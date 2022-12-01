import React from "react"
import Logo from "../../image/logo.png";
import "./style.scss";

const Footer = () => {
    return (
        <footer>
            <img src={Logo} alt="" />
            <span>Made with ❤️ and <b>React.js</b></span>
        </footer>
    )
}

export default Footer