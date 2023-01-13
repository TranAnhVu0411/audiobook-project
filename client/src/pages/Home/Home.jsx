import React, {useState, useEffect} from "react";
import BookCard from "../../components/BookCard/BookCard";
import {BsCloudArrowDown} from 'react-icons/bs'
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {sectionSettings, headerSettings} from '../../util/carousel-setting';
import { imgUrl } from "../../util/header-image";
import "./style.scss";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import {main_axios_instance} from '../../service/custom-axios';
const Home = () => {
    const [recentBooks, setRecentBooks] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await main_axios_instance.get(`/book/recent`);
            setRecentBooks(res.data);
            setIsLoad(true);
          } catch (err) {
            console.log(err);
          }
        };
        fetchData();
    }, []);

    if (isLoad){
        return (
            <div className="home">
                <div className="home-header">
                    <Slider {...headerSettings}>
                        {
                            imgUrl.map(url => {
                                return( 
                                    <div className="header-image" key={url}>
                                        <img src={url} alt='header' />
                                    </div>
                                )
                            })
                        }
                    </Slider>
                </div>
                <div className="section">
                    <div className="section-header">
                        <div className="section-title">
                            <BsCloudArrowDown className="section-icon"/>
                            <h2>Mới cập nhật</h2>
                        </div>
                    </div>
                    <div className="section-items">
                        <Slider {...sectionSettings(recentBooks.length)}>
                        {
                            recentBooks.map(book => {
                                return <BookCard key={book._id} book={book}/>
                            })
                        }
                        </Slider>
                    </div>
                </div>
            </div>
        )
    }else{
        <LoadingScreen />
    }
}

export default Home;