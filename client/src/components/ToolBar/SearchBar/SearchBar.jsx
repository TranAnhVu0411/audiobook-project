import React, {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {GiArchiveResearch} from 'react-icons/gi';
import {ImBooks} from 'react-icons/im'
import {IoIosArrowDropup, IoIosArrowDropdown, IoIosRefresh, IoIosSearch} from 'react-icons/io'
import "./style.scss";
import Select from 'react-select';
import { AuthContext } from "../../../context/AuthContextProvider";
import { getRole } from '../../../context/role';

const cat2url = {
    'Kinh doanh': 'kinh_doanh',
    'Kỹ năng sống': 'ky_nang_song',
    'Tài chính': 'tai_chinh',
    'Marketing': 'marketing',
    'Tôn giáo': 'ton_giao',
    'Tâm lý': 'tam_ly',
    'Hạnh phúc': 'hanh_phuc',
    'Sống khoẻ': 'song_khoe',
    'Thiếu nhi': 'thieu_nhi',
    'Tiểu thuyết': 'tieu_thuyet'
};

const SearchBar = (props) => {
    const { currentUser } = useContext(AuthContext);

    // Nút thu gọn thanh tìm kiếm
    const [open, setOpen] = useState({
        state: true,
        icon: <IoIosArrowDropup/>
    })

    const handleToogleSearch = () => {
        if(open.state){
            setOpen({
                state: false,
                icon: <IoIosArrowDropdown/>
            })
        }else{
            setOpen({
                state: true,
                icon: <IoIosArrowDropup/>
            })
        }
    }
    let viewMode = {}
    if(open.state){
        viewMode.display = "flex"
    }else{
        viewMode.display = "none"
    }

    const navigate = useNavigate();
    // Xử lý category
    const categoryOption = [  
        'Kinh doanh', 'Kỹ năng sống', 'Tài chính', 
        'Marketing', 'Tôn giáo', 'Tâm lý', 'Sống khoẻ', 
        'Hạnh phúc', 'Tiểu thuyết', 'Thiếu nhi'
    ];
    const categoryInitialState = []
    const categoryQuery = props.searchParams.get('cat')===null?[]:props.searchParams.get('cat').split(",")// Category trong query url
    categoryOption.forEach(category => categoryInitialState.push({id: category, state: categoryQuery.includes(cat2url[category])}));
    const [categories, setCategory] = useState(categoryInitialState)
    const handleCategory = (e) => {
        setCategory(prevState => prevState.map(category => {
            if (category.id === e.target.id) {
                return {
                    ...category,
                    state: !category.state,
                }
            }
                return category;
            })
        )
    }

    // Xử lý filter
    let filterType = 0;
    const filterOptions = [  
        { value: 0, label: 'Mới nhất' },
        { value: 1, label: 'Cũ nhất' },
    ];
    if (props.searchParams.get('sort')!==null){
        filterType = Number(props.searchParams.get('sort'));
    }
    const [filter, setFilter] = useState(filterOptions[filterType])
    const handleFilter = filter => {
        setFilter(filter);
    }

    // Xử lý search button
    const handleSearch = () => {
        let newPath = ''
        const pathList = props.path.split('/')
        if (pathList.includes('page')){
            // Nếu url chứa page => chuyển về trang 1
            newPath =  props.path.replace(`/page/${pathList[pathList.indexOf('page')+1]}`, ``)
        }
        let checkedCategory = []
        categories.forEach(category => {
            if (category.state){
                checkedCategory.push(cat2url[category.id])
            }
        })
        let categoryQuery = checkedCategory.length===0 ? '' : `cat=${checkedCategory.toString()}`
        let queryList = [];
        if (categoryQuery!==''){
            queryList.push(categoryQuery)
        }
        queryList.push(`sort=${filter.value}`)
        navigate(`${newPath}?${queryList.join('&')}`)
    }

    // Xử lý reset button
    const handleReset = () => {
        setCategory(categoryInitialState)
        setFilter(filterOptions[0])
        if (getRole(currentUser) !== 'admin') {
            navigate(`/book/advance-search`)
        }else{
            navigate('/booklist')
        }
    }

    return(
        <div className='search-bar'>
            {getRole(currentUser) !== "admin" ? (
                    <div className='title'>
                        <GiArchiveResearch className='icon'/>
                        <span>Tìm kiếm nâng cao</span>
                    </div>
             ) : (
             <div className='title'>
                <ImBooks className='icon'/>
                <span>Danh sách sách</span>
            </div>
            )
            }
            <div className='search-section'>
                <div className='search-config' style={viewMode}>
                    <div className='category-search'>
                        <span>Thể loại truyện</span>

                        <div className='category-grid'>
                            {categories.map(category => {
                                return(
                                    <div className='category-item' key={category.id}>
                                        <input type="checkbox" id={category.id} checked={category.state} onChange={handleCategory}/>
                                        <label>{category.id}</label>
                                    </div>                        
                                    ) 
                            })}
                        </div>
                    </div>
                    <div className='filter-type'>
                        <span>Lọc truyện theo:</span>
                        <Select
                            className="filter-options"
                            classNamePrefix="select"
                            name="color"
                            options={filterOptions}
                            value={filter}
                            onChange = {handleFilter}
                        />
                    </div>
                    <div className='submit-buttons'>
                        <button className='reset-button' onClick={handleReset}>
                            <IoIosRefresh className='icon'/>
                            <span>Reset</span>
                        </button>
                        <button className='search-button' onClick={handleSearch}>
                            <IoIosSearch className='icon'/>
                            <span>Tìm kiếm</span>
                        </button>
                    </div>
                </div>
                <div className='expand-button'>
                    <button onClick={handleToogleSearch}>{open.icon}</button>
                </div>
            </div>
        </div>
    )
}

export default SearchBar;