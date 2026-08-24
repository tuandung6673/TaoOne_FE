import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { BANK_INFO, TIEN_COC } from "../../constants/constants";
import { Address, CartItem, ItemDetail, PaymentForm } from "../../constants/interface";
import { useAuth } from "../../custom-hook/useAuth";
import { useCart } from "../../custom-hook/CartContext";
import { useVoucher } from "../../custom-hook/VoucherContext";
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

interface LocationOption {
    label: string;
    value: number;
    divisionType?: string;
}

function Payment() {
    const [queryParams] = useSearchParams();
    const sizeOneItemSelected = queryParams.get('size');
    const [cityList, setCityList] = useState<LocationOption[]>([]);
    const [selectCity, setSelectCity] = useState<number>();
    const [proviceList, setProviceList] = useState<LocationOption[]>([]);
    const [selectProvice, setSelectProvice] = useState<number>();
    const [districtList, setDistrictList] = useState<LocationOption[]>([]);
    const [selectDistrict, setSelectDistrict] = useState<number>();
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
    const { isLoggedIn } = useAuth();
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>();
    const { itemId } = useParams<{ itemId?: string }>();
    const { cartItems, clearCart } = useCart();
    const { appliedCode, discountAmount, applyVoucher, clearVoucher } = useVoucher();
    const isCartFlow = !itemId;
    const cartRawTotal = cartItems?.reduce((sum, it) => sum + it.salePrice * it.quantity, 0) || 0;
    const rawTotal = isCartFlow ? cartRawTotal : (productDetail?.salePrice || 0);
    const appliedDiscount = isCartFlow ? discountAmount : 0;
    const finalTotal = Math.max(rawTotal - appliedDiscount, 0);

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
        if (isLoggedIn) {
            fetchSavedAddresses();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sizeOneItemSelected]);

    const handleInputChange = useCallback((
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setPaymentForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handlePhoneBlur = useCallback(async () => {
        if (isCartFlow && appliedCode && paymentForm.phone) {
            await applyVoucher(appliedCode, paymentForm.phone);
        }
    }, [isCartFlow, appliedCode, paymentForm.phone, applyVoucher]);

    const handleClearCart = useCallback(() => {
        setTimeout(() => {
            clearCart();
        }, 500);
    }, [clearCart]);

    const fetchCity = async () => {
        try {
            const listCity = await VietnamUnitService.getCity();
            const data: LocationOption[] = listCity?.data
                .map((city: any) => ({
                    label: city.name,
                    value: city.code,
                    divisionType: city.division_type, // Thêm division_type để sử dụng
                }))
                .sort((a: LocationOption, b: LocationOption) => {
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
            return data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const fetchProvice = async (provice_code: number) => {
        try {
            const listProvice = await VietnamUnitService.getProvice(
                provice_code
            );
            const data: LocationOption[] = listProvice?.data?.districts?.map((provice: any) => ({
                label: provice.name,
                value: provice.code,
            })) || [];
            setProviceList(data);
            return data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const fetchDistrict = async (district_code: number) => {
        try {
            const listDistrict = await VietnamUnitService.getDistrict(
                district_code
            );
            let data: LocationOption[] = listDistrict?.data?.wards?.map((wards: any) => ({
                label: wards.name,
                value: wards.code,
            })) || [];
            if (data) {
                data = [...data, { label: '-Khác-', value: -1 }]
            }
            setDistrictList(data);
            return data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const fetchSavedAddresses = useCallback(async () => {
        try {
            const res = await ApiService.getAddressList();
            const data = res?.data?.data ?? res?.data ?? res ?? [];
            const list: Address[] = Array.isArray(data) ? data : [];
            setSavedAddresses(list);
            const defaultAddress = list.find((addr) => addr.is_default) || list[0];
            if (defaultAddress) {
                applySavedAddress(defaultAddress);
            }
        } catch (error) {
            console.log(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const applySavedAddress = useCallback(async (addr: Address) => {
        setSelectedAddressId(addr.id);
        setFormError({});
        setPaymentForm((prev) => ({
            ...prev,
            name: addr.receiver_name,
            phone: addr.phone,
            tp: addr.tp,
            qh: addr.qh,
            px: addr.px,
            address: addr.address,
        }));

        setSelectProvice(undefined);
        setSelectDistrict(undefined);
        setProviceList([]);
        setDistrictList([]);

        try {
            const cities = await fetchCity();
            const cityMatch = cities?.find((c) => c.label === addr.tp);
            setSelectCity(cityMatch?.value);
            if (!cityMatch) return;

            const districts = await fetchProvice(cityMatch.value);
            const districtMatch = districts?.find((d) => d.label === addr.qh);
            setSelectProvice(districtMatch?.value);
            if (!districtMatch) return;

            const wards = await fetchDistrict(districtMatch.value);
            const wardMatch = wards?.find((w) => w.label === addr.px);
            setSelectDistrict(wardMatch?.value);
        } catch (error) {
            console.log(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUseNewAddress = useCallback(() => {
        setSelectedAddressId(undefined);
        setFormError({});
        setPaymentForm((prev) => ({
            ...prev,
            name: "",
            phone: "",
            tp: "",
            qh: "",
            px: "",
            address: "",
        }));
        setSelectCity(undefined);
        setSelectProvice(undefined);
        setSelectDistrict(undefined);
        setProviceList([]);
        setDistrictList([]);
    }, []);

    const handleCityChange = useCallback((option?: LocationOption) => {
        if (option) {
            setSelectCity(option.value);
            setPaymentForm((prev) => ({
                ...prev,
                tp: option.label,
            }));
            setDistrictList([]);
        }
        fetchProvice(option?.value ?? 0);
    }, []);

    const handleProvideChange = useCallback((option?: LocationOption) => {
        if (option) {
            setSelectProvice(option.value);
            setPaymentForm((prev) => ({
                ...prev,
                qh: option.label,
            }));
        }
        fetchDistrict(option?.value ?? 0);
    }, []);

    const handleDistrictChange = useCallback((option?: LocationOption) => {
        if (option) {
            setSelectDistrict(option.value);
            setPaymentForm((prev) => ({
                ...prev,
                px: option.label,
            }));
        }
    }, []);

    const handleRadioChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMethod(event.target.value as PaymentMethod);
        setPaymentForm((prev) => ({
            ...prev,
            payment_method: event.target.value,
        }));
    }, []);

    const fetchDetailProduct = async (id: string) => {
        try {
            const prdDetail = await ApiService.getProductDetail(id);
            if (!prdDetail.data) {
                toast.current?.show({
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
                const voucherLine = appliedCode
                    ? `\n\n- Voucher: ${appliedCode} (-${appliedDiscount.toLocaleString("vi-VN")}đ)\n- Thành tiền sau giảm: ${Math.max(total - appliedDiscount, 0).toLocaleString("vi-VN")}đ`
                    : "";
                caption = `- Đơn hàng nhiều sản phẩm:\n${itemsText}\n\n- Tổng: ${total.toLocaleString("vi-VN")}đ${voucherLine}\n\n- KH: ${formData?.name} - ${formData?.phone}\n\n- Địa chỉ: ${formData?.address}, ${formData?.px}, ${formData?.qh}, ${formData?.tp}\n\n- Ghi chú: ${formData?.note}\n\n(${formData?.payment_method == "bankTransfer" ? "Chuyển khoản full" : "Ship COD"})`;
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
                if (response.status === "success") {
                    toast.current?.show({
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
                toast.current?.show({
                    severity: "warn",
                    summary: "Thông báo",
                    detail: "Giỏ hàng trống!",
                });
                return;
            }

            const submitOrder = async (voucherCodeToSend: string | null) => {
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
                data.voucher_code = voucherCodeToSend;
                try {
                    const response = await ApiService.postPayment(data);
                    if (response.status === "success") {
                        toast.current?.show({
                            severity: "success",
                            summary: "Thành công",
                            detail: "Đặt hàng thành công !",
                        });
                    }
                    setShowThankYou(true);
                    sendTeleMessage(data, undefined, cartItems);
                    clearVoucher();
                    handleClearCart();
                } catch (error: any) {
                    toast.current?.show({
                        severity: "error",
                        summary: "Đặt hàng không thành công",
                        detail: error?.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.",
                    });
                }
            };

            // Xác nhận lại lượt dùng chính xác cho khách này trước khi cho đặt hàng.
            if (appliedCode) {
                const codeAttempted = appliedCode;
                const outcome = await applyVoucher(codeAttempted, paymentForm.phone);
                if (!outcome.valid) {
                    confirmDialog({
                        header: "Mã giảm giá không áp dụng được",
                        message: `${outcome.message || `Mã "${codeAttempted}" hiện không thể áp dụng.`} Đơn hàng sẽ giữ nguyên giá gốc (không được giảm giá). Bạn có muốn tiếp tục đặt hàng không?`,
                        icon: "pi pi-exclamation-triangle",
                        acceptLabel: "Tiếp tục đặt hàng",
                        rejectLabel: "Hủy",
                        accept: () => submitOrder(null),
                    });
                    return;
                }
                await submitOrder(codeAttempted);
                return;
            }

            await submitOrder(null);
        }
    };

    return (
        <>
            <Toast ref={toast} position="top-right" />
            <ConfirmDialog />
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
                                    <div className="font-medium">{productDetail?.name}{sizeOneItemSelected ? ` - ${decodeURIComponent(sizeOneItemSelected)}` : ""}</div>
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
                        {isLoggedIn && savedAddresses.length > 0 && (
                            <div className="pm-saved-address">
                                <div className="pm-saved-address__title">Địa chỉ giao hàng đã lưu</div>
                                <div className="pm-saved-address__list">
                                    {savedAddresses.map((addr) => (
                                        <button
                                            type="button"
                                            key={addr.id}
                                            className={`pm-saved-address__chip ${selectedAddressId === addr.id ? "pm-saved-address__chip--active" : ""}`}
                                            onClick={() => applySavedAddress(addr)}
                                        >
                                            <div className="pm-saved-address__name">
                                                {addr.receiver_name} · {addr.phone}
                                                {addr.is_default && (
                                                    <span className="pm-saved-address__badge">Mặc định</span>
                                                )}
                                            </div>
                                            <div className="pm-saved-address__detail">
                                                {[addr.address, addr.px, addr.qh, addr.tp].filter(Boolean).join(", ")}
                                            </div>
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        className={`pm-saved-address__chip pm-saved-address__chip--new ${!selectedAddressId ? "pm-saved-address__chip--active" : ""}`}
                                        onClick={handleUseNewAddress}
                                    >
                                        <i className="pi pi-plus"></i> Nhập địa chỉ mới
                                    </button>
                                </div>
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
                                    onBlur={handlePhoneBlur}
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
                                            cityList.find((item) => item.value === e.value)
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
                                            proviceList.find((item) => item.value === e.value)
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
                                            districtList.find((item) => item.value === e.value)
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
                                <span>{rawTotal.toLocaleString("vi-VN")}đ</span>
                            </div>
                            <div className="flex justify-content-between mt-1">
                                <span>Phí vận chuyển:</span>
                                <span>
                                    Miễn phí
                                </span>
                            </div>
                            <div className="flex justify-content-between mt-1">
                                <span>Tổng số lượng:</span>
                                <span>{!!itemId && productDetail ? 1 : cartItems?.reduce((count, it) => count + it.quantity, 0) || 0}</span>
                            </div>
                            {isCartFlow && appliedCode && (
                                <div className="flex justify-content-between mt-1 voucher-discount-line">
                                    <span>Giảm giá ({appliedCode}):</span>
                                    <span>-{appliedDiscount.toLocaleString("vi-VN")}đ</span>
                                </div>
                            )}
                            <hr></hr>
                            <div className="flex justify-content-between total">
                                <span>Tổng tiền:</span>
                                <span>{finalTotal.toLocaleString("vi-VN")}đ</span>
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
                                                Quý khách vui lòng chuyển tiền <span className="text-red-500">{finalTotal.toLocaleString("vi-VN")}</span> đến
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
