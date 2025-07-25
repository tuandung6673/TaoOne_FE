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
import Order from './components/admin/order/Order';
import LoginForm from './components/login/Login';
import Cart from './components/cart/Cart';
import { SpinnerProvider } from './custom-hook/SpinnerContext';
import { CartProvider } from './custom-hook/CartContext';
import Spinner from './components/spinner/Spinner';
import NewsAdmin from './components/admin/news_admin/NewsAdmin';
import NewsList from './components/newsList/NewsList';
import NewsAdminDetail from './components/admin/news_admin/news-detail/NewsDetail';
import UserNewsDetail from './components/newsList/UserNewsDetail/UserNewsDetail';

function App() {
  return (
    <SpinnerProvider>
      <CartProvider>
        <Spinner />
        <Router>
          <Routes>
            <Route path={ROLE.admin} element={<AdminLayout />}>
              <Route path='banner' element={<Banner />}></Route>
              <Route path='category' element={<Category />}></Route>
              {/* banner detail + category + category_detail */}
              <Route path=':categoryName' element={<Watch />}></Route>
              <Route path=':categoryName/them-moi' element={<WatchDetail />}></Route>
              <Route path=':categoryName/:productId' element={<WatchDetail />}></Route>
              <Route path='order' element={<Order />}></Route>
              <Route path='news' element={<NewsAdmin />}></Route>
              <Route path='news/them-moi' element={<NewsAdminDetail />}></Route>
              <Route path='news/:newsId' element={<NewsAdminDetail />}></Route>
            </Route>
            <Route path='login' element={<LoginForm />}>
            </Route>
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path='cart' element={<Cart />} />
              <Route path='thanh-toan/:itemId' element={<Payment/>} />
              <Route path=':categoryName' element={<AllCategory />} />
              <Route path=':categoryName/:itemId' element={<ProductDetail />} />
              <Route path='news' element={<NewsList />} />
              <Route path='news/:newsId' element={<UserNewsDetail />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </SpinnerProvider>
  );
}

export default App;