import moment from "moment";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable, DataTableExpandedRows, DataTableValueArray } from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useCallback, useEffect, useRef, useState } from "react";
import { OrderProductItem, PaymentForm } from "../../../constants/interface";
import ApiService from "../../../services/api.service";
import "./Order.scss";

const HOME_BREADCRUMB = { icon: "pi pi-home", url: "" };
const BREADCRUMB_ITEMS = [{ label: "Đơn hàng" }];

const STATUS_OPTIONS = [
    { label: "Tất cả", value: -1 },
    { label: "0. Khởi tạo", value: 0 },
    { label: "1. Đã xác nhận", value: 1 },
    { label: "2. Hoàn thành", value: 2 },
    { label: "3. Trả lại", value: 3 },
    { label: "4. Hủy", value: 4 },
];

const ORDER_STATUS_LABELS: Record<number, string> = {
    0: "Khởi tạo",
    1: "Đã xác nhận",
    2: "Hoàn thành",
    3: "Trả lại",
    4: "Hủy",
};

const PAYMENT_METHOD_LABELS: Record<number, string> = {
    0: "Chuyển khoản ngân hàng",
    1: "Kiểm tra thanh toán",
    2: "Trả tiền mặt khi nhận hàng",
};

function Order() {
    const [selectStatus, setSelectStatus] = useState<number | null>(null);
    const op2 = useRef<OverlayPanel>(null);
    const op = useRef<OverlayPanel>(null);
    const toast = useRef<Toast>(null);
    const [selectedId, setSelectedId] = useState<string>();
    const [searchValue, setSearchValue] = useState("");
    const [orderList, setOrderList] = useState<PaymentForm[]>([]);
    const [orderParams, setOrderParams] = useState({
        filter: "",
        status: -1,
        offSet: 0,
        pageSize: 10,
    });
    const [recordsTotal, setRecordsTotal] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [expandedRows, setExpandedRows] = useState<
        DataTableExpandedRows | DataTableValueArray | undefined
    >(undefined);

    const fetchOrder = useCallback(async (params: typeof orderParams) => {
        try {
            const queryParams = queryString.stringify(params);
            const response = await ApiService.getPaymentList(queryParams);
            setOrderList(response.data.data);
            setRecordsTotal(response.data.recordsTotal);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchOrder(orderParams);
    }, [orderParams, fetchOrder]);

    const changeCtgHanlder = useCallback((e: DropdownChangeEvent) => {
        setSelectStatus(e.value);
        setOrderParams((prevParams) => ({
            ...prevParams,
            status: e.value ? e.value : "0",
        }));
        op2.current?.toggle(e.originalEvent);
    }, []);

    const onPageChange = useCallback((event: PaginatorPageChangeEvent) => {
        setRows(event.rows);
        setFirst(event.first);
        setOrderParams((prevParams) => ({
            ...prevParams,
            offSet: event.first,
            pageSize: event.rows,
        }));
    }, []);

    const searchHandler = useCallback(() => {
        setOrderParams((prevParams) => ({
            ...prevParams,
            filter: searchValue,
        }));
    }, [searchValue]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            searchHandler();
        }
    }, [searchHandler]);

    const statusTemplate = useCallback((product: PaymentForm) => {
        const label = product.status !== undefined ? ORDER_STATUS_LABELS[product.status] : undefined;
        if (!label) return null;
        return <div className={`status status-${product.status}`}>{label}</div>;
    }, []);

    const methodTemplate = useCallback((product: PaymentForm) => {
        const label = PAYMENT_METHOD_LABELS[Number(product.payment_method)];
        return label ? <div>{label}</div> : null;
    }, []);

    const dateTemplate = useCallback((product: PaymentForm) => {
        return moment(product.date).format("DD/MM/YYYY");
    }, []);

    const optionsTemplate = useCallback((rowData: PaymentForm) => (
        <span
            className="flex justify-content-center"
            onClick={(e) => {
                op.current?.toggle(e);
                setSelectedId(rowData.id);
            }}
        >
            <i className="pi pi-ellipsis-v"></i>
        </span>
    ), []);

    const priceFormatTemplate = useCallback((value: number) => (
        <span className="total-bill ">
            {value.toLocaleString("vi-VN")}
        </span>
    ), []);

    const acceptDeleteOrder = useCallback(async () => {
        try {
            const deleteCtg = await ApiService.deletePayment(selectedId || "");
            if (deleteCtg.status === "success") {
                toast.current?.show({
                    severity: "success",
                    summary: "Thông báo",
                    detail: "Xóa bản ghi thành công !",
                    life: 3000,
                });
                fetchOrder(orderParams);
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Thông báo",
                    detail: deleteCtg.message || "Không thành công !",
                    life: 3000,
                });
            }
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Thông báo",
                detail: "Không thành công !",
                life: 2000,
            });
        }
    }, [selectedId, orderParams, fetchOrder]);

    const confirmDelete = useCallback(() => {
        confirmDialog({
            header: "Xác nhận",
            message: "Bạn muốn xóa bản ghi này không ?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "Xóa",
            rejectLabel: "Hủy",
            accept: acceptDeleteOrder,
        });
    }, [acceptDeleteOrder]);

    const changeOrderStatus = useCallback(async (newStatus: number) => {
        const data = {
            id: selectedId,
            status: newStatus,
        };
        try {
            const response = await ApiService.updatePaymentStatus(data);
            if (response.status === "success") {
                toast.current?.show({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Cập nhật trạng thái thành công !",
                });
                fetchOrder(orderParams);
            }
        } catch (error) {
            console.log(error);
        }
    }, [selectedId, orderParams, fetchOrder]);

    const imageBodyTemplate = useCallback((product: OrderProductItem) => (
        <img
            src={product.img}
            alt={product.img}
            style={{ objectFit: "contain" }}
            className="w-3rem h-3rem shadow-2 border-round"
        />
    ), []);

    const rowExpansionTemplate = useCallback((data: PaymentForm) => (
        <DataTable value={data.products} scrollable={false}>
            <Column field="img" header="Hình ảnh" body={imageBodyTemplate} style={{ width: "11rem" }}></Column>
            <Column field="product_name" header="Sản phẩm" style={{ width: "700px" }}></Column>
            <Column field="size" header="Phiên bản" style={{ width: "180px" }}></Column>
            <Column
                header="Số lượng"
                field="quantity"
                style={{ width: "200px" }}
            ></Column>
            <Column
                header="Đơn giá"
                field="salePrice"
                body={(rowData: OrderProductItem) => priceFormatTemplate(rowData.salePrice)}
            ></Column>
        </DataTable>
    ), [imageBodyTemplate, priceFormatTemplate]);

    const allowExpansion = useCallback((rowData: PaymentForm) => {
        return (rowData.products?.length || 0) > 0;
    }, []);

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="order-wrapper">
                <div className="header">
                    <BreadCrumb model={BREADCRUMB_ITEMS} home={HOME_BREADCRUMB} />
                    <div className="grid">
                        <div className="col-6 header-left flex">
                            <div className="empty"></div>
                            <div className="main-title flex align-items-center ml-2">
                                Đơn hàng
                            </div>
                        </div>
                        <div className="col-6 header-right flex align-items-center justify-content-end">
                            <div className="search-btn flex">
                                <InputText
                                    placeholder="Nhập SĐT hoặc Tên KH"
                                    value={searchValue}
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                />
                                <Button
                                    onClick={searchHandler}
                                    icon="pi pi-search"
                                />
                            </div>
                            <div
                                className="filter-btn"
                                onClick={(e) => op2.current?.toggle(e)}
                            >
                                <Button label="Bộ lọc" icon="pi pi-sliders-h" />
                                <OverlayPanel ref={op2}>
                                    <div
                                        className="search_advance"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="pb-1">Trạng thái</div>
                                        <Dropdown
                                            value={selectStatus}
                                            onChange={changeCtgHanlder}
                                            options={STATUS_OPTIONS}
                                            placeholder="Lựa chọn"
                                            className="w-full"
                                        />
                                    </div>
                                </OverlayPanel>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <DataTable
                        value={orderList}
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        rowExpansionTemplate={rowExpansionTemplate}
                        scrollable
                    >
                        <Column
                            expander={allowExpansion}
                            style={{ width: "5rem" }}
                            frozen
                        />
                        <Column
                            style={{ minWidth: "120px" }}
                            field="phone"
                            header="Số ĐT"
                            frozen
                        ></Column>
                        <Column
                            style={{ minWidth: "100px" }}
                            field="total_bill"
                            header="Tổng HĐ"
                            body={(rowData) => priceFormatTemplate(rowData.total_bill)}
                            frozen
                        ></Column>
                        <Column
                            style={{ minWidth: "200px" }}
                            field="name"
                            header="Tên KH"
                        ></Column>
                        <Column
                            style={{ minWidth: "500px" }}
                            field="address"
                            header="Địa chỉ"
                        ></Column>
                        <Column
                            style={{ minWidth: "180px" }}
                            field="tp"
                            header="T.Phố"
                        ></Column>
                        <Column
                            style={{ minWidth: "180px" }}
                            field="qh"
                            header="Q.Huyện"
                        ></Column>
                        <Column
                            style={{ minWidth: "180px" }}
                            field="px"
                            header="P.Xã"
                        ></Column>
                        <Column
                            style={{ minWidth: "140px" }}
                            field="date"
                            header="Ngày đặt"
                            body={dateTemplate}
                        ></Column>
                        <Column
                            style={{ minWidth: "200px" }}
                            field="payment_method"
                            header="Thanh toán"
                            body={methodTemplate}
                        ></Column>
                        <Column
                            style={{ minWidth: "400px" }}
                            field="note"
                            header="Ghi chú"
                        ></Column>
                        <Column
                            style={{ minWidth: "140px" }}
                            field="status"
                            header="Trạng thái"
                            body={statusTemplate}
                            frozen
                            alignFrozen="right"
                        ></Column>
                        <Column
                            style={{ minWidth: "40px" }}
                            body={optionsTemplate}
                            frozen
                            alignFrozen="right"
                        ></Column>
                    </DataTable>
                </div>
                <div className="flex justify-content-between surface-section">
                    <div className="flex align-items-center pl-3">
                        Tổng số {recordsTotal} bản ghi
                    </div>
                    <Paginator
                        first={first}
                        rows={rows}
                        totalRecords={recordsTotal}
                        rowsPerPageOptions={[10, 20, 30]}
                        onPageChange={onPageChange}
                    />
                </div>
                <OverlayPanel ref={op}>
                    <div
                        className="sort_option"
                        onClick={() => changeOrderStatus(1)}
                    >
                        <span className="mr-2">
                            <i style={{ color: "#007bff" }}>1</i>
                        </span>
                        Đã xác nhận
                    </div>
                    <div
                        className="sort_option"
                        onClick={() => changeOrderStatus(2)}
                    >
                        <span className="mr-2">
                            <i style={{ color: "#007bff" }}>2</i>
                        </span>
                        Hoàn thành
                    </div>
                    <div
                        className="sort_option"
                        onClick={() => changeOrderStatus(3)}
                    >
                        <span className="mr-2">
                            <i style={{ color: "#007bff" }}>3</i>
                        </span>
                        Trả lại
                    </div>
                    <div
                        className="sort_option"
                        onClick={() => changeOrderStatus(4)}
                    >
                        <span className="mr-2">
                            <i style={{ color: "#007bff" }}>4</i>
                        </span>
                        Hủy
                    </div>
                    <div className="sort_option" onClick={confirmDelete}>
                        <span className="mr-2">
                            <i className="pi pi-trash text-red-500"></i>
                        </span>
                        Xóa
                    </div>
                </OverlayPanel>
            </div>
        </>
    );
}

export default Order;
