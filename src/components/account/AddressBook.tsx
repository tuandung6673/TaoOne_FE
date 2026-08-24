import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { Address } from "../../constants/interface";
import ApiService from "../../services/api.service";
import VietnamUnitService from "../../services/vietnam_unit.service";
import "./AddressBook.scss";

interface LocationOption {
    label: string;
    value: number;
}

function AddressBook() {
    const toast = useRef<Toast>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<Address>(new Address());

    const [cityList, setCityList] = useState<LocationOption[]>([]);
    const [selectCity, setSelectCity] = useState<number>();
    const [districtList, setDistrictList] = useState<LocationOption[]>([]);
    const [selectDistrict, setSelectDistrict] = useState<number>();
    const [wardList, setWardList] = useState<LocationOption[]>([]);
    const [selectWard, setSelectWard] = useState<number>();

    const fetchAddresses = useCallback(async () => {
        setLoading(true);
        try {
            const res = await ApiService.getAddressList();
            const data = res?.data?.data ?? res?.data ?? res ?? [];
            setAddresses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setAddresses([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const fetchCity = async () => {
        try {
            const listCity = await VietnamUnitService.getCity();
            const data: LocationOption[] = (listCity?.data || [])
                .map((city: any) => ({ label: city.name, value: city.code }))
                .sort((a: LocationOption, b: LocationOption) => a.label.localeCompare(b.label));
            setCityList(data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchDistrict = async (cityCode: number) => {
        try {
            const listDistrict = await VietnamUnitService.getProvice(cityCode);
            const data: LocationOption[] = listDistrict?.data?.districts?.map((district: any) => ({
                label: district.name,
                value: district.code,
            })) || [];
            setDistrictList(data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchWard = async (districtCode: number) => {
        try {
            const listWard = await VietnamUnitService.getDistrict(districtCode);
            const data: LocationOption[] = listWard?.data?.wards?.map((ward: any) => ({
                label: ward.name,
                value: ward.code,
            })) || [];
            setWardList(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCityChange = useCallback((option?: LocationOption) => {
        setSelectCity(option?.value);
        setSelectDistrict(undefined);
        setSelectWard(undefined);
        setDistrictList([]);
        setWardList([]);
        setForm((prev) => ({ ...prev, tp: option?.label || "", qh: "", px: "" }));
        if (option) {
            fetchDistrict(option.value);
        }
    }, []);

    const handleDistrictChange = useCallback((option?: LocationOption) => {
        setSelectDistrict(option?.value);
        setSelectWard(undefined);
        setWardList([]);
        setForm((prev) => ({ ...prev, qh: option?.label || "", px: "" }));
        if (option) {
            fetchWard(option.value);
        }
    }, []);

    const handleWardChange = useCallback((option?: LocationOption) => {
        setSelectWard(option?.value);
        setForm((prev) => ({ ...prev, px: option?.label || "" }));
    }, []);

    const openAddDialog = () => {
        setForm(new Address());
        setSelectCity(undefined);
        setSelectDistrict(undefined);
        setSelectWard(undefined);
        setDistrictList([]);
        setWardList([]);
        if (cityList.length === 0) {
            fetchCity();
        }
        setDialogVisible(true);
    };

    const handleSave = async () => {
        if (!form.receiver_name || !form.phone || !form.address) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ",
            });
            return;
        }

        setSaving(true);
        try {
            const response = await ApiService.postAddress(form);
            if (response?.status && response.status !== "success") {
                throw new Error(response.message || "save failed");
            }
            toast.current?.show({
                severity: "success",
                summary: "Thành công",
                detail: "Đã lưu địa chỉ",
            });
            setDialogVisible(false);
            fetchAddresses();
        } catch (error: any) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: error?.response?.data?.message || "Không thể lưu địa chỉ",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (id?: string) => {
        if (!id) return;
        confirmDialog({
            header: "Xác nhận",
            message: "Bạn muốn xóa địa chỉ này không ?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "Xóa",
            rejectLabel: "Hủy",
            accept: async () => {
                try {
                    await ApiService.deleteAddress(id);
                    toast.current?.show({
                        severity: "success",
                        summary: "Thành công",
                        detail: "Đã xóa địa chỉ",
                    });
                    fetchAddresses();
                } catch (error) {
                    toast.current?.show({
                        severity: "error",
                        summary: "Lỗi",
                        detail: "Không thể xóa địa chỉ",
                    });
                }
            },
        });
    };

    const handleSetDefault = async (id?: string) => {
        if (!id) return;
        try {
            const response = await ApiService.setDefaultAddress(id);
            if (response?.status && response.status !== "success") {
                throw new Error(response.message || "set default failed");
            }
            toast.current?.show({
                severity: "success",
                summary: "Thành công",
                detail: "Đã đặt làm địa chỉ mặc định",
            });
            fetchAddresses();
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không thể đặt địa chỉ mặc định",
            });
        }
    };

    return (
        <div className="address-book">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="address-book-header">
                <h2>Sổ địa chỉ</h2>
                <Button label="Thêm địa chỉ" icon="pi pi-plus" onClick={openAddDialog} />
            </div>

            {loading ? (
                <p className="address-book-loading">Đang tải...</p>
            ) : addresses.length === 0 ? (
                <div className="account-placeholder">
                    <i className="pi pi-map-marker"></i>
                    <h2>Chưa có địa chỉ nào</h2>
                    <p>Thêm địa chỉ giao hàng để đặt hàng nhanh hơn ở lần sau.</p>
                </div>
            ) : (
                <div className="address-book-list">
                    {addresses.map((addr) => (
                        <div className="address-card" key={addr.id}>
                            <div className="address-card-main">
                                <div className="address-card-info">
                                    <div className="address-card-name">
                                        {addr.receiver_name} · {addr.phone}
                                        {addr.is_default && (
                                            <span className="address-card-badge">Mặc định</span>
                                        )}
                                    </div>
                                    <div className="address-card-detail">
                                        {[addr.address, addr.px, addr.qh, addr.tp].filter(Boolean).join(", ")}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="address-card-delete"
                                    onClick={() => handleDelete(addr.id)}
                                    aria-label="Xóa địa chỉ"
                                >
                                    <i className="pi pi-trash"></i>
                                </button>
                            </div>
                            <div className="address-card-footer">
                                <Checkbox
                                    inputId={`default-${addr.id}`}
                                    checked={!!addr.is_default}
                                    disabled={!!addr.is_default}
                                    onChange={() => handleSetDefault(addr.id)}
                                />
                                <label htmlFor={`default-${addr.id}`}>Đặt làm địa chỉ mặc định</label>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog
                header="Thêm địa chỉ mới"
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                className="address-book-dialog"
            >
                <div className="address-form">
                    <div className="form-group">
                        <label>Họ tên</label>
                        <InputText name="receiver_name" value={form.receiver_name} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <InputText name="phone" value={form.phone} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Tỉnh/Thành phố</label>
                        <Dropdown
                            className="w-full"
                            value={selectCity}
                            options={cityList}
                            placeholder="Chọn tỉnh/thành phố"
                            emptyMessage="Không có dữ liệu"
                            onChange={(e) =>
                                handleCityChange(cityList.find((item) => item.value === e.value))
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>Quận/Huyện</label>
                        <Dropdown
                            className="w-full"
                            value={selectDistrict}
                            options={districtList}
                            placeholder="Chọn quận/huyện"
                            emptyMessage="Không có dữ liệu"
                            disabled={!selectCity}
                            onChange={(e) =>
                                handleDistrictChange(districtList.find((item) => item.value === e.value))
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>Phường/Xã</label>
                        <Dropdown
                            className="w-full"
                            value={selectWard}
                            options={wardList}
                            placeholder="Chọn phường/xã"
                            emptyMessage="Không có dữ liệu"
                            disabled={!selectDistrict}
                            onChange={(e) =>
                                handleWardChange(wardList.find((item) => item.value === e.value))
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ cụ thể</label>
                        <InputText name="address" value={form.address} onChange={handleInputChange} />
                    </div>
                    <div className="form-group form-group-checkbox">
                        <Checkbox
                            inputId="is_default"
                            checked={!!form.is_default}
                            onChange={(e) => setForm((prev) => ({ ...prev, is_default: !!e.checked }))}
                        />
                        <label htmlFor="is_default">Đặt làm địa chỉ mặc định</label>
                    </div>
                </div>
                <div className="address-form-actions">
                    <Button label="Hủy" className="p-button-outlined" onClick={() => setDialogVisible(false)} />
                    <Button label="Lưu địa chỉ" onClick={handleSave} loading={saving} />
                </div>
            </Dialog>
        </div>
    );
}

export default AddressBook;
