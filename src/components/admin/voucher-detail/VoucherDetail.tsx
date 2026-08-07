import { addLocale } from "primereact/api";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Category, CategoryDetail, VoucherModel } from "../../../constants/interface";
import ApiService from "../../../services/api.service";
import "./VoucherDetail.scss";

const HOME_BREADCRUMB = { icon: "pi pi-home", url: "" };

addLocale("vi", {
    monthNames: [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ],
    monthNamesShort: [
        "Th1", "Th2", "Th3", "Th4", "Th5", "Th6",
        "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"
    ],
    dayNames: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
    dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    dayNamesMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    today: "Hôm nay",
    clear: "Xóa"
});

const formatDateParam = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

function VoucherDetail() {
    const navigate = useNavigate();
    const { voucherId } = useParams<{ voucherId?: string }>();
    const toast = useRef<Toast>(null);

    const breadcrumbItems = [{ label: "Voucher" }, { label: !!voucherId ? "Chỉnh sửa" : "Thêm mới" }];

    const [formData, setFormData] = useState<VoucherModel>(new VoucherModel());
    const [dateRange, setDateRange] = useState<(Date | null)[] | null>(null);

    const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
    const [detailsByCategory, setDetailsByCategory] = useState<Record<string, CategoryDetail[]>>({});
    const [selectedDetailsMap, setSelectedDetailsMap] = useState<Record<string, string[]>>({});

    const fetchCategoryOptions = useCallback(async () => {
        try {
            const res = await ApiService.getCategoryList(queryString.stringify({ filter: "" }));
            const data: Category[] = res?.data?.data ?? [];
            setCategoryOptions(data);
            return data;
        } catch (err) {
            setCategoryOptions([]);
            return [];
        }
    }, []);

    // CategoryDetail chỉ lọc được theo category_code — categoryId vẫn dùng làm key lưu trữ/submit.
    const fetchCategoryDetails = useCallback(async (categoryId: string, categoryCode: string) => {
        try {
            const res = await ApiService.getCategoryDetailList(queryString.stringify({ category_code: categoryCode }));
            setDetailsByCategory((prev) => ({ ...prev, [categoryId]: res?.data?.data ?? [] }));
        } catch (err) {
            setDetailsByCategory((prev) => ({ ...prev, [categoryId]: [] }));
        }
    }, []);

    const fetchVoucherDetail = useCallback(async (id: string, categoryList: Category[]) => {
        try {
            const res = await ApiService.getVoucherDetail(id);
            const detail: VoucherModel = res?.data ?? res;
            setFormData(detail);
            if (detail.start_date && detail.end_date) {
                setDateRange([new Date(detail.start_date), new Date(detail.end_date)]);
            }
            if (detail.apply_scope === "category" && Array.isArray(detail.categories)) {
                const catIds = detail.categories.map((c) => c.category_id);
                setSelectedCategoryIds(catIds);
                const detailsMap: Record<string, string[]> = {};
                detail.categories.forEach((c) => {
                    detailsMap[c.category_id] = (c.category_details ?? []).map((d) => d.category_detail_id);
                });
                setSelectedDetailsMap(detailsMap);
                catIds.forEach((catId) => {
                    const category = categoryList.find((c) => c.id === catId);
                    if (category?.code) {
                        fetchCategoryDetails(catId, category.code);
                    }
                });
            }
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không thể tải thông tin voucher",
                life: 2000
            });
        }
    }, [fetchCategoryDetails]);

    useEffect(() => {
        const init = async () => {
            const categories = await fetchCategoryOptions();
            if (voucherId) {
                await fetchVoucherDetail(voucherId, categories);
            }
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | CheckboxChangeEvent) => {
        const { name, checked, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name as string]: value != null ? value : checked ? 1 : 0
        }));
    }, []);

    const handleCategorySelectChange = useCallback((ids: string[]) => {
        setSelectedCategoryIds(ids);
        ids.forEach((catId) => {
            if (!detailsByCategory[catId]) {
                const category = categoryOptions.find((c) => c.id === catId);
                if (category?.code) {
                    fetchCategoryDetails(catId, category.code);
                }
            }
        });
        setSelectedDetailsMap((prev) => {
            const next: Record<string, string[]> = {};
            ids.forEach((catId) => {
                next[catId] = prev[catId] ?? [];
            });
            return next;
        });
    }, [detailsByCategory, categoryOptions, fetchCategoryDetails]);

    const toggleApplyAll = useCallback((categoryId: string, applyAll: boolean) => {
        setSelectedDetailsMap((prev) => ({
            ...prev,
            [categoryId]: applyAll ? [] : prev[categoryId] ?? []
        }));
    }, []);

    const toggleDetailChecked = useCallback((categoryId: string, detailId: string, checked: boolean) => {
        setSelectedDetailsMap((prev) => {
            const current = prev[categoryId] ?? [];
            const next = checked ? [...current, detailId] : current.filter((id) => id !== detailId);
            return { ...prev, [categoryId]: next };
        });
    }, []);

    const handleBack = useCallback(() => navigate(-1), [navigate]);

    const handleSubmit = useCallback(async () => {
        if (!formData.code.trim() || !formData.name.trim()) {
            toast.current?.show({
                severity: "warn",
                summary: "Thiếu thông tin",
                detail: "Vui lòng nhập Code và Tên voucher",
                life: 2000
            });
            return;
        }

        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            toast.current?.show({
                severity: "warn",
                summary: "Thiếu thông tin",
                detail: "Vui lòng chọn thời gian hiệu lực",
                life: 2000
            });
            return;
        }

        const data: any = {
            ...formData,
            start_date: formatDateParam(dateRange[0]),
            end_date: formatDateParam(dateRange[1]),
            categories:
                formData.apply_scope === "category"
                    ? selectedCategoryIds.map((catId) => ({
                          category_id: catId,
                          category_details: (selectedDetailsMap[catId] ?? []).map((detailId) => ({
                              category_detail_id: detailId
                          }))
                      }))
                    : []
        };

        if (!voucherId) {
            delete data.id;
        }

        try {
            const response = await ApiService.postVoucher(data);
            if (response?.status === "success") {
                toast.current?.show({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Lưu voucher thành công",
                    life: 2000
                });
                navigate(-1);
            } else {
                throw new Error("save failed");
            }
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không thể lưu voucher. Vui lòng thử lại.",
                life: 2000
            });
        }
    }, [formData, dateRange, selectedCategoryIds, selectedDetailsMap, voucherId, navigate]);

    return (
        <div className="detail-wrapper voucher-detail-admin">
            <Toast ref={toast} />
            <div className="header">
                <BreadCrumb model={breadcrumbItems} home={HOME_BREADCRUMB} />
                <div className="header-main flex justify-content-between align-items-center">
                    {/* <div className="header-left main-title">{!!voucherId ? "Chỉnh sửa voucher" : "Thêm mới voucher"}</div> */}
                    <div className="flex">
                        <div className="cancel-btn mr-2">
                            <Button label="Hủy" className="p-button-outlined" style={{ height: "40px" }} onClick={handleBack} />
                        </div>
                        <div className="save-btn">
                            <Button label="Lưu" style={{ height: "40px" }} onClick={handleSubmit} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card voucher-form-card">
                <div className="voucher-section-title">A. Thông tin cơ bản</div>
                <div className="grid">
                    <div className="col-12 md:col-4">
                        <label className="voucher-label">Code</label>
                        <InputText
                            name="code"
                            className="w-full"
                            value={formData.code}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-12 md:col-8">
                        <label className="voucher-label">Tên voucher</label>
                        <InputText
                            name="name"
                            className="w-full"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12">
                        <label className="voucher-label">Loại giảm giá</label>
                        <div className="flex gap-4 mt-2">
                            <div className="flex align-items-center">
                                <RadioButton
                                    inputId="discount_percent"
                                    name="discount_type"
                                    value="percent"
                                    checked={formData.discount_type === "percent"}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, discount_type: e.value }))}
                                />
                                <label htmlFor="discount_percent" className="ml-2">Giảm theo %</label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton
                                    inputId="discount_amount"
                                    name="discount_type"
                                    value="amount"
                                    checked={formData.discount_type === "amount"}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, discount_type: e.value }))}
                                />
                                <label htmlFor="discount_amount" className="ml-2">Giảm theo số tiền</label>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 md:col-4">
                        <label className="voucher-label">
                            {formData.discount_type === "percent" ? "Giá trị giảm (%)" : "Giá trị giảm (VNĐ)"}
                        </label>
                        <InputText
                            name="discount_value"
                            keyfilter="int"
                            className="w-full"
                            value={String(formData.discount_value)}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, discount_value: Number(e.target.value) || 0 }))
                            }
                        />
                    </div>

                    {formData.discount_type === "percent" && (
                        <div className="col-12 md:col-4">
                            <label className="voucher-label">Giảm tối đa (VNĐ)</label>
                            <InputText
                                keyfilter="int"
                                className="w-full"
                                value={formData.max_discount_amount != null ? String(formData.max_discount_amount) : ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        max_discount_amount: e.target.value ? Number(e.target.value) : null
                                    }))
                                }
                                placeholder="Không giới hạn"
                            />
                        </div>
                    )}

                    <div className="col-12 md:col-4">
                        <label className="voucher-label">Giá trị đơn tối thiểu (VNĐ)</label>
                        <InputText
                            keyfilter="int"
                            className="w-full"
                            value={formData.min_order_amount != null ? String(formData.min_order_amount) : ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    min_order_amount: e.target.value ? Number(e.target.value) : null
                                }))
                            }
                            placeholder="Không yêu cầu"
                        />
                    </div>

                    <div className="col-12 md:col-4">
                        <label className="voucher-label">Thời gian hiệu lực</label>
                        <Calendar
                            className="w-full"
                            value={dateRange as Date[] | null}
                            onChange={(e) => setDateRange(e.value as (Date | null)[])}
                            selectionMode="range"
                            readOnlyInput
                            dateFormat="dd/mm/yy"
                            locale="vi"
                            showIcon
                        />
                    </div>

                    <div className="col-12 md:col-4">
                        <label className="voucher-label">Giới hạn tổng lượt dùng</label>
                        <InputText
                            keyfilter="int"
                            className="w-full"
                            value={formData.usage_limit != null ? String(formData.usage_limit) : ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    usage_limit: e.target.value ? Number(e.target.value) : null
                                }))
                            }
                            placeholder="Không giới hạn"
                        />
                    </div>

                    <div className="col-12 md:col-4">
                        <label className="voucher-label">Giới hạn lượt dùng/khách (SĐT)</label>
                        <InputText
                            keyfilter="int"
                            className="w-full"
                            value={formData.usage_limit_per_user != null ? String(formData.usage_limit_per_user) : ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    usage_limit_per_user: e.target.value ? Number(e.target.value) : null
                                }))
                            }
                            placeholder="Không giới hạn"
                        />
                    </div>

                    <div className="col-12 md:col-4 flex align-items-end">
                        <div className="flex align-items-center">
                            <Checkbox
                                inputId="status"
                                name="status"
                                onChange={handleChange}
                                checked={formData.status === 1}
                            />
                            <label htmlFor="status" className="ml-2">Kích hoạt voucher</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card voucher-form-card">
                <div className="voucher-section-title">B. Phạm vi áp dụng</div>
                <div className="flex gap-4 mb-3">
                    <div className="flex align-items-center">
                        <RadioButton
                            inputId="scope_all"
                            name="apply_scope"
                            value="all"
                            checked={formData.apply_scope === "all"}
                            onChange={(e) => setFormData((prev) => ({ ...prev, apply_scope: e.value }))}
                        />
                        <label htmlFor="scope_all" className="ml-2">Áp dụng toàn bộ sản phẩm</label>
                    </div>
                    <div className="flex align-items-center">
                        <RadioButton
                            inputId="scope_category"
                            name="apply_scope"
                            value="category"
                            checked={formData.apply_scope === "category"}
                            onChange={(e) => setFormData((prev) => ({ ...prev, apply_scope: e.value }))}
                        />
                        <label htmlFor="scope_category" className="ml-2">Áp dụng theo danh mục</label>
                    </div>
                </div>

                {formData.apply_scope === "category" && (
                    <div className="voucher-category-scope">
                        <label className="voucher-label">Danh mục áp dụng</label>
                        <MultiSelect
                            className="w-full mb-3"
                            value={selectedCategoryIds}
                            options={categoryOptions}
                            optionLabel="name"
                            optionValue="id"
                            onChange={(e) => handleCategorySelectChange(e.value)}
                            placeholder="Chọn danh mục"
                            display="chip"
                        />

                        {selectedCategoryIds.map((catId) => {
                            const category = categoryOptions.find((c) => c.id === catId);
                            const details = detailsByCategory[catId] ?? [];
                            const selectedDetails = selectedDetailsMap[catId] ?? [];
                            const applyAll = selectedDetails.length === 0;

                            return (
                                <div className="voucher-category-block" key={catId}>
                                    <div className="voucher-category-block-title">{category?.name ?? catId}</div>
                                    <div className="flex align-items-center mb-2">
                                        <Checkbox
                                            inputId={`apply-all-${catId}`}
                                            checked={applyAll}
                                            onChange={(e) => toggleApplyAll(catId, !!e.checked)}
                                        />
                                        <label htmlFor={`apply-all-${catId}`} className="ml-2">
                                            Áp dụng tất cả
                                        </label>
                                    </div>
                                    <div className="voucher-category-detail-list">
                                        {details.map((detail) => (
                                            <div className="flex align-items-center" key={detail.id}>
                                                <Checkbox
                                                    inputId={`detail-${detail.id}`}
                                                    checked={selectedDetails.includes(detail.id)}
                                                    onChange={(e) =>
                                                        toggleDetailChecked(catId, detail.id, !!e.checked)
                                                    }
                                                />
                                                <label htmlFor={`detail-${detail.id}`} className="ml-2">
                                                    {detail.name}
                                                </label>
                                            </div>
                                        ))}
                                        {details.length === 0 && (
                                            <div className="voucher-category-detail-empty">Không có danh mục con</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default VoucherDetail;
