import React from "react";
import ReactLoading from "react-loading";
import "./style.scss";

const LoadingScreen = () => {
    return (
        <div className="loading-screen">
            <ReactLoading type="bars" color="#BEBEBE"
                height={200} width={100} />
            <span>Đang tải dữ liệu, xin vui lòng đợi trong giây lát</span>
        </div>
    )
}

export default LoadingScreen