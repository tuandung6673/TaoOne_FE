import classes from "./Footer.module.scss";

function Footer() {
    return (
        <div className={classes.main_footer}>
            <div className={classes.footer}>
                <div className={classes.footer_item}>Hotline: 0343.986.324</div>
                <div className={classes.footer_item}>
                    Email: taoonestore@gmail.com
                </div>
                <div className={classes.footer_item}>
                    Địa chỉ: 377 Giải Phóng - Thanh Xuân - HN
                </div>
            </div>
        </div>
    );
}

export default Footer;
