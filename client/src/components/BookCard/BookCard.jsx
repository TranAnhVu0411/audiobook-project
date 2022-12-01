import React, {useState, useEffect, useContext} from 'react';
import {Link, useNavigate, useLocation} from "react-router-dom"
import './style.scss';
import {getBackgroundColor, getBorderColor} from '../../util/category-color' 
import {v4 as uuidv4} from "uuid";
import { AuthContext } from "../../context/AuthContextProvider";
import { AiOutlineHeart, AiOutlineFileAdd, AiFillStar, AiOutlineComment } from "react-icons/ai"
import ReactTooltip from 'react-tooltip';
import { getRole } from '../../context/role';
import {main_axios_instance} from '../../service/custom-axios';

const cat2url = {
    'Kinh doanh': 'kinh_doanh',
    'Kỹ năng sống': 'ky_nang_song',
    'Tài chính': 'tai_chinh',
    'Marketing': 'marketing',
    'Tôn giáo': 'ton_giao',
    'Tâm lý': 'tam_ly',
    'Hạnh phúc': 'hanh_phuc',
    'Sống khoẻ': 'song_khoe',
    'Thiếu nhi': 'thieu_nhi',
    'Tiểu thuyết': 'tieu_thuyet'
};

const BookCard = (props) => {
    // Kiểm tra người dùng là user hay admin
    const { currentUser } = useContext(AuthContext);
    
    const [totalComment, setTotalComment] = useState(0)
    const [avgRating, setAvgRating] = useState(0)

    const navigate = useNavigate()
    const getWindowWidth = () => {
        const {innerWidth: width} = window;
        return width;
    }
    const [width, setWidth] = useState(getWindowWidth);
    useEffect(() => {
        function handleResize() {
          setWidth(getWindowWidth());
        }
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    useEffect(() => {
        const fetchData = async() => {
            try{
                const commentRes = await main_axios_instance.get(`/comment/book/total/${props.book._id}`)
                setTotalComment(commentRes.data)
                const ratingRes = await main_axios_instance.get(`/rating/book/${props.book._id}`)
                setAvgRating(ratingRes.data.avgRating)
            }
            catch(err){
                console.log(err);
            }
        }
        fetchData()
    }, [props.book._id])
    let viewMode = {}
    let location = useLocation();
    if (getRole(currentUser) !== 'admin'){
        if (location.pathname.split("/").includes('book') || location.pathname.split("/").includes('booklist')){
            // Nếu không phải là home page => set width như dưới
            if (width >= 768){
                viewMode.width=200;
            }else{
                viewMode.width=150;
            }
        }else{
            // Nếu là home page => set width như dưới
            viewMode.width='auto';
        }
    }else{
        if (width >= 768){
            viewMode.width=200;
        }else{
            viewMode.width=150;
        }
    }
    return (
        <div className="book-card" style={viewMode}> 
            <Link className='book-image' to={`/book/info/${props.book._id}`}>
                <img 
                    src={props.book.image} 
                    alt='book cover'
                />
                <div className='stat-info'>
                    <span>
                        <AiFillStar/>
                        {avgRating}
                    </span>
                    <span>
                        <AiOutlineComment/>
                        {totalComment}
                    </span>
                </div>
            </Link>
            <div className="title-info">
                {props.book.title}
            </div>
            <div className="multiple-info">
                <div className="info-name">Thể loại</div>
                <div className="info-list">
                    {
                        props.book.categories.map((category) => {
                            if (getRole(currentUser) !== "admin"){
                                return <Link key={uuidv4()} className='info-link' to={`/book/category/${cat2url[category]}`}>
                                        <div className='info-item' style={{backgroundColor: getBackgroundColor(category), border: "1px solid " + getBorderColor(category)}}>
                                            {category}
                                        </div>
                                    </Link>
                            }else{
                                return <div key={uuidv4()} className='info-item' style={{backgroundColor: getBackgroundColor(category), border: "1px solid " + getBorderColor(category)}}>
                                            {category}
                                        </div>
                            }
                        })
                    }
                </div>
            </div>
            <div className="multiple-info">
                <div className="info-name">Tác giả: </div>
                <div className="info-list">
                    {
                        props.book.authors.map((author) => {
                            return <div key={uuidv4()} className='info-item' style={{backgroundColor: '#ECECEC', border: "1px solid #D4D4D4"}} >{author}</div>
                        })
                    }
                </div>
            </div>
            <div className='book-card-button'>
                {getRole(currentUser) === 'guest' ? (
                    <>
                        <button data-tip data-for="bookcard-tooltip" onClick = {() => navigate('/login')}>
                            <AiOutlineHeart/>
                        </button>
                        <ReactTooltip id='bookcard-tooltip' effect="solid">
                            <span>Bạn phải đăng nhập để có thể sử dụng chức năng này</span>
                        </ReactTooltip>
                    </>
                ) : (
                    <button>
                        {getRole(currentUser)!=='admin' ? <AiOutlineHeart/> : <AiOutlineFileAdd/>}
                    </button>
                )}    
                
            </div>
        </div>
    )
}

export default BookCard;