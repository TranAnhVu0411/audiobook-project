import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FiFilter} from 'react-icons/fi';
import Select from 'react-select';
import "./style.scss";

const url2cat = {
    'kinh_doanh': 'Kinh doanh',
    'ky_nang_song': 'Kỹ năng sống',
    'tai_chinh': 'Tài chính',
    'marketing': 'Marketing',
    'ton_giao': 'Tôn giáo',
    'tam_ly': 'Tâm lý',
    'hanh_phuc': 'Hạnh phúc',
    'song_khoe': 'Sống khoẻ',
    'thieu_nhi': 'Thiếu nhi',
    'tieu_thuyet': 'Tiểu thuyết'
}

const FilterBar = (props) => {
    const navigate = useNavigate();
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
        navigate(`${props.path}?sort=${filter.value}`)
    }

    return(
        <div className='filter-bar'>
            <div className='category'>
                <h2>Thể loại: {url2cat[props.category]}</h2>
            </div>
            <div className='filter-config'>
                <FiFilter/>
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
        </div>
    )
}

export default FilterBar;