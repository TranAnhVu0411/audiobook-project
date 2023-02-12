import React from 'react';
import './style.scss';
import { Rating } from 'react-simple-star-rating';

const RatingList = (props) => {
    return (
        <div className='rating-list'>
            {props.ratings.length===0?
            (<>
                <span>Không có rating</span>
            </>):
            (<>
                {props.ratings.map(rating => (
                    <>
                        <div className='rating-item'>
                            <div className='rating-book-info'>
                                <img src={rating.book.image}/>
                                <h4>{rating.book.title}</h4>
                            </div>
                            <div className='rating-info'>
                                <Rating
                                    className="rating-input"
                                    initialValue={rating.rating}
                                    readonly = {true}
                                    allowHover = {false}
                                />
                            </div>
                        </div>
                    </>
                ))}
            </>)
            }
        </div>
    )
}

export default RatingList;