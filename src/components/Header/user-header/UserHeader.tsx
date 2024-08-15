import classes from "./UserHeader.module.scss";
import headerLogo from "../../../images/Tao one den.png";
import { AllRouteType } from "../../../constants/constants";
import { useEffect, useState } from "react";
function UserHeader() {
  const [isFixed, setIsFixed] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                // Change 100 to the desired scroll distance
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <div className={`${classes.header} ${isFixed ? classes.header_fixed : ''}`}>
                <div className={classes.header_main}>
                    <div className={`${classes.header_left}`}>
                        <a href="/" title="Trang chủ">
                            <img
                                className={classes.logo}
                                src={headerLogo}
                                alt="Logo"
                            />
                        </a>
                    </div>
                    <div className={`${classes.header_center}`}>
                        <ul>
                            <li>
                                <a href={"/" + AllRouteType.watch} title="">
                                    Watch
                                </a>
                            </li>
                            <li>
                                <a href={"/" + AllRouteType.ipad} title="">
                                    iPad
                                </a>
                            </li>
                            <li>
                                <a href={"/" + AllRouteType.macbook} title="">
                                    Macbook
                                </a>
                            </li>
                            <li>
                                <a href={"/" + AllRouteType.airpods} title="">
                                    Airpods
                                </a>
                            </li>
                            <li>
                                <a
                                    href={"/" + AllRouteType.accessories}
                                    title=""
                                >
                                    Phụ kiện
                                </a>
                            </li>
                            <li>Tin tức</li>
                        </ul>
                    </div>
                    <div className={`${classes.header_right}`}>
                        <span className={classes.item}>
                            <i
                                className="pi pi-search"
                                style={{ color: "white" }}
                            ></i>
                        </span>
                        <span className={classes.item}>
                            <i
                                className="pi pi-shopping-bag"
                                style={{ color: "white" }}
                            ></i>
                        </span>
                    </div>
                </div>
                <div className={`${classes.header_mobile}`}>
                    <div>
                        <a href={"/" + AllRouteType.watch} title="">
                            Watch
                        </a>
                    </div>
                    <div>
                        <a href={"/" + AllRouteType.ipad} title="">
                            iPad
                        </a>
                    </div>
                    <div>
                        <a href={"/" + AllRouteType.macbook} title="">
                            Macbook
                        </a>
                    </div>
                    <div>
                        <a href={"/" + AllRouteType.airpods} title="">
                            Airpods
                        </a>
                    </div>
                    <div>
                        <a href={"/" + AllRouteType.accessories} title="">
                            Phụ kiện
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserHeader;
