import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QrLogo from "../../images/qr-code.jpg";
import { ItemDetail, PaymentForm } from "../../constants/interface";
import ApiService from "../../services/api.service";
import "./payment.scss";

enum PaymentMethod {
    BankTransfer = "bankTransfer", //0
    CheckPayment = "checkPayment", //1
    CashPayment = "cashPayment",   //2
}

function Payment() {
    const [productDetail, setProductDetail] = useState<ItemDetail>();
    const [paymentForm, setPaymentForm] = useState<PaymentForm>({
        ...new PaymentForm(),
        payment_method: PaymentMethod.BankTransfer,
    });
    const [formError, setFormError] = useState<Partial<PaymentForm>>({});
    // const [quantity, setQuantity] = useState<number>(0);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
        PaymentMethod.BankTransfer
    );
    const { itemId } = useParams<{ itemId?: string }>();

    useEffect(() => {
        if (!!itemId) {
            fetchDetailProduct(itemId);
        }
    }, []);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setPaymentForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMethod(event.target.value as PaymentMethod);
        setPaymentForm((prev) => ({
            ...prev,
            payment_method: event.target.value,
        }));
    };

    const fetchDetailProduct = async (id: string) => {
        try {
            const prdDetail = await ApiService.getProductDetail(id);
            setProductDetail(prdDetail.data);
        } catch (error) {
            console.log(error);
        }
    };

    const validateForm = () => {
        const errors: Partial<PaymentForm> = {};
        if (!paymentForm.name) errors.name = "(*) Họ và tên là bắt buộc";
        if (!paymentForm.phone) errors.phone = "(*) Số điện thoại là bắt buộc";
        if (!paymentForm.tp) errors.tp = "(*) Tỉnh/Thành phố là bắt buộc";
        if (!paymentForm.qh) errors.qh = "(*) Quận/Huyện là bắt buộc";
        if (!paymentForm.px) errors.px = "(*) Xã/Phường là bắt buộc";
        if (!paymentForm.address) errors.address = "(*) Địa chỉ là bắt buộc";
        setFormError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        if(!!productDetail) {
            if (validateForm()) {
                // Xử lý logic đặt hàng ở đây
                console.log("Form data:", paymentForm);
            }
        } else {
            // Ngăn chặn ng dùng sửa id ko hợp lệ trên url rồi submit linh tinh
            console.log('Ma sp ko hop le');
        }
    };

    return (
        <>
            <div className="flex justify-content-center">
                <div className="sm-col-12 md:col-8 lg:col-6 xl:col-4 main-form">
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
                            <span>
                                {productDetail?.salePrice.toLocaleString(
                                    "vi-VN"
                                )}
                                đ
                            </span>
                        </div>
                    </div>
                    <div className="grid user-info">
                        <div className="col-12">
                            <div>Họ và tên *</div>
                            <InputText
                                className="w-full"
                                placeholder="Họ tên của bạn"
                                name="name"
                                value={paymentForm.name}
                                onChange={handleInputChange}
                            />
                            {formError.name && (
                                <div className="error">{formError.name}</div>
                            )}
                        </div>
                        <div className="col-12 md:col-6">
                            <div>Số điện thoại *</div>
                            <InputText
                                className="w-full"
                                placeholder="Số điện thoại của bạn"
                                name="phone"
                                value={paymentForm.phone}
                                onChange={handleInputChange}
                            />
                            {formError.phone && (
                                <div className="error">{formError.phone}</div>
                            )}
                        </div>
                        <div className="col-12 md:col-6">
                            <div>Email</div>
                            <InputText
                                className="w-full"
                                placeholder="Email của bạn"
                                name="email"
                                value={paymentForm.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <div>Tỉnh/Thành phố *</div>
                            <InputText
                                className="w-full"
                                placeholder="Tỉnh/Thành Phố"
                                name="tp"
                                value={paymentForm.tp}
                                onChange={handleInputChange}
                            />
                            {formError.tp && (
                                <div className="error">{formError.tp}</div>
                            )}
                        </div>
                        <div className="col-12 md:col-6">
                            <div>Quận/Huyện *</div>
                            <InputText
                                className="w-full"
                                placeholder="Quận/Huyện"
                                name="qh"
                                value={paymentForm.qh}
                                onChange={handleInputChange}
                            />
                            {formError.qh && (
                                <div className="error">{formError.qh}</div>
                            )}
                        </div>
                        <div className="col-12 md:col-6">
                            <div>Xã/Phường *</div>
                            <InputText
                                className="w-full"
                                placeholder="Xã/Phường"
                                name="px"
                                value={paymentForm.px}
                                onChange={handleInputChange}
                            />
                            {formError.px && (
                                <div className="error">{formError.px}</div>
                            )}
                        </div>
                        <div className="col-12 md:col-6">
                            <div>Địa chỉ *</div>
                            <InputText
                                className="w-full"
                                placeholder="Địa chỉ của bạn"
                                name="address"
                                value={paymentForm.address}
                                onChange={handleInputChange}
                            />
                            {formError.address && (
                                <div className="error">{formError.address}</div>
                            )}
                        </div>
                        <div className="col-12">
                            <div>Ghi chú</div>
                            <InputTextarea
                                className="w-full"
                                name="note"
                                value={paymentForm.note}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="overview">
                        <div className="flex justify-content-between">
                            <span>Tạm tính:</span>
                            <span>
                                {productDetail?.salePrice.toLocaleString(
                                    "vi-VN"
                                )}
                                đ
                            </span>
                        </div>
                        <hr></hr>
                        <div className="flex justify-content-between total">
                            <span>Tổng:</span>
                            <span>
                                {productDetail?.salePrice.toLocaleString(
                                    "vi-VN"
                                )}
                                đ
                            </span>
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
                                checked={
                                    selectedMethod ===
                                    PaymentMethod.BankTransfer
                                }
                            />
                            <label htmlFor={PaymentMethod.BankTransfer}>
                                Chuyển khoản ngân hàng
                            </label>
                            {selectedMethod === PaymentMethod.BankTransfer && (
                                <>
                                    <div className="description">
                                        Quý khách vui lòng chuyển tiền đến tài khoản
                                        của chúng tôi <br></br>
                                        Ngân hàng: MB Bank - 896667898888 - NGUYEN
                                        TUAN DUNG
                                    </div>
                                    <div className="qr-small text-center">
                                        <img src={QrLogo} alt="" />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="options option-2">
                            <input
                                type="radio"
                                id={PaymentMethod.CheckPayment}
                                name="payment"
                                value={PaymentMethod.CheckPayment}
                                onChange={handleRadioChange}
                                checked={
                                    selectedMethod ===
                                    PaymentMethod.CheckPayment
                                }
                            />
                            <label htmlFor={PaymentMethod.CheckPayment}>
                                Kiểm tra thanh toán
                            </label>
                            {selectedMethod === PaymentMethod.CheckPayment && (
                                <>
                                    <div className="description">
                                        Quý khách vui lòng chuyển tiền đặt cọc{" "}
                                        <span className="text-red-500">
                                            500.000đ
                                        </span>{" "}
                                        đến tài khoản của chúng tôi <br></br>
                                        Ngân hàng: MB Bank - 896667898888 - NGUYEN
                                        TUAN DUNG
                                    </div>
                                    <div className="qr-small text-center">
                                        <img src={QrLogo} alt="" />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="options option-2">
                            <input
                                type="radio"
                                id={PaymentMethod.CashPayment}
                                name="payment"
                                value={PaymentMethod.CashPayment}
                                onChange={handleRadioChange}
                                checked={
                                    selectedMethod === PaymentMethod.CashPayment
                                }
                            />
                            <label htmlFor={PaymentMethod.CashPayment}>
                                Trả tiền mặt khi nhận hàng
                            </label>
                            {selectedMethod === PaymentMethod.CashPayment && (
                                <>
                                    <div className="description">
                                        Quý khách vui lòng chuyển tiền đặt cọc{" "}
                                        <span className="text-red-500">
                                            500.000đ
                                        </span>{" "}
                                        đến tài khoản của chúng tôi <br></br>
                                        Ngân hàng: MB Bank - 896667898888 - NGUYEN
                                        TUAN DUNG
                                    </div>
                                    <div className="qr-small text-center">
                                        <img src={QrLogo} alt="" />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-content-center">
                        <div className="col-8 md:col-5 order">
                            <Button
                                label="Đặt hàng"
                                className="w-full"
                                onClick={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="qr-code">
                <img src={QrLogo} alt=""/>
            </div>
        </>
    );
}

export default Payment;
