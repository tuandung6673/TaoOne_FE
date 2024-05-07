import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.scss';
import AllCategory from './components/all-category/AllCategory';
import Home from './components/home/Home';
import ProductDetail from './components/product-detail/ProductDetail';
import AdminLayout from './layouts/Admin/AdminLayout';
import UserLayout from './layouts/User/UserLayout';

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