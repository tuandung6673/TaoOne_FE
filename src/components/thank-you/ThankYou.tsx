import "./ThankYou.scss";
import { PaymentForm } from "./../../constants/interface";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

interface Props {
    paymentForm: PaymentForm;
}

function ThankYou({ paymentForm }: Props) {
    const navigate = useNavigate();
    const handleBackHome = () => {
        navigate('/');
    }

    return (
        <div>
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
