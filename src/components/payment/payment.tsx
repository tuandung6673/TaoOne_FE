import { useEffect, useState } from "react";
import "./payment.scss";
import { ItemDetail, PaymentForm } from "../../constants/interface";
import ApiService from "../../services/api.service";
import { useParams } from "react-router-dom";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

enum PaymentMethod {
    BankTransfer = "bankTransfer",
    CheckPayment = "checkPayment",
    CashPayment = "cashPayment",
}

function Payment() {
    const [productDetail, setProductDetail] = useState<ItemDetail>();
    const [paymentForm, setPaymentForm] = useState<PaymentForm>(
        new PaymentForm()
    );
    const [quantity, setQuantity] = useState<number>(0);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
        PaymentMethod.BankTransfer
    );
    const { itemId } = useParams<{ itemId?: string }>();

    useEffect(() => {
        if (!!itemId) {
            fetchDetailProduct(itemId);
        }
    }, []);

    const fetchDetailProduct = async (id: string) => {
        try {
            const productDetail = await ApiService.getProductDetail(id);
            setProductDetail(productDetail.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMethod(event.target.value as PaymentMethod);
    };

    return (
        <>
            <div className="flex justify-content-center">
            <div className="col-12 md:col-4 main-form">
                <div className="flex product">
                    <div className="col-3">
                        <img
                            style={{ width: "100%" }}
                            src={productDetail?.img}
                            alt={productDetail?.name}
                        />
                    </div>
                    <div className="col-6">
                        <div>{productDetail?.name}</div>
                    </div>
                    <div className="col-3 text-right">
                        <span>{productDetail?.salePrice.toLocaleString("vi-VN")}đ</span>
                    </div>
                </div>
                <div className="grid user-info">
                    <div className="col-12">
                        <div>Họ và tên *</div>
                        <InputText
                            className="w-full"
                            placeholder="Họ tên của bạn"
                        />
                    </div>
                    <div className="col-12 md:col-6">
                        <div>Số điện thoại *</div>
                        <InputText
                            className="w-full"
                            placeholder="Số điện thoại của bạn"
                        />
                    </div>
                    <div className="col-12 md:col-6">
                        <div>Email</div>
                        <InputText
                            className="w-full"
                            placeholder="Email của bạn"
                        />
                    </div>
                    <div className="col-12 md:col-6">
                        <div>Tỉnh/Thành phố *</div>
                        <InputText
                            className="w-full"
                            placeholder="Tỉnh/Thành Phố"
                        />
                    </div>
                    <div className="col-12 md:col-6">
                        <div>Quận/Huyện *</div>
                        <InputText
                            className="w-full"
                            placeholder="Quận/Huyện"
                        />
                    </div>
                    <div className="col-12 md:col-6">
                        <div>Xã/Phường *</div>
                        <InputText
                            className="w-full"
                            placeholder="Xã/Phường"
                        />
                    </div>
                    <div className="col-12 md:col-6">
                        <div>Địa chỉ *</div>
                        <InputText
                            className="w-full"
                            placeholder="Địa chỉ của bạn"
                        />
                    </div>
                    <div className="col-12">
                        <div>Ghi chú</div>
                        <InputTextarea
                            className="w-full"
                        />
                    </div>
                </div>
                <div className="overview">
                    <div className="flex justify-content-between">
                        <span>Tạm tính:</span>
                        <span>{productDetail?.salePrice.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <hr></hr>
                    <div className="flex justify-content-between total">
                        <span>Tổng:</span>
                        <span>{productDetail?.salePrice.toLocaleString("vi-VN")}đ</span>
                    </div>
                </div>
                <div className="method">
                    <div className="options option-1">
                        <input
                            type="radio"
                            id={PaymentMethod.BankTransfer}
                            name="payment"
                            value={PaymentMethod.BankTransfer}
                            onChange={handleRadioChange}
                            checked={selectedMethod === PaymentMethod.BankTransfer}
                        />
                        <label htmlFor={PaymentMethod.BankTransfer}>Chuyển khoản ngân hàng</label>
                        {selectedMethod === PaymentMethod.BankTransfer && (
                            <div className="description">
                                Quý khách vui lòng chuyển tiền đến tài khoản của chúng tôi <br></br>
                                Ngân hàng: MB Bank - 896667898888 - NGUYEN TUAN DUNG <br></br>
                            </div>
                        )}
                    </div>
                    <div className="options option-2">
                        <input
                            type="radio"
                            id={PaymentMethod.CheckPayment}
                            name="payment"
                            value={PaymentMethod.CheckPayment}
                            onChange={handleRadioChange}
                            checked={selectedMethod === PaymentMethod.CheckPayment}
                        />
                        <label htmlFor={PaymentMethod.CheckPayment}>Kiểm tra thanh toán</label>
                        {selectedMethod === PaymentMethod.CheckPayment && (
                            <div className="description">
                                Quý khách vui lòng chuyển tiền đặt cọc <span className="text-red-500">50.000đ</span> đến tài khoản của chúng tôi <br></br>
                                Ngân hàng: MB Bank - 896667898888 - NGUYEN TUAN DUNG <br></br>
                            </div>
                        )}
                    </div>
                    <div className="options option-2">
                        <input
                            type="radio"
                            id={PaymentMethod.CashPayment}
                            name="payment"
                            value={PaymentMethod.CashPayment}
                            onChange={handleRadioChange}
                            checked={selectedMethod === PaymentMethod.CashPayment}
                        />
                        <label htmlFor={PaymentMethod.CashPayment}>Trả tiền mặt khi nhận hàng</label>
                        {selectedMethod === PaymentMethod.CashPayment && (
                            <div className="description">
                                Quý khách vui lòng chuyển tiền đặt cọc <span className="text-red-500">50.000đ</span> đến tài khoản của chúng tôi <br></br>
                                Ngân hàng: MB Bank - 896667898888 - NGUYEN TUAN DUNG <br></br>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-content-center">
                    <div className="col-8 md:col-5 order">
                        <Button label="Đặt hàng" className="w-full" />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Payment;
