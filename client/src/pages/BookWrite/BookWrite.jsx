import React, {useState, useEffect} from 'react';
import noImage from '../../image/noImg.png';
// Tạo input cho description
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.scss';
import {main_axios_instance} from '../../service/custom-axios';
import { FaTrash, FaUpload, FaRegSave} from "react-icons/fa";
import { IoIosRefresh } from "react-icons/io";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { useLocation, useNavigate } from "react-router-dom";

const BookWrite = () => {
    const [isUpload, setIsUpload] = useState(true); // Phục vụ cho upload dữ liệu lúc write/update
    const [isLoad, setIsLoad] = useState(false); // Phục vụ cho load dữ liệu update
    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState([]);
    const [image, setImage] = useState({
        file: null,
        url: noImage
    });
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const location = useLocation();
    const path = location.pathname;
    const [book, setBook] = useState(null)
    const [bookId, setBookId] = useState('')
    const [noimage, setNoImage] = useState(null) // Lưu file object ảnh trống
    const navigate = useNavigate();

    useEffect(() => {
        fetch(noImage).then(async response => {
            const contentType = response.headers.get('content-type')
            const blob = await response.blob()
            const file = new File([blob], 'temp.png', { contentType })
            setNoImage(file)
        })

        const fetchData = async(bookId) => {
            try{
                const bookRes = await main_axios_instance.get(`/book/${bookId}`);
                setBook(bookRes.data)
                setTitle(bookRes.data.title)
                setDescription(bookRes.data.description)
                setAuthors(bookRes.data.authors.map(author => {
                    return{
                        label: author,
                        value: author
                    };
                }))
                setCategories(bookRes.data.categories.map(category => {
                    return{
                        label: category,
                        value: category
                    };
                }))
                fetch(bookRes.data.image).then(async response => {
                    const contentType = response.headers.get('content-type')
                    const blob = await response.blob()
                    const file = new File([blob], 'temp.png', { contentType })
                    // access file here
                    setImage({
                        file: file,
                        url: bookRes.data.image
                    })
                })
            }catch(error){
                console.log(error)
            }
        }
        // Khởi tạo trường giá trị
        if (path.split('/').includes('new')){
            // Cho tạo sách mới
            setTitle('')
            setAuthors([])
            setDescription('')
            setCategories([])
            setImage({
                file: null,
                url: noImage
            })
            setIsLoad(true)
        }else{
            const bookIdParam = path.split('/').at(-2)
            setBookId(bookIdParam)
            // Cho cập nhật sách
            fetchData(bookIdParam)
            setIsLoad(true)
        }
    }, [path])

    // Reset toàn bộ giá trị sau khi upload sách
    const resetInput = () => {
        if (path.split('/').includes('new')){
            setTitle('')
            setAuthors([])
            setDescription('')
            setCategories([])
            setImage({
                file: null,
                url: noImage
            })
        }else{
            setTitle(book.title)
            setDescription(book.description)
            setAuthors(book.authors.map(author => {
                return{
                    label: author,
                    value: author
                };
            }))
            setCategories(book.categories.map(category => {
                return{
                    label: category,
                    value: category
                };
            }))
            fetch(book.image).then(async response => {
                const contentType = response.headers.get('content-type')
                const blob = await response.blob()
                const file = new File([blob], 'temp.png', { contentType })
                // access file here
                setImage({
                    file: file,
                    url: book.image
                })
            })
        }
    };

    // Lưu title vào state
    const handleTitle = e => {
        if (e.target.name === 'title'){
            setTitle(e.target.value);
        }
    };

    // Lưu Image vào state và hiển thị Image ra màn hình
    const handlePreviewImage = e => {
        if (e.target.name === 'image'){
            setImage({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    // Thể loại
    const categoryOption = [  
        { value: 'Kinh doanh', label: 'Kinh doanh' },
        { value: 'Kỹ năng sống', label: 'Kỹ năng sống' },
        { value: 'Tài chính', label: 'Tài chính' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Tôn giáo', label: 'Tôn giáo' },
        { value: 'Tâm lý', label: 'Tâm lý' },
        { value: 'Sống khoẻ', label: 'Sống khoẻ' },
        { value: 'Hạnh phúc', label: 'Hạnh phúc' },
        { value: 'Tiểu thuyết', label: 'Tiểu thuyết' },
        { value: 'Thiếu nhi', label: 'Thiếu nhi' }
    ];

    // Xoá ảnh
    const handleDeleteImage = e => {
        setImage({
            file: null,
            url: noImage
        })
    };
    // Lưu dữ liệu vào database
    const handleSubmit = async e => {
        setIsUpload(false)
        e.preventDefault();
        try{
            let bookForm = new FormData();
            bookForm.append('title', title)
            for(let i = 0; i < authors.length; i++){
                bookForm.append('authors[]', authors[i].value)
            }
            for(let i = 0; i < categories.length; i++){
                bookForm.append('categories[]', categories[i].value)
            }   
            bookForm.append('description', description)
            bookForm.append('image', image.file?image.file:noimage)
            if (path.split('/').includes('new')){
                // Create new book
                const res = await main_axios_instance.post("/book/create/", bookForm);
                setIsUpload(true)
                console.log(res);
                toast.success("Thêm sách thành công", {position: toast.POSITION.TOP_CENTER});
                resetInput();
            }else{
                // Update book info
                const res = await main_axios_instance.put(`/book/update/${bookId}`, bookForm);
                setIsUpload(true)
                console.log(res);
                navigate(`/book/info/${book._id}`)
                toast.success("Cập nhật sách thành công", {position: toast.POSITION.TOP_CENTER});
            }
        }catch(err){
            setIsUpload(true)
            console.log(err)
            if (path.split('/').includes('new')){
                toast.error("Xuất hiện lỗi phát sinh khi thêm sách", {position: toast.POSITION.TOP_CENTER});
            }else{
                toast.error("Xuất hiện lỗi phát sinh khi cập nhật sách", {position: toast.POSITION.TOP_CENTER});
            }
        };
    }

    if (isUpload && isLoad){
        return (
            <div className='write'>
                <div className='write-header'>
                    {
                        path.split('/').includes('new') ? 
                        (<h1>Thêm sách mới</h1>) :
                        (<h1>Cập nhật sách</h1>)
                    }
                    <hr></hr>
                </div>
                <div className='form'>
                    <div className='file-form'>
                        <label>Bìa sách:</label>
                        <div className='button'>
                            <input type="file" name="image" id="image" accept="image/png, image/jpg, image/jpeg" onChange={handlePreviewImage} style={{display: "none"}}/>
                            <label className='upload' htmlFor="image"><FaUpload/> Tải ảnh</label>
                            <button className='delete' onClick={handleDeleteImage}><FaTrash/></button>
                        </div>
                        <img alt="preview" src={image.url} />
                    </div>
                    <div className='text-form'>
                        <div className='title-input'>
                            <div className='input'>
                                <label>Tiêu đề:</label>
                                <input type='text' name='title' placeholder='nhập tiêu đề sách' value={title} onChange={handleTitle} />
                            </div>
                        </div>
                        <div className='author-input'>
                            <label>Tác giả:</label>
                            <CreatableSelect 
                                isMulti
                                value={authors}
                                className="author-input-output"
                                onChange={setAuthors} 
                            />
                        </div>
                        <div className='description-input'>
                            <label>Mô tả:</label>
                            <div className='editor-container'>
                                <ReactQuill placeholder="nhập mô tả sách" className="editor" theme="snow" value={description} onChange={setDescription}/>
                            </div>
                        </div>
                        <div className='category-input'>
                            <label>Thể loại:</label>
                            <Select
                                isMulti
                                name="categories"
                                options={categoryOption}
                                className="category-select"
                                value={categories}
                                onChange={setCategories}
                            />
                        </div>
                    </div>
                </div>
                <div className='submit'>
                    <button className='reset-button' onClick={resetInput}>
                        <IoIosRefresh className='icon'/>
                        <span>Hoàn tác</span>
                    </button>
                    <button className='submit-button' onClick={handleSubmit}> 
                        <FaRegSave className='icon'/> 
                        <span>Lưu thay đổi</span>
                    </button>
                </div>
            </div>
        )   
    }else{
        return <LoadingScreen />
    }
}

export default BookWrite;