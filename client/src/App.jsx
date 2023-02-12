import {
  Routes,
  Route,
  BrowserRouter as Router,
} from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Index from './pages/Index/Index';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Error from './pages/Error/Error'
import { AuthContextProvider } from './context/AuthContextProvider';
import { AuthContextRequirement} from './context/AuthContextRequirement'
import "./style.scss";
import DashBoard from './pages/DashBoard/DashBoard';
import BookWrite from './pages/BookWrite/BookWrite'
import BookInfo from './pages/BookInfo/BookInfo';
import ChapterWrite from './pages/ChapterWrite/ChapterWrite';
import PdfWrite from './pages/PdfWrite/PdfWrite';
import { ToastContainer } from "react-toastify";
import PageEdit from './pages/PageEdit/PageEdit';
import ChapterEdit from './pages/ChapterEdit/ChapterEdit';
import AudioBook from './pages/AudioBook/AudioBook';
import { Worker } from '@react-pdf-viewer/core';
import UserInfo from './pages/UserInfo/UserInfo';
import UserList from './pages/UserList/UserList';

function App() {
  return (
    <Router>
      <div className="app">
        <div className='container'>
        <AuthContextProvider>
          <Navbar/>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js"/>
          <ToastContainer />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/book/info/:id" element={<BookInfo />} />
              <Route path="/book/category/:cat/page/:page" element={<Index />} />
              <Route path="/book/category/:cat" element={<Index />} />
              <Route path="/book/advance-search/page/:page" element={<Index />} />
              <Route path="/book/advance-search" element={<Index />} />
              <Route path="/chapter/:id" element={<AudioBook />} />
              <Route path="/user/:id" element={<UserInfo />} />
              <Route element={<AuthContextRequirement role={['admin']} />}>
                  <Route path="/dashboard" element={<DashBoard />} />
                  <Route path="/book/new" element={<BookWrite />} /> 
                  <Route path="/booklist/page/:page" element={<Index />} />
                  <Route path="/booklist" element={<Index />} />
                  <Route path="/book/info/:id/chapter/new" element={<ChapterWrite />} />
                  <Route path="/book/info/:id/pdf/new" element={<PdfWrite />} />
                  <Route path="/chapter/:id/edit" element={<ChapterEdit/>}/>
                  <Route path="/page/:id/edit" element={<PageEdit />} />
                  <Route path="/book/info/:id/update" element={<BookWrite />} /> 
                  <Route path="/userlist" element={<UserList />} />
                  <Route path="/userlist/page/:page" element={<UserList />} />
              </Route>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Error />}/>
            </Routes>
          <Footer/>
        </AuthContextProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;
