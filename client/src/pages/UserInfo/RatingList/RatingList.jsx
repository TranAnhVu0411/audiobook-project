import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
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
                    <Fragment key={rating._id}>
                        <div className='rating-item'>
                            <div className='rating-book-info'>
                                <Link className='rating-link' to={`/book/info/${rating.book._id}`}>
                                    <img src={rating.book.image}/>
                                </Link>
                                <Link className='rating-link' to={`/book/info/${rating.book._id}`}>
                                    <h4>{rating.book.title}</h4>
                                </Link>
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
                    </Fragment>
                ))}
            </>)
            }
        </div>
    )
}

export default RatingList;