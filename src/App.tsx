import 'primeflex/primeflex.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.scss';
import WatchDetail from './components/admin/watch-detail/WatchDetail';
import Watch from './components/admin/watch/Watch';
import AllCategory from './components/all-category/AllCategory';
import Home from './components/home/Home';
import ProductDetail from './components/product-detail/ProductDetail';
import { ROLE } from './constants/constants';
import AdminLayout from './layouts/Admin/AdminLayout';
import UserLayout from './layouts/User/UserLayout';
import Category from './components/admin/category/Category';
import Banner from './components/admin/banner/banner';
import Payment from './components/payment/payment';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path={ROLE.admin} element={<AdminLayout />}>
            <Route path='banner' element={<Banner />}></Route>
            <Route path='category' element={<Category />}></Route>
            {/* banner detail + category + category_detail */}
            <Route path=':categoryName' element={<Watch />}></Route>
            <Route path=':categoryName/them-moi' element={<WatchDetail />}></Route>
            <Route path=':categoryName/:productId' element={<WatchDetail />}></Route>
          </Route>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path='thanh-toan/:itemId' element={<Payment/>} />
            <Route path=':categoryName' element={<AllCategory />} />
            <Route path=':categoryName/:itemId' element={<ProductDetail />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;