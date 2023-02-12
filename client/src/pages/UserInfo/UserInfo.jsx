import React, {useState, useEffect, useContext} from 'react';
import {useLocation} from 'react-router-dom';
import {main_axios_instance} from '../../service/custom-axios';
import {AiOutlineComment, AiOutlineStar, AiOutlineHeart} from 'react-icons/ai';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './style.scss';
import CommentList from './CommentList/CommentList';
import UserEdit from './UserEdit/UserEdit';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { AuthContext } from "../../context/AuthContextProvider";
import RatingList from './RatingList/RatingList';
import FavouriteList from './FavouriteList/FavouriteList';

const UserInfo = () => {
    const { currentUser } = useContext(AuthContext);
    const [user, setUser] = useState({
        username: "",
        email: "",
        violatedCount: 0
    });
    const [avatar, setAvatar] = useState({
        file: null,
        url: null
    })
    const [comments, setComments] = useState([])
    const [ratings, setRatings] = useState([])
    const [favourites, setFavourites] = useState([])
    const location = useLocation();
    const userId = location.pathname.split("/").at(-1);
    const [isLoad, setIsLoad] = useState(false);
    const [isUpload, setIsUpload] = useState(true);

    useEffect(() =>{
        const fetchData = async() =>{
            const res = await main_axios_instance.get(`/user/${userId}`);
            let data = res.data
            console.log(data)
            setUser({
                username: data.user.username,
                email: data.user.email,
                violatedCount: data.user.violatedCount
            })
            fetch(data.avatar).then(async response => {
                const contentType = response.headers.get('content-type')
                const blob = await response.blob()
                const file = new File([blob], 'temp.png', { contentType })
                // access file here
                setAvatar({
                    file: file,
                    url: data.user.avatar
                })
            })
            setComments(data.comments)
            setRatings(data.ratings)
            setFavourites(data.favourites)
        }
        fetchData()
        setIsLoad(true)
    }, [userId, isUpload])

    const [isViewerOpen, setIsViewerOpen] = useState(false);

    if (isUpload && isLoad){
        return(
            <div className='user-info'>
                <div className='user-info-detail'>
                    <img alt="preview" src={avatar.url} />
                    {currentUser.info._id===userId?
                        <button onClick={() => setIsViewerOpen(true)}>Cập nhật thông tin</button>
                        :<></>
                    }
                    <div className='user-text-info'>
                        <div className='user-text'>
                            <label>Username: </label>
                            <span>{user.username}</span>
                        </div>
                        <div className='user-text'>
                            <label>Email: </label>
                            <span>{user.email}</span>
                        </div>
                        <div className='user-text'>
                            <label>Số lần vi phạm: </label>
                            <span>{user.violatedCount}</span>
                        </div>
                    </div>
                </div>
                
                <div className='user-info-other'>
                    <Tabs>
                        <TabList>
                            <Tab>
                                <div className='tab-header'>
                                    <AiOutlineComment/>
                                    <span>Comment</span>
                                </div>
                            </Tab>
                            <Tab>
                                <div className='tab-header'>
                                    <AiOutlineStar/>
                                    <span>Rating</span>
                                </div>
                            </Tab>
                            {currentUser.info._id===userId?
                                <Tab>
                                    <div className='tab-header'>
                                        <AiOutlineHeart/>
                                        <span>Yêu thích</span>
                                    </div>
                                </Tab>
                                :<></>
                            }
                        </TabList>
                        <TabPanel>
                            <CommentList comments={comments}/>
                        </TabPanel>
                        <TabPanel>
                            <RatingList ratings={ratings}/>
                        </TabPanel>
                        <TabPanel>
                            <FavouriteList favourites={favourites} currentUser={currentUser}/>
                        </TabPanel>
                    </Tabs>
                </div>
                {isViewerOpen ? 
                    <UserEdit
                        avatar = {avatar}
                        username = {user.username}
                        userId = {userId}
                        setIsUpload={setIsUpload}
                        onClose={() => setIsViewerOpen(false)}
                    /> : 
                    <></>
                }
            </div>
        )
    }else{
        return <LoadingScreen/>
    }
}

export default UserInfo;