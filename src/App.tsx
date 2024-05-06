import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLayout from './layouts/User/UserLayout';
import AdminLayout from './layouts/Admin/AdminLayout';
import Home from './components/home/Home';
import AllCategory from './components/all-category/AllCategory';
import './App.scss';
import ProductDetail from './components/product-detail/ProductDetail';

// import TrangChu from './components/trang-chu/TrangChu';
// import TrangChu2 from './components/trang-chu-2/TrangChu2';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path='/:categoryName' element={<AllCategory />} />
            <Route path='/:categoryName/:itemId' element={<ProductDetail />} />
          </Route>
          <Route path="admin" element={<AdminLayout />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;