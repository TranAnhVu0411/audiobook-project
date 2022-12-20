import React, {useEffect, useState, useContext, useRef} from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import {main_axios_instance, pdf_axios_instance} from '../../service/custom-axios';
import "./style.scss";
import {FaHeadphonesAlt, FaFilePdf} from 'react-icons/fa';
import {getBackgroundColor, getBorderColor} from '../../util/category-color'; 
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import {v4 as uuidv4} from "uuid";
import { AuthContext } from "../../context/AuthContextProvider";
import { getRole } from "../../context/role";
import CommentWrite from "./CommentWrite/CommentWrite";
import CommentList from "./CommentList/CommentList";
import RatingWrite from "./RatingWrite/RatingWrite"
import RatingStat from "./RatingStat/RatingStat";
import ListChapter from "./ListChapter/ListChapter"

const BookInfo = () => {
    const chapterRef = useRef()

    const [book, setBook] = useState({});
    const [comments, setComments] = useState([])
    const [userRating, setUserRating] = useState([]) // Nếu rating tồn tại => update, ngược lại => create
    const [chapters, setChapters] = useState([])
    const [bookRating, setBookRating] = useState(null)
    const [isLoad, setIsLoad] = useState(false);
    
    const location = useLocation();
    const bookId = location.pathname.split("/").at(-1);
    const navigate = useNavigate();

    // Kiểm tra người dùng là user hay admin
    const { currentUser } = useContext(AuthContext);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const bookRes = await main_axios_instance.get(`/book/${bookId}`);
            setBook(bookRes.data);

            const commentRes = await main_axios_instance.get(`/comment/book/${bookId}`)
            setComments(commentRes.data)

            if (getRole(currentUser)!=='guest'){
                const userRatingRes = await main_axios_instance.get(`/rating/book/${bookId}/user/${currentUser.info._id}`)
                setUserRating(userRatingRes.data)
            }else{
                setUserRating([])
            }

            const chaptersRes = await pdf_axios_instance.get(`/books/${bookId}`)
            setChapters(chaptersRes.data)
            
            const bookRatingRes = await main_axios_instance.get(`/rating/book/${bookId}`)
            setBookRating(bookRatingRes.data)
            setIsLoad(true);
          } catch (err) {
            console.log(err);
          }
        };
        fetchData();
    }, [bookId, currentUser]);

    // Xử lý rating (Khi tạo rating mới hoặc update rating)
    const [changeRating, setChangeRating] = useState(false)
    useEffect(() => {
        const fetchUserRatingData = async () => {
            try {
                const userRatingRes = await main_axios_instance.get(`/rating/book/${bookId}/user/${currentUser.info._id}`)
                setUserRating(userRatingRes.data)
            } catch (err) {
              console.log(err);
            }
          };
          const fetchBookRatingData = async () => {
            try{
                const bookRatingRes = await main_axios_instance.get(`/rating/book/${bookId}`)
                setBookRating(bookRatingRes.data)
            }catch (err) {
                console.log(err);
            }
          }
          if (getRole(currentUser)!=='guest'){
            fetchUserRatingData();
          }
          fetchBookRatingData();
          setChangeRating(false)
    }, [changeRating, currentUser, bookId])
    const handleRatingChange = () => {
        setChangeRating(true)
    }

    // Xử lý comment (Khi thêm comment mới hoặc update comment)
    // Cập nhật lại danh sách comment nếu comment thay đổi (Thêm/Edit)
    const [changeComment, setChangeComment] = useState(false)
    useEffect(() => {
        const fetchCommentData = async () => {
            try {
              const commentRes = await main_axios_instance.get(`/comment/book/${bookId}`)
              setComments(commentRes.data)
            } catch (err) {
              console.log(err);
            }
          };
          fetchCommentData();
          setChangeComment(false);
    }, [changeComment, bookId])

    const handleCommentChange = () => {
        setChangeComment(true)
    }

    if (isLoad){
        return(
            <div className="book-info">
                <div className="book-info-header">
                    <img src={book.image} alt="book-cover"/>
                    <div className="book-info">
                        <h1>{book.title}</h1>
                        <div className="multiple-info">
                            <span>Tác giả:</span>
                            <div className="info-list">
                                {
                                    book.authors.map((author) => {
                                        return <div key={uuidv4()} className='info-item' style={{backgroundColor: '#ECECEC', border: "1px solid #D4D4D4"}} >{author}</div>
                                    })
                                }
                            </div>
                        </div>
                        <div className="multiple-info">
                            <span>Thể loại:</span>
                            <div className="info-list">
                                {
                                    book.categories.map((category) => {
                                        return <div key={uuidv4()} className='info-item' style={{backgroundColor: getBackgroundColor(category), border: "1px solid " + getBorderColor(category)}}>{category}</div>
                                    })
                                }
                            </div>
                        </div>
                        <div className="bookinfo-button">
                            {(getRole(currentUser) === "admin") ?
                                (<>
                                    <button onClick = {() => navigate(`/book/info/${book._id}/update`)}>
                                        <span>Chỉnh sửa thông tin sách</span>
                                    </button>
                                    <button onClick={() => chapterRef.current.scrollIntoView({ behavior: 'smooth' })}>
                                        <span>Danh sách chương</span>
                                    </button>
                                    
                                </>) : (<>
                                    <button>
                                        <FaFilePdf className="icon"/> 
                                        <span>Đọc PDF</span>
                                    </button>
                                    <button>
                                        <FaHeadphonesAlt className="icon"/> 
                                        <span>Nghe sách nói</span>
                                    </button>
                                </>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="description">
                    <h2>Mô tả</h2>
                    <hr></hr>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: book.description,
                        }}
                    ></p>  
                </div>
                <div className="chapter" ref={chapterRef}>
                    <h2>Danh sách chương</h2>
                    <ListChapter chapters = {chapters} bookId={bookId} setIsLoad={setIsLoad}/>
                </div>
                <div className="rating">
                    <div className="rating-write-section">
                        <h2>Đánh giá </h2>
                        {getRole(currentUser) === 'admin' ? (<></>):(
                            <RatingWrite book={book} userRating={userRating} handleRatingChange={handleRatingChange}/>
                        )} 
                    </div>
                    <div className="rating-statistic-section">
                        <RatingStat bookRating={bookRating}/>
                    </div>
                </div>
                <div className="comment">
                    <h2>Bình luận</h2>
                    {getRole(currentUser) === 'admin' ? (<></>):(
                        <>
                            <CommentWrite book={book} handleCommentChange={handleCommentChange} />
                            <div className="seperator-comment-section"></div>
                        </>
                    )}
                    <CommentList comments = {comments} handleCommentChange={handleCommentChange} />
                </div>
            </div>
        )   
    }else{
        return <LoadingScreen />
    }
}

export default BookInfo;