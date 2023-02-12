import React, {useState, useEffect} from "react";
import {main_axios_instance} from '../../service/custom-axios';
import {ImUsers} from 'react-icons/im'
import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
import Pagination from 'react-responsive-pagination';
import '../../util/stylePagination.scss';
import Select from 'react-select';
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import "./style.scss"

const UserList = () => {
    const [users, setUsers] = useState([])
    const [pageCount, setPageCount] = useState(0);
    const [isLoad, setIsLoad] = useState(false);
    // Lấy thông tin url/query
    const location = useLocation();
    const path = location.pathname;
    const searchQuery = location.search;
    const [searchParams] = useSearchParams();
    // Phân trang
    const [pageOffset, setPageOffset] = useState(1);
    const [totalItem, setTotalItem] = useState(0);
    const navigate = useNavigate();

    const [textInputs, setTextInputs] = useState({
        username: searchParams.get('username')===null?"":searchParams.get('username'),
        email: searchParams.get('email')===null?"":searchParams.get('email')
    })

    useEffect(() => {
        const fetchData = async () => {
            let currentPage = 1;
            const pathList = path.split('/');
            if (pathList.includes('page')){
                // Nếu trong url chứa page => lấy số trang hiện tại
                // Nếu không => đặt pageOffset ==1 
                currentPage = Number(pathList[pathList.indexOf('page')+1]);
            }
            setPageOffset(currentPage)
            let res = await main_axios_instance.get(`/user/find${searchQuery==="" ? "?" : `${searchQuery}&`}page=${pageOffset}`);
            setUsers(res.data.users);
            setTotalItem(res.data.total);
            setPageCount(res.data.pageCount);
        }
        fetchData();
        setIsLoad(true)
    }, [searchQuery, pageOffset, path]);

    const handlePageChange = page => {
        let newPath = ''
        const pathList = path.split('/')
        if (pathList.includes('page')){
            // Nếu url chứa page => thay thế số trang
            newPath =  path.replace(`page/${pageOffset}`, `page/${page}`)
        }else{
            // Nếu không, thêm '/page/${trang hiện tại}
            newPath =  `${path}/page/${page}`
        }

        navigate(`${newPath}${searchQuery}`);
    };

    // Username và Email
    const handleChange = (e) => {
        setTextInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    // Filter role
    let filterType = 0;
    const filterOptions = [  
        { value: 0, label: 'Tất cả' },
        { value: 1, label: 'User' },
        { value: 2, label: 'Admin'}
    ];
    if (searchParams.get('role')!==null){
        filterType = Number(searchParams.get('role'));
    }
    const [filter, setFilter] = useState(filterOptions[filterType])
    const handleFilter = filter => {
        setFilter(filter);
    }

    const handleSearch = () => {
        let newPath = ''
        const pathList = path.split('/')
        if (pathList.includes('page')){
            // Nếu url chứa page => chuyển về trang 1
            newPath =  path.replace(`/page/${pathList[pathList.indexOf('page')+1]}`, ``)
        }
        let queryList = []
        let usernameQuery = textInputs.username===''?'':`username=${textInputs.username}`
        let emailQuery = textInputs.email===''?'':`email=${textInputs.email}`
        if (usernameQuery !==''){
            queryList.push(usernameQuery)
        }
        if (emailQuery !==''){
            queryList.push(emailQuery)
        }
        queryList.push(`role=${filter.value}`)
        navigate(`${newPath}?${queryList.join('&')}`)
    }

    const handleReset = () => {
        setTextInputs({
            username: '',
            email: ''
        })
        setFilter(filterOptions[0])
        navigate(`/userlist`)
    }

    if (isLoad){
        return (
            <div className="user-list">
                <div className="user-list-header">
                    <ImUsers className="icon"/>
                    <span>Danh sách tài khoản</span>
                </div>
                <div className="user-search">
                    <div className="user-search-text">
                        <label>Username: </label>
                        <input type="text" name="username" placeholder="Username" value={textInputs.username} onChange={handleChange}/>
                    </div>
                    <div className="user-search-text">
                        <label>Email:</label>
                        <input type="email" name="email" placeholder="Email" value={textInputs.email} onChange={handleChange}/>
                    </div>
                    <div className="user-search-select">
                        <label>Role:</label>
                        <Select
                            className="filter-options"
                            classNamePrefix="select"
                            name="color"
                            options={filterOptions}
                            value={filter}
                            onChange = {handleFilter}
                        />
                    </div>
                    <div className='user-search-buttons'>
                        <button className='search-button' onClick={handleSearch}>
                            <span>Tìm kiếm</span>
                        </button>
                        <button className='reset-button' onClick={handleReset}>
                            <span>Reset</span>
                        </button>
                    </div>
                </div>
                <div className='result-number'>
                        {totalItem} kết quả  
                    </div>
                <div className="user-table">
                    <table>
                        <thead>
                            <tr>
                                <th style={{width:"15%"}}>Username</th>
                                <th style={{width:"70%"}}>Email</th>
                                <th style={{width:"15%"}}>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => {
                                return(
                                <tr key={user._id}>
                                    <td>
                                        <Link to={`/user/${user._id}`}>
                                            {user.username}
                                        </Link>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    total={pageCount}
                    current={pageOffset}
                    onPageChange={page => {handlePageChange(page)}}
                />
            </div>
        )    
    }else{
        <LoadingScreen/>
    }
    
}

export default UserList;