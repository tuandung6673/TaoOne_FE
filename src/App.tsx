import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLayout from './layouts/User/UserLayout';
import AdminLayout from './layouts/Admin/AdminLayout';
import './App.scss';

// import TrangChu from './components/trang-chu/TrangChu';
// import TrangChu2 from './components/trang-chu-2/TrangChu2';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="" element={<UserLayout />}>
            {/* <Route path="trang-chu" element={<TrangChu />} /> 
            <Route path="trang-chu-2" element={<TrangChu2 />} />   */}
          </Route>
          <Route path="admin" element={<AdminLayout />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;