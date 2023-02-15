import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
import {getBackgroundColor, getBorderColor} from '../../../util/category-color'; 
import { getRole } from "../../../context/role";
import {v4 as uuidv4} from "uuid";

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

const FavouriteList = (props) => {
    return (
        <div className='favourite-list'>
            {props.favourites.length===0?
            (<>
                <span className='empty-notify'>Không có sách yêu thích</span>
            </>):
            (<>
                {props.favourites.map(favourite => (
                    <Fragment key={favourite._id}>
                        <div className='favourite-item'>
                            <div className='favourite-book-info'>
                                <Link className='favourite-link' to={`/book/info/${favourite.book._id}`}>
                                    <img src={favourite.book.image} alt="PreviewImage"/>
                                </Link>
                                <Link className='favourite-link' to={`/book/info/${favourite.book._id}`}>
                                    <h4>{favourite.book.title}</h4>
                                </Link>
                            </div>
                            <div className='favourite-book-other-info'>
                                <div className="multiple-info">
                                    <span>Tác giả:</span>
                                    <div className="info-list">
                                        {
                                            favourite.book.authors.map((author) => {
                                                return <div key={uuidv4()} className='info-item' style={{backgroundColor: '#ECECEC', border: "1px solid #D4D4D4"}} >{author}</div>
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="multiple-info">
                                    <span>Thể loại:</span>
                                    <div className="info-list">
                                        {favourite.book.categories.map((category) => {
                                            return(
                                            <Link 
                                                key={uuidv4()} 
                                                className='info-link' 
                                                to={(getRole(props.currentUser) !== "admin")?`/book/category/${cat2url[category]}`:`/booklist?cat=${cat2url[category]}`}
                                            >
                                                <div 
                                                    className='info-item' 
                                                    style={{backgroundColor: getBackgroundColor(category), border: "1px solid " + getBorderColor(category)}}
                                                >
                                                    {category}
                                                </div>
                                            </Link>)
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                ))}
            </>)
            }
        </div>
    )
}

export default FavouriteList;