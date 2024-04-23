import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import User from './layouts/User/User';
import Admin from './layouts/Admin/Admin';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<User />}>
        </Route>
        <Route path="/quan-tri" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
