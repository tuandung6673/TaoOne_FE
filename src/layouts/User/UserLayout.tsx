import { Outlet } from "react-router-dom";
import UserHeader from "../../components/Header/user-header/UserHeader";
import Footer from "../../components/footer/Footer";
import classes from "./UserLayout.module.scss";
// import Footer from "../../components/footer/Footer";

function UserLayout() {
    return (
        <div>
            <UserHeader></UserHeader>
            <div className={classes.outlet_container}>
                <Outlet />
            </div>
            <Footer></Footer>
        </div>
    );
}

export default UserLayout;
