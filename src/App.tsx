import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.scss';
import WatchDetail from './components/admin/watch-detail/WatchDetail';
import Watch from './components/admin/watch/Watch';
import AllCategory from './components/all-category/AllCategory';
import Home from './components/home/Home';
import ProductDetail from './components/product-detail/ProductDetail';
import { AllRouteType, ROLE } from './constants/constants';
import AdminLayout from './layouts/Admin/AdminLayout';
import UserLayout from './layouts/User/UserLayout';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path={ROLE.admin} element={<AdminLayout />}>
            <Route path={AllRouteType.watch} element={<Watch />}></Route>
            <Route path={`${AllRouteType.watch}/:productId`} element={<WatchDetail />}></Route>
          </Route>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path=':categoryName' element={<AllCategory />} />
            <Route path=':categoryName/:itemId' element={<ProductDetail />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;