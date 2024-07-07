import { Outlet } from "react-router-dom";
import UserHeader from "../../components/Header/user-header/UserHeader";
import FacebookChat from "../../components/fb-chat/FacebookChat";
// import Footer from "../../components/footer/Footer";

function UserLayout() {
  return (
    <div>
      <UserHeader></UserHeader>
      <FacebookChat />
      <Outlet />
      {/* <Footer/> */}
    </div>
  );
}

export default UserLayout;
