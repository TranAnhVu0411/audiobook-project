import React, {useState, useEffect, useContext} from 'react';
import BookTable from '../../components/BookTable/BookTable';
import {main_axios_instance} from '../../service/custom-axios';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "./style.scss";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import Pagination from 'react-responsive-pagination';
import '../../util/stylePagination.scss';
import FilterBar from '../../components/ToolBar/FilterBar/FilterBar';
import SearchBar from '../../components/ToolBar/SearchBar/SearchBar';
import { AuthContext } from "../../context/AuthContextProvider";
import { getRole } from '../../context/role';

const Index = () => {
    const [books, setBooks] = useState([]);
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

    // Kiểm tra người dùng là user hay admin
    const { currentUser } = useContext(AuthContext);
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            let res={};
            let currentPage = 1;
            const pathList = path.split('/');
            if (pathList.includes('page')){
                // Nếu trong url chứa page => lấy số trang hiện tại
                // Nếu không => đặt pageOffset == 1 
                currentPage = Number(pathList[pathList.indexOf('page')+1]);
            }
            setPageOffset(currentPage)
            if (getRole(currentUser) !== "admin"){
                // Nếu người truy cập là user/guest
                if (pathList.includes('category')){
                    // Nếu được truy cập thông qua category
                    const category = path.split("/")[3];
                    res = await main_axios_instance.get(`/book/category/${category}${searchQuery==="" ? "?" : `${searchQuery}&`}page=${pageOffset}`);
                }else{
                    // Nếu được truy cập thông qua advance-search
                    res = await main_axios_instance.get(`/book/find${searchQuery==="" ? "?" : `${searchQuery}&`}page=${pageOffset}`);
                }
            }else{
                // Nếu người truy cập là admin
                res = await main_axios_instance.get(`/book/find${searchQuery==="" ? "?" : `${searchQuery}&`}page=${pageOffset}`);
            }
            setBooks(res.data.books);
            setTotalItem(res.data.total);
            setPageCount(res.data.pageCount);
            setIsLoad(true);
          } catch (err) {
            console.log(err);
          }
        };
        fetchData();
    }, [path, searchQuery, searchParams, pageOffset, currentUser]);
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

    // chuyển toolbar (filter hoặc search)
    const handleToolbar = () => {
        if (getRole(currentUser) !== 'admin'){
            const pathList = path.split('/')
            if(pathList.includes('category')){
                return <FilterBar searchParams={searchParams} path={path} category={pathList[pathList.indexOf('category')+1]}/>
            }else{
                return <SearchBar searchParams={searchParams} path={path}/>
            }
        } else {
            return <SearchBar searchParams={searchParams} path={path}/>
        }
    }

    if (isLoad){
        return (
            <div className='index'>
                {
                    handleToolbar()
                }
                <div className='result-number'>
                    {totalItem} kết quả  
                </div>
                <div className='book-table'>
                    <BookTable books={books} />
                </div>
                <Pagination
                    total={pageCount}
                    current={pageOffset}
                    onPageChange={page => {handlePageChange(page)}}
                />
            </div>
        )
    }else{
        <LoadingScreen />
    }
}

export default Index;