import 'primeflex/primeflex.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import Advise from './components/admin/advise/advise';
import Banner from './components/admin/banner/banner';
import Category from './components/admin/category/Category';
import Dashboard from './components/admin/dashboard/Dashboard';
import Import from './components/admin/import/Import';
import ImportHistory from './components/admin/import/ImportHistory';
import NewsAdminDetail from './components/admin/news_admin/news-detail/NewsDetail';
import NewsAdmin from './components/admin/news_admin/NewsAdmin';
import Order from './components/admin/order/Order';
import SaleRecordList from './components/admin/sale-record/SaleRecordList';
import VoucherDetail from './components/admin/voucher-detail/VoucherDetail';
import Voucher from './components/admin/voucher/Voucher';
import WatchDetail from './components/admin/watch-detail/WatchDetail';
import Watch from './components/admin/watch/Watch';
import AllCategory from './components/all-category/AllCategory';
import Cart from './components/cart/Cart';
import PromoAppleWatch4 from './components/event2/PromoAppleWatch4';
import Home from './components/home/Home';
import LoginForm from './components/login/Login';
import NewsList from './components/newsList/NewsList';
import UserNewsDetail from './components/newsList/UserNewsDetail/UserNewsDetail';
import Payment from './components/payment/payment';
import ProductDetail from './components/product-detail/ProductDetail';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import Spinner from './components/spinner/Spinner';
import UserSearch from './components/user-search/UserSearch';
import { ROLE } from './constants/constants';
import { CartProvider } from './custom-hook/CartContext';
import { SpinnerProvider } from './custom-hook/SpinnerContext';
import AdminLayout from './layouts/Admin/AdminLayout';
import UserLayout from './layouts/User/UserLayout';

function App() {
  return (
    <SpinnerProvider>
      <CartProvider>
        <Spinner />
        <Router>
          <Routes>
            <Route path={ROLE.admin} element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />}></Route>
                <Route path='dashboard' element={<Dashboard />}></Route>
                <Route path='banner' element={<Banner />}></Route>
                <Route path='category' element={<Category />}></Route>
                {/* banner detail + category + category_detail */}
                <Route path=':categoryName' element={<Watch />}></Route>
                <Route path=':categoryName/them-moi' element={<WatchDetail />}></Route>
                <Route path=':categoryName/:productId' element={<WatchDetail />}></Route>
                <Route path='order' element={<Order />}></Route>
                <Route path='sale-record' element={<SaleRecordList />}></Route>
                <Route path='news' element={<NewsAdmin />}></Route>
                <Route path='news/them-moi' element={<NewsAdminDetail />}></Route>
                <Route path='news/:newsId' element={<NewsAdminDetail />}></Route>
                <Route path='advise' element={<Advise />} />
                <Route path='import' element={<Import />} />
                <Route path='import-history' element={<ImportHistory />} />
                <Route path='voucher' element={<Voucher />} />
                <Route path='voucher/them-moi' element={<VoucherDetail />} />
                <Route path='voucher/:voucherId' element={<VoucherDetail />} />
              </Route>
            </Route>
            <Route path='login' element={<LoginForm />}>
            </Route>
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path='event' element={<PromoAppleWatch4 />} />
              {/* <Route path='event2' element={<PromoAppleWatch4 />} /> */}
              <Route path='cart' element={<Cart />} />
              <Route path='thanh-toan/:itemId' element={<Payment/>} />
              <Route path='thanh-toan-gio-hang' element={<Payment/>} />
              <Route path=':categoryName' element={<AllCategory />} />
              <Route path=':categoryName/:itemId' element={<ProductDetail />} />
              <Route path='news' element={<NewsList />} />
              <Route path='news/:newsSlug' element={<UserNewsDetail />} />
              <Route path='search' element={<UserSearch />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </SpinnerProvider>
  );
}

export default App;