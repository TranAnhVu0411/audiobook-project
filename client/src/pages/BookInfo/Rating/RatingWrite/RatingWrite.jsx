import React, { useState, useContext} from 'react';
import {main_axios_instance} from '../../../../service/custom-axios';
import { AuthContext } from "../../../../context/AuthContextProvider";
import { getRole } from '../../../../context/role';
import { Rating } from 'react-simple-star-rating'
import ReactTooltip from 'react-tooltip';
import { useNavigate } from 'react-router-dom';

const RatingWrite = (props) => {
    const [rating, setRating] = useState(props.userRating.length===0 ? 0 : props.userRating[0].rating)
    const navigate = useNavigate()
    const { currentUser } = useContext(AuthContext);
    const handleRating = async(rate) => {
        setRating(rate)
        try{
            if (props.userRating.length === 0){
                const res = await main_axios_instance.post('/rating/create', {
                    bookId: props.book._id, 
                    userId: currentUser.info._id,
                    rating: rate
                })
                console.log(res)
                props.handleRatingChange();
            }else{
                const res = await main_axios_instance.put(`/rating/update/${props.userRating[0]._id}`, {
                    rating: rate
                })
                console.log(res)
                props.handleRatingChange();
            }
        }catch(err){
            console.log(err)
        }
    }

    return (
        <div className="rating-write">
            {getRole(currentUser) === 'guest' ? (
                    <>
                        <div data-tip data-for="rating-tooltip" onClick={() => {navigate('/login')}}>
                            <Rating
                                className="rating-input"
                                initialValue={rating}
                                readonly = {true}
                            />
                        </div>
                        <ReactTooltip id='rating-tooltip' effect="solid">
                            <span>Bạn phải đăng nhập để có thể sử dụng chức năng này</span>
                        </ReactTooltip>
                    </>
                ) : (
                    <Rating
                        className="rating-input"
                        initialValue={rating}
                        onClick={handleRating}
                    />
                )}   
        </div>
    )
}

export default RatingWrite;