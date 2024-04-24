import { Outlet } from "react-router-dom";
import UserHeader from '../../components/Header/user-header/UserHeader';
// import Footer from "../../components/footer/Footer";

function UserLayout() {
    return (
        <div>
            <UserHeader></UserHeader>
            <Outlet />
            {/* <Footer/> */}
        </div>
    )
}

export default UserLayout