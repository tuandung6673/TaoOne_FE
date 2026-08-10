import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Rating } from "primereact/rating";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCommentItem } from "../../../constants/interface";
import ApiService from "../../../services/api.service";
import "./ProductCommentAdmin.scss";

const HOME_BREADCRUMB = { icon: "pi pi-home", url: "" };
const BREADCRUMB_ITEMS = [{ label: "Bình luận" }];

const STATUS_OPTIONS = [
    { label: "Tất cả trạng thái", value: -1 },
    { label: "Đang hiển thị", value: 1 },
    { label: "Đã ẩn", value: 0 }
];

const formatDate = (value: string) => {
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleString("vi-VN");
};

const contentTemplate = (rowData: ProductCommentItem) => (
    <div className="comment-content-cell">{rowData.content}</div>
);

const productNameTemplate = (rowData: ProductCommentItem) => (
    <div className="comment-product-cell">{rowData.product_name || "—"}</div>
);

const ratingTemplate = (rowData: ProductCommentItem) => (
    <Rating value={rowData.rating} readOnly cancel={false} />
);

const dateTemplate = (rowData: ProductCommentItem) => formatDate(rowData.created_at);

function ProductCommentAdmin() {
    const toast = useRef<Toast>(null);

    const [list, setList] = useState<ProductCommentItem[]>([]);
    const [recordsTotal, setRecordsTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<number>(-1);

    const fetchList = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = queryString.stringify({
                filter: search,
                status,
                offSet: first,
                pageSize: rows
            });
            const res = await ApiService.getCommentList(queryParams);
            setList(res?.data?.data ?? []);
            setRecordsTotal(res?.data?.recordsTotal ?? 0);
        } catch (err) {
            setList([]);
        } finally {
            setLoading(false);
        }
    }, [search, status, first, rows]);

    useEffect(() => {
        fetchList();
    }, [fetchList]);

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

    const handleToggleStatus = useCallback(async (rowData: ProductCommentItem) => {
        const nextStatus = rowData.status === 1 ? 0 : 1;
        try {
            const response = await ApiService.updateCommentStatus({ id: rowData.id, status: nextStatus });
            if (response?.status === "success") {
                toast.current?.show({
                    severity: "success",
                    summary: "Thành công",
                    detail: nextStatus === 1 ? "Đã hiện bình luận" : "Đã ẩn bình luận",
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

    const handleDelete = useCallback(async (rowData: ProductCommentItem) => {
        try {
            const response = await ApiService.deleteComment(rowData.id);
            if (response?.status === "success") {
                toast.current?.show({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Đã xóa bình luận",
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
                detail: "Không thể xóa bình luận. Vui lòng thử lại.",
                life: 2000
            });
        }
    }, [fetchList]);

    const confirmDelete = useCallback((rowData: ProductCommentItem) => {
        confirmDialog({
            header: "Xác nhận",
            message: `Bạn muốn xóa bình luận của "${rowData.name}" không?`,
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "Xóa",
            rejectLabel: "Hủy",
            accept: () => handleDelete(rowData)
        });
    }, [handleDelete]);

    const nameTemplate = useCallback((rowData: ProductCommentItem) => (
        <div className="comment-name-cell">
            <div className="comment-name">{rowData.name}</div>
            <div className="comment-phone">{rowData.phone}</div>
        </div>
    ), []);

    const statusTemplate = useCallback((rowData: ProductCommentItem) => (
        <InputSwitch checked={rowData.status === 1} onChange={() => handleToggleStatus(rowData)} />
    ), [handleToggleStatus]);

    const actionTemplate = useCallback((rowData: ProductCommentItem) => (
        <Button
            icon="pi pi-trash"
            className="p-button-text p-button-danger"
            onClick={() => confirmDelete(rowData)}
        />
    ), [confirmDelete]);

    return (
        <div className="wrapper comment-admin">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="header">
                <BreadCrumb model={BREADCRUMB_ITEMS} home={HOME_BREADCRUMB} />
                <div className="grid">
                    <div className="col-6 header-left flex">
                        <div className="empty"></div>
                        <div className="main-title flex align-items-center ml-2">Bình luận sản phẩm</div>
                    </div>
                    <div className="col-6 header-right flex align-items-center justify-content-end gap-2">
                        <div className="search-btn flex">
                            <InputText
                                placeholder="Nhập tên hoặc SĐT"
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
                    </div>
                </div>
            </div>

            <div className="card">
                <DataTable value={list} loading={loading} dataKey="id">
                    <Column header="Khách hàng" body={nameTemplate} style={{ minWidth: "180px" }} />
                    <Column header="Sản phẩm" body={productNameTemplate} style={{ minWidth: "200px" }} />
                    <Column header="Đánh giá" body={ratingTemplate} style={{ width: "10rem" }} />
                    <Column header="Nội dung" body={contentTemplate} style={{ minWidth: "300px" }} />
                    <Column header="Thời gian" body={dateTemplate} style={{ width: "12rem" }} />
                    <Column header="Hiển thị" body={statusTemplate} style={{ width: "8rem" }} />
                    <Column header="" body={actionTemplate} style={{ width: "4rem" }} />
                </DataTable>

                <div className="flex justify-content-between surface-section">
                    <div className="flex align-items-center pl-3">Tổng số {recordsTotal} bình luận</div>
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

export default ProductCommentAdmin;
