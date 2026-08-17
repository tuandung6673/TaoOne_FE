import { Outlet } from "react-router-dom";
import UserHeader from "../../components/Header/user-header/UserHeader";
import Footer from "../../components/footer/Footer";
import SocialBubbles from "../../components/social-bubbles/SocialBubbles";
import { ThemeProvider } from "../../custom-hook/ThemeContext";
import "./UserLayout.scss";
// import Footer from "../../components/footer/Footer";

function UserLayout() {
    return (
        <ThemeProvider>
            <div>
                <UserHeader></UserHeader>
                <div className="user-layout-outlet-container">
                    <Outlet />
                </div>
                <Footer></Footer>
                <SocialBubbles></SocialBubbles>
            </div>
        </ThemeProvider>
    );
}

export default UserLayout;
