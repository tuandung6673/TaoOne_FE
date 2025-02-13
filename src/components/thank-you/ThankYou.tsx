import "./ThankYou.scss";
import { PaymentForm } from "./../../constants/interface";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import headerStyle from "../Header/user-header/UserHeader.module.scss"

interface Props {
    paymentForm: PaymentForm;
}

function ThankYou({ paymentForm }: Props) {
    const navigate = useNavigate();
    const handleBackHome = () => {
        navigate('/');
    }
    const adjustThankWrapperHeight = () => {
        const navbar = document.querySelector(`.${headerStyle.header}`) as HTMLElement;
        const footer = document.querySelector(".main_footer") as HTMLElement;
        const thankWrapper = document.querySelector(".thank-wrapper") as HTMLElement;
    
        if (navbar && footer && thankWrapper) {
            const navbarHeight = navbar.offsetHeight || 0;
            const footerHeight = footer.offsetHeight || 0;
            const newHeight = `calc(100vh - ${navbarHeight}px - ${footerHeight}px - 55px)`;
    
            thankWrapper.style.minHeight = newHeight;
        }
    };

    useEffect(() => {
        adjustThankWrapperHeight();
        window.addEventListener("resize", adjustThankWrapperHeight);
    
        return () => {
            window.removeEventListener("resize", adjustThankWrapperHeight);
        };
    }, []);

    return (
        <div className="thank-wrapper">
            <div className="main-thank">
                <div>
                    <span>
                        <i className="pi pi-check-circle"></i>
                    </span>
                </div>
                <div>
                    Xin cảm ơn quý khách <br />
                    <span className="customer-info">
                        {paymentForm.name} - {paymentForm.phone}
                    </span>
                </div>
                <div>Đơn hàng đã được đặt thành công!</div>
                <div>
                    Chúng tôi sẽ sớm liên hệ với bạn để xác nhận đơn hàng này
                </div>
                <div className="button-wrapper">
                    <Button label="Quay về Trang chủ" onClick={handleBackHome}/>
                </div>
            </div>
        </div>
    );
}

export default ThankYou;
