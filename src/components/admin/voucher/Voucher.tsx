import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AllRouteType, ROLE } from "../../../constants/constants";
import { VoucherListItem } from "../../../constants/interface";
import ApiService from "../../../services/api.service";
import "./Voucher.scss";

const HOME_BREADCRUMB = { icon: "pi pi-home", url: "" };
const BREADCRUMB_ITEMS = [{ label: "Voucher" }];

const STATUS_OPTIONS = [
    { label: "Tất cả trạng thái", value: null },
    { label: "Đang hoạt động", value: 1 },
    { label: "Ngừng hoạt động", value: 0 }
];

const formatDate = (value: string) => {
    if (!value) return "";
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleDateString("vi-VN");
};

const formatDiscountValue = (rowData: VoucherListItem) =>
    rowData.discount_type === "percent"
        ? `${rowData.discount_value}%`
        : rowData.discount_value.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

const discountTypeTemplate = (rowData: VoucherListItem) => (
    <Tag
        value={rowData.discount_type === "percent" ? "% Phần trăm" : "Số tiền"}
        severity={rowData.discount_type === "percent" ? "info" : "warning"}
    />
);

const effectiveTimeTemplate = (rowData: VoucherListItem) =>
    `${formatDate(rowData.start_date)} - ${formatDate(rowData.end_date)}`;

const usageTemplate = (rowData: VoucherListItem) =>
    `${rowData.used_count ?? 0}/${rowData.usage_limit ?? "Không giới hạn"}`;

function Voucher() {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    const [list, setList] = useState<VoucherListItem[]>([]);
    const [recordsTotal, setRecordsTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<number | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const fetchList = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = queryString.stringify({
                filter: search,
                status,
                offSet: first,
                pageSize: rows
            });
            const res = await ApiService.getVoucherList(queryParams);
            const data = res?.data?.data ?? res?.data ?? res ?? [];
            setRecordsTotal(res?.data?.recordsTotal ?? 0);
            setList(Array.isArray(data) ? data : []);
        } catch (err) {
            setList([]);
        } finally {
            setLoading(false);
        }
    }, [search, status, first, rows]);

    useEffect(() => {
        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [first, rows, search, status]);

    const searchHandler = useCallback(() => {
        setFirst(0);
        setSearch(searchInput.trim());
    }, [searchInput]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            searchHandler();
        }
    }, [searchHandler]);

    const onPageChange = useCallback((event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        setRows(event.rows);
    }, []);

    const handleStatusFilterChange = useCallback((e: DropdownChangeEvent) => {
        setFirst(0);
        setStatus(e.value);
    }, []);

    const handleAdd = useCallback(() => {
        navigate(`${ROLE.admin}/${AllRouteType.voucher}/them-moi`);
    }, [navigate]);

    const handleEdit = useCallback((rowData: VoucherListItem) => {
        navigate(`${ROLE.admin}/${AllRouteType.voucher}/${rowData.id}`);
    }, [navigate]);

    const handleToggleStatus = useCallback(async (rowData: VoucherListItem) => {
        try {
            const detail = await ApiService.getVoucherDetail(rowData.id);
            const fullData = detail?.data ?? detail;
            const payload = { ...fullData, status: rowData.status === 1 ? 0 : 1 };
            const response = await ApiService.postVoucher(payload);
            if (response?.status === "success") {
                toast.current?.show({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Cập nhật trạng thái thành công",
                    life: 2000
                });
                fetchList();
            } else {
                throw new Error("update failed");
            }
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không thể cập nhật trạng thái. Vui lòng thử lại.",
                life: 2000
            });
        }
    }, [fetchList]);

    const handleDelete = useCallback(async () => {
        if (!selectedId) return;
        try {
            const response = await ApiService.deleteVoucher(selectedId);
            if (response?.status === "success") {
                toast.current?.show({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Xóa voucher thành công",
                    life: 2000
                });
                fetchList();
            } else {
                throw new Error("delete failed");
            }
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không thể xóa voucher. Vui lòng thử lại.",
                life: 2000
            });
        }
    }, [selectedId, fetchList]);

    const confirmDelete = useCallback((rowData: VoucherListItem) => {
        setSelectedId(rowData.id);
        confirmDialog({
            header: "Xác nhận",
            message: `Bạn muốn xóa voucher "${rowData.code}" không?`,
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "Xóa",
            rejectLabel: "Hủy",
            accept: handleDelete
        });
    }, [handleDelete]);

    const statusTemplate = useCallback((rowData: VoucherListItem) => (
        <InputSwitch checked={rowData.status === 1} onChange={() => handleToggleStatus(rowData)} />
    ), [handleToggleStatus]);

    const actionTemplate = useCallback((rowData: VoucherListItem) => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" className="p-button-text" onClick={() => handleEdit(rowData)} />
            <Button
                icon="pi pi-trash"
                className="p-button-text p-button-danger"
                onClick={() => confirmDelete(rowData)}
            />
        </div>
    ), [handleEdit, confirmDelete]);

    return (
        <div className="wrapper voucher-admin">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="header">
                <BreadCrumb model={BREADCRUMB_ITEMS} home={HOME_BREADCRUMB} />
                <div className="grid">
                    <div className="col-6 header-left flex">
                        <div className="empty"></div>
                        <div className="main-title flex align-items-center ml-2">Voucher</div>
                    </div>
                    <div className="col-6 header-right flex align-items-center justify-content-end gap-2">
                        <div className="search-btn flex">
                            <InputText
                                placeholder="Nhập tên hoặc mã voucher"
                                value={searchInput}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <Button onClick={searchHandler} icon="pi pi-search" />
                        </div>
                        <Dropdown
                            value={status}
                            options={STATUS_OPTIONS}
                            onChange={handleStatusFilterChange}
                            placeholder="Trạng thái"
                        />
                        <Button label="Thêm mới" icon="pi pi-plus" onClick={handleAdd} />
                    </div>
                </div>
            </div>

            <div className="card">
                <DataTable value={list} loading={loading} dataKey="id">
                    <Column field="code" header="Code" />
                    <Column field="name" header="Tên voucher" />
                    <Column header="Loại giảm" body={discountTypeTemplate} />
                    <Column header="Giá trị" body={formatDiscountValue} />
                    <Column header="Thời gian hiệu lực" body={effectiveTimeTemplate} />
                    <Column header="Đã dùng/Giới hạn" body={usageTemplate} />
                    <Column header="Trạng thái" body={statusTemplate} />
                    <Column header="Hành động" body={actionTemplate} style={{ width: "8rem" }} />
                </DataTable>

                <div className="flex justify-content-between surface-section">
                    <div className="flex align-items-center pl-3">Tổng số {recordsTotal} voucher</div>
                    <Paginator
                        first={first}
                        rows={rows}
                        totalRecords={recordsTotal}
                        rowsPerPageOptions={[10, 20, 50]}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default Voucher;
