import React, { useContext } from 'react';
import { AuthContext } from "../../../context/AuthContextProvider";
import { getRole } from '../../../context/role';
import ReactTooltip from 'react-tooltip';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import { FaHeadphonesAlt, FaRegEdit } from 'react-icons/fa'

const ListChapter = (props) => {
    const navigate = useNavigate()
    const { currentUser } = useContext(AuthContext);

    const handleButton = () => {
        if (getRole(currentUser)==='guest'){
            return (
                <>
                    <button data-tip data-for="chapter-tooltip" onClick={() => {navigate('/login')}}>
                        <FaHeadphonesAlt/>
                    </button>
                    <ReactTooltip id='chapter-tooltip' effect="solid">
                        <span>Bạn phải đăng nhập để có thể sử dụng chức năng này</span>
                    </ReactTooltip>
                </>
            )
        }else{
            return (
                <button data-tip data-for="chapter-tooltip">
                    {getRole(currentUser)==='admin' ? <FaRegEdit/> : <FaHeadphonesAlt/>}
                </button>
            )
        }
    }
    console.log(props.chapters)

    return (
        <div className="list-chapter">
            <table>
                <thead>
                    <tr>
                        <th style={{width:"15%"}}>Chương số</th>
                        <th style={{width:"70%"}}>Tên chương</th>
                        <th style={{width:"15%"}}>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {props.chapters.map(chapter => {
                        return(
                        <tr key={chapter._id}>
                            <td>{chapter.index}</td>
                            <td>{chapter.name}</td>
                            <td>
                                {handleButton()}
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default ListChapter;