import React from 'react';
import { BsPeopleFill, BsFillStarFill } from 'react-icons/bs'
import "./style.scss";

const RatingStat = (props) => {
    const ratingData = [
        {star: 5, avg: props.bookRating.ratingStat["5"], color: '#f1d045'},
        {star: 4, avg: props.bookRating.ratingStat["4"], color: '#f1b345'},
        {star: 3, avg: props.bookRating.ratingStat["3"], color: '#f1a545'},
        {star: 2, avg: props.bookRating.ratingStat["2"], color: '#f19745'},
        {star: 1, avg: props.bookRating.ratingStat["1"], color: '#f17a45'},
    ]
    return (
        <div className="rating-stat">
            <div className='rating-avg-section'>
                <BsFillStarFill className='star-icon rating-avg-section-star-icon' />
                <div className='rating-avg'>
                    <div className='avg-rating'>
                        <span>{props.bookRating.avgRating}</span>
                        <span>/</span>
                        <span>5</span>
                    </div>
                    <div className='total-rating'>
                        <BsPeopleFill />
                        <span>{props.bookRating.totalRating}</span>
                    </div>
                </div>
            </div>
            <div className="rating-stat-section">
                {ratingData.map(data => {
                    return (
                        <div key={data.star}className='rating-stat-component'>
                            <div className='rating-component-header'>
                                <BsFillStarFill className='star-icon'/>
                                <span>{data.star}</span>
                            </div>
                            <div className='rating-container'>
                                <div className='rating-filler' style={{width: `${data.avg}%`, backgroundColor: data.color}}>
                                    <span>
                                        &nbsp;
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
               </div>
        </div>
    )
}

export default RatingStat;