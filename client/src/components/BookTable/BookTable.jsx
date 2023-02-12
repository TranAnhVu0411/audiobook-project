import React from 'react';
import BookCard from '../BookCard/BookCard';
import "./style.scss";

const BookTable = (props) => {
    return (
        <div className='book-table'>
            {props.books.map(book => {
                return <BookCard key={book._id} book={book} favouriteList={props.favouriteList} handleFavouriteList={props.handleFavouriteList}/>
            })}
        </div>
    )
}

export default BookTable;