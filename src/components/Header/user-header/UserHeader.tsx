import classes from "./UserHeader.module.scss";
import headerLogo from "../../../images/Tao one den.png";
import { AllRouteType } from "../../../constants/constants";
function UserHeader() {
  return (
    <>
      <div className={classes.header}>
        <div className={classes.header_main}>
          <div className={`${classes.header_left}`}>
            <a href="/" title="Trang chủ">
              <img className={classes.logo} src={headerLogo} alt="Logo" />
            </a>
          </div>
          <div className={`${classes.header_center}`}>
            <ul>
              <li>
                <a href={'/' + AllRouteType.watch} title="">
                  Watch
                </a>
              </li>
              <li>
                <a href={'/' + AllRouteType.ipad} title="">
                  iPad
                </a>
              </li>
              <li>
                <a href={'/' + AllRouteType.macbook} title="">
                  Macbook
                </a>
              </li>
              <li>
                <a href={'/' + AllRouteType.airpods} title="">
                  Airpods
                </a>
              </li>
              <li>
                <a href={'/' + AllRouteType.accessories} title="">
                  Phụ kiện
                </a>
              </li>
              <li>Tin tức</li>
            </ul>
          </div>
          <div className={`${classes.header_right}`}>
            <span className={classes.item}>
              <i className="pi pi-search" style={{ color: "white" }}></i>
            </span>
            <span className={classes.item}>
              <i className="pi pi-shopping-bag" style={{ color: "white" }}></i>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserHeader;