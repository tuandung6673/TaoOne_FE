import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { BANK_INFO, TIEN_COC } from "../../constants/constants";
import { CartItem, ItemDetail, PaymentForm } from "../../constants/interface";
import { useCart } from "../../custom-hook/CartContext";
import QrLogo from "../../images/qr-code.jpg";
import ApiService from "../../services/api.service";
import TelebotService from "../../services/telebot.service";
import VietnamUnitService from "../../services/vietnam_unit.service";
import ThankYou from "../thank-you/ThankYou";
import "./payment.scss";

enum PaymentMethod {
    BankTransfer = "bankTransfer", //0
    CheckPayment = "checkPayment", //1
    CashPayment = "cashPayment", //2
}

function Payment() {
    const [queryParams] = useSearchParams();
    const sizeOneItemSelected = queryParams.get('size');
    const [cityList, setCityList] = useState([]);
    const [selectCity, setSelectCity] = useState();
    const [proviceList, setProviceList] = useState([]);
    const [selectProvice, setSelectProvice] = useState();
    const [districtList, setDistrictList] = useState([]);
    const [selectDistrict, setSelectDistrict] = useState();
    const [showThankYou, setShowThankYou] = useState(false);
    const toast = useRef<Toast>(null);
    const [productDetail, setProductDetail] = useState<ItemDetail>();
    const [paymentForm, setPaymentForm] = useState<PaymentForm>({
        ...new PaymentForm(),
        payment_method: PaymentMethod.CheckPayment,
    });
    const [formError, setFormError] = useState<Partial<PaymentForm>>({});
    // const [quantity, setQuantity] = useState<number>(0);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
        PaymentMethod.CheckPayment
    );
    const { itemId } = useParams<{ itemId?: string }>();
    const { cartItems, clearCart } = useCart();

    useEffect(() => {
        // Scroll to top when Payment screen loads
        try {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        } catch (e) {
            // Fallback for environments without window or older browsers
            if (typeof window !== "undefined" && window.scrollTo) {
                window.scrollTo(0, 0);
            }
        }
        if (!!itemId) {
            fetchDetailProduct(itemId);
        }
        fetchCity();
    }, [sizeOneItemSelected]);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setPaymentForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleClearCart = () => {
        setTimeout(() => {
            clearCart();
        }, 500);
    };

    const fetchCity = async () => {
        try {
            const listCity = await VietnamUnitService.getCity();
            const data = listCity?.data
                .map((city: any) => ({
                    label: city.name,
                    value: city.code,
                    divisionType: city.division_type, // Thêm division_type để sử dụng
                }))
                .sort((a: any, b: any) => {
                    // Ưu tiên "thành phố trung ương" lên trước
                    if (
                        a.divisionType === "thành phố trung ương" &&
                        b.divisionType !== "thành phố trung ương"
                    ) {
                        return -1;
                    }
                    if (
                        a.divisionType !== "thành phố trung ương" &&
                        b.divisionType === "thành phố trung ương"
                    ) {
                        return 1;
                    }

                    // Nếu cả hai cùng là "thành phố trung ương", sắp xếp theo value (số)
                    if (
                        a.divisionType === "thành phố trung ương" &&
                        b.divisionType === "thành phố trung ương"
                    ) {
                        return a.value - b.value;
                    }

                    // Nếu cả hai cùng là "tỉnh", sắp xếp theo label (chuỗi)
                    return a.label.localeCompare(b.label);
                });
            setCityList(data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchProvice = async (provice_code: any) => {
        try {
            const listProvice = await VietnamUnitService.getProvice(
                provice_code
            );
            const data = listProvice?.data?.districts?.map((provice: any) => ({
                label: provice.name,
                value: provice.code,
            }));
            setProviceList(data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchDistrict = async (district_code: any) => {
        try {
            const listDistrict = await VietnamUnitService.getDistrict(
                district_code
            );
            let data = listDistrict?.data?.wards?.map((wards: any) => ({
                label: wards.name,
                value: wards.code,
            }));
            if (data) {
                data = [...data, { label: '-Khác-', value: -1 }]
            }
            setDistrictList(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCityChange = (e: any) => {
        if (e) {
            setSelectCity(e.value);
            setPaymentForm((prev) => ({
                ...prev,
                tp: e.label,
            }));
            setDistrictList([]);
        }
        fetchProvice(e.value);
    };

    const handleProvideChange = (e: any) => {
        if (e) {
            setSelectProvice(e.value);
            setPaymentForm((prev) => ({
                ...prev,
                qh: e.label,
            }));
        }
        fetchDistrict(e.value);
    };

    const handleDistrictChange = (e: any) => {
        if (e) {
            setSelectDistrict(e.value);
            setPaymentForm((prev) => ({
                ...prev,
                px: e.label,
            }));
        }
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
            if (!prdDetail.data && toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Thông báo",
                    detail: "Mã sản phẩm không hợp lệ !",
                });
            }
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
        if (!paymentForm.px) errors.px = "(*) Phường/Xã là bắt buộc";
        if (!paymentForm.address) errors.address = "(*) Địa chỉ là bắt buộc";
        setFormError(errors);
        return Object.keys(errors).length === 0;
    };

    const sendTeleMessage = async (
        formData: PaymentForm,
        singleProduct?: ItemDetail,
        multiProducts?: CartItem[]
    ) => {
        try {
            let photoUrl = singleProduct?.img || multiProducts?.[0]?.img;
            let caption = "";
            if (singleProduct) {
                caption = `- Model: ${singleProduct?.name} - ${sizeOneItemSelected}\n\n- KH: ${formData?.name} - ${formData?.phone}\n\n- Địa chỉ: ${formData?.address}, ${formData?.px}, ${formData?.qh}, ${formData?.tp}\n\n- Ghi chú: ${formData?.note}\n\n- Giá bán: ${singleProduct?.salePrice.toLocaleString("vi-VN")} (${formData?.payment_method == "bankTransfer" ? "Chuyển khoản full" : "Ship COD"})`;
            } else if (multiProducts && multiProducts.length > 0) {
                const itemsText = multiProducts
                    .map((it) => `• ${it.name} - ${it.size} (x${it.quantity}) = ${(it.salePrice * it.quantity).toLocaleString("vi-VN")}đ`)
                    .join("\n");
                const total = multiProducts.reduce((sum, it) => sum + it.salePrice * it.quantity, 0);
                caption = `- Đơn hàng nhiều sản phẩm:\n${itemsText}\n\n- Tổng: ${total.toLocaleString("vi-VN")}đ\n\n- KH: ${formData?.name} - ${formData?.phone}\n\n- Địa chỉ: ${formData?.address}, ${formData?.px}, ${formData?.qh}, ${formData?.tp}\n\n- Ghi chú: ${formData?.note}\n\n(${formData?.payment_method == "bankTransfer" ? "Chuyển khoản full" : "Ship COD"})`;
            }
            await TelebotService.postPhoto(photoUrl, caption);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const data: any = { ...paymentForm };
        if (!data.date) {
            delete data.date;
        }
        const payment_id = uuidv4();
        data.id = payment_id;
        // Single product (from URL)
        if (!!itemId && !!productDetail) {
            data.products = [{
                payment_id: payment_id,
                product_id: itemId,
                product_name: productDetail.name || "",
                img: productDetail.img || "",
                quantity: 1,
                price: productDetail.price || 0,
                salePrice: productDetail.salePrice || 0,
                size: sizeOneItemSelected || ""
            }];
            data.total_bill = productDetail.salePrice;
            try {
                const response = await ApiService.postPayment(data);
                if (response.status === "success" && toast.current) {
                    toast.current.show({
                        severity: "success",
                        summary: "Thành công",
                        detail: "Đặt hàng thành công !",
                    });
                }
                setShowThankYou(true);
                sendTeleMessage(data, productDetail);
            } catch (error) {
                console.log(error);
            }
            return;
        }

        // Multiple products (from cart)
        if (!itemId) {
            if (!cartItems || cartItems.length === 0) {
                if (toast.current) {
                    toast.current.show({
                        severity: "warn",
                        summary: "Thông báo",
                        detail: "Giỏ hàng trống!",
                    });
                }
                return;
            }

            const total = cartItems.reduce((sum, it) => sum + it.salePrice * it.quantity, 0);
            data.products = cartItems.map((it) => ({
                payment_id: payment_id,
                product_id: it.id,
                product_name: it.name,
                img: it.img,
                quantity: it.quantity,
                price: it.price || 0,
                salePrice: it.salePrice || 0,
                size: it.size || ""
            }));
            data.total_bill = total;
            // console.log(data);
            try {
                const response = await ApiService.postPayment(data);
                if (response.status === "success" && toast.current) {
                    toast.current.show({
                        severity: "success",
                        summary: "Thành công",
                        detail: "Đặt hàng thành công !",
                    });
                }
                setShowThankYou(true);
                sendTeleMessage(data, undefined, cartItems);
                handleClearCart();
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <>
            <Toast ref={toast} position="top-right" />
            {showThankYou ? (
                <ThankYou paymentForm={paymentForm} />
            ) : (
                <div className="flex justify-content-center">
                    <div className="sm-col-12 md:col-8 lg:col-6 xl:col-4 main-form">
                        {!!itemId && productDetail && (
                            <div className="flex pm-product">
                                <div className="col-3 pm-product__img">
                                    <img
                                        src={productDetail?.img}
                                        alt={productDetail?.name}
                                    />
                                </div>
                                <div className="col-6 pm-product__name">
                                    <div className="font-medium">{productDetail?.name}{sizeOneItemSelected ? ` - ${sizeOneItemSelected}` : ""}</div>
                                </div>
                                <div className="text-right font-bold pm-product__price">
                                    <span>
                                        {productDetail?.salePrice.toLocaleString(
                                            "vi-VN"
                                        )}
                                        đ
                                    </span>
                                </div>
                            </div>
                        )}
                        {!itemId && cartItems && cartItems.length > 0 && (
                            <div>
                                {cartItems.map((it) => (
                                    <div className="flex pm-product" key={it.id + "_" + it.size}>
                                        <div className="col-3 p-0 pm-product__img">
                                            <img src={it.img} alt={it.name} />
                                        </div>
                                        <div className="col-6 pm-product__name">
                                            <div className="font-medium">{it.name}{it.size ? ` - ${it.size}` : ""}</div>
                                            <div className="mt-1 text-sm">
                                                <div>Đơn giá: {it.salePrice.toLocaleString("vi-VN")}đ</div>
                                                <div>SL: {it.quantity}</div>
                                            </div>
                                        </div>
                                        <div className="text-right font-bold pm-product__price">
                                            {(it.salePrice * it.quantity).toLocaleString("vi-VN")}đ
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                                    <div className="error">
                                        {formError.name}
                                    </div>
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
                                    <div className="error">
                                        {formError.phone}
                                    </div>
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
                                {/* <InputText
                                    className="w-full"
                                    placeholder="Tỉnh/Thành Phố"
                                    name="tp"
                                    value={paymentForm.tp}
                                    onChange={handleInputChange}
                                /> */}
                                <Dropdown
                                    className="w-full"
                                    value={selectCity}
                                    options={cityList}
                                    placeholder="Chọn thành phố"
                                    emptyMessage="Không có dữ liệu"
                                    onChange={(e) =>
                                        handleCityChange(
                                            cityList.filter(
                                                (item: any) =>
                                                    item.value === e.value
                                            )[0]
                                        )
                                    }
                                />
                                {formError.tp && (
                                    <div className="error">{formError.tp}</div>
                                )}
                            </div>
                            <div className="col-12 md:col-6">
                                <div>Quận/Huyện *</div>
                                <Dropdown
                                    className="w-full"
                                    value={selectProvice}
                                    options={proviceList}
                                    placeholder="Chọn quận/huyện"
                                    emptyMessage="Không có dữ liệu"
                                    onChange={(e) =>
                                        handleProvideChange(
                                            proviceList.filter(
                                                (item: any) =>
                                                    item.value === e.value
                                            )[0]
                                        )
                                    }
                                />
                                {formError.qh && (
                                    <div className="error">{formError.qh}</div>
                                )}
                            </div>
                            <div className="col-12 md:col-6">
                                <div>Phường/Xã *</div>
                                <Dropdown
                                    className="w-full"
                                    value={selectDistrict}
                                    options={districtList}
                                    placeholder="Chọn phường/xã"
                                    emptyMessage="Không có dữ liệu"
                                    onChange={(e) =>
                                        handleDistrictChange(
                                            districtList.filter(
                                                (item: any) =>
                                                    item.value === e.value
                                            )[0]
                                        )
                                    }
                                />
                                {formError.px && (
                                    <div className="error">{formError.px}</div>
                                )}
                            </div>
                            <div className="col-12 md:col-6">
                                <div>Địa chỉ (cũ) *</div>
                                <InputText
                                    className="w-full"
                                    placeholder="Địa chỉ của bạn"
                                    name="address"
                                    value={paymentForm.address}
                                    onChange={handleInputChange}
                                />
                                {formError.address && (
                                    <div className="error">
                                        {formError.address}
                                    </div>
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
                                <span>Tiền hàng (tạm tính):</span>
                                <span>
                                    {!!itemId && productDetail
                                        ? productDetail?.salePrice.toLocaleString("vi-VN")
                                        : (cartItems?.reduce((sum, it) => sum + it.salePrice * it.quantity, 0) || 0).toLocaleString("vi-VN")}
                                    đ
                                </span>
                            </div>
                            <div className="flex justify-content-between mt-1">
                                <span>Phí vận chuyển:</span>
                                <span>
                                    Miễn phí
                                </span>
                            </div>
                            <div className="flex justify-content-between mt-1">
                                <span>Tổng số lượng:</span>
                                <span>{cartItems?.reduce((count, it) => count + it.quantity, 0) || 0}</span>
                            </div>
                            <hr></hr>
                            <div className="flex justify-content-between total">
                                <span>Tổng tiền:</span>
                                <span>
                                    {!!itemId && productDetail
                                        ? productDetail?.salePrice.toLocaleString("vi-VN")
                                        : (cartItems?.reduce((sum, it) => sum + it.salePrice * it.quantity, 0) || 0).toLocaleString("vi-VN")}
                                    đ
                                </span>
                            </div>
                        </div>
                        <div className="method">
                            <div className="options option-1">
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
                                {selectedMethod ===
                                    PaymentMethod.CheckPayment && (
                                        <>
                                            <div className="description">
                                                Quý khách vui lòng chuyển tiền đặt
                                                cọc{" "}
                                                <span className="text-red-500">
                                                    {TIEN_COC}đ
                                                </span>{" "}
                                                đến tài khoản của chúng tôi{" "}
                                                <br></br>
                                                Ngân hàng: {BANK_INFO.name} -{" "}
                                                {BANK_INFO.number} -{" "}
                                                {BANK_INFO.owner}
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
                                {selectedMethod ===
                                    PaymentMethod.BankTransfer && (
                                        <>
                                            <div className="description">
                                                Quý khách vui lòng chuyển tiền <span className="text-red-500">{((!!itemId && productDetail) ? productDetail?.salePrice : (cartItems?.reduce((sum, it) => sum + it.salePrice * it.quantity, 0) || 0)).toLocaleString("vi-VN")}</span> đến
                                                tài khoản của chúng tôi <br></br>
                                                Ngân hàng: {BANK_INFO.name} - {BANK_INFO.number} - {BANK_INFO.owner}
                                            </div>
                                            <div className="qr-small text-center">
                                                <img src={QrLogo} alt="" />
                                            </div>
                                        </>
                                    )}
                            </div>
                            {/* <div className="options option-2">
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
                                                {TIEN_COC}đ
                                            </span>{" "}
                                            đến tài khoản của chúng tôi <br></br>
                                            Ngân hàng: {BANK_INFO.name} - {BANK_INFO.number} -
                                            {BANK_INFO.owner}
                                        </div>
                                        <div className="qr-small text-center">
                                            <img src={QrLogo} alt="" />
                                        </div>
                                    </>
                                )}
                            </div> */}
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
            )}
            <div className="qr-code">
                <img src={QrLogo} alt="" />
            </div>
        </>
    );
}

export default Payment;
