import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { PaymentForm } from "../../../constants/interface";
import ApiService from "../../../services/api.service";
import "./Order.scss";
import moment from "moment";

function Order() {
    const [selectStatus, setSelectStatus] = useState(null);
    const op2 = useRef<OverlayPanel>(null);
    const op = useRef<OverlayPanel>(null);
    const toast = useRef<Toast>(null);
    const home = { icon: "pi pi-home", url: "" };
    const [selectedId, setSelectedId] = useState<string>();
    const breadcrumbItems = [{ label: "Đơn hàng" }];
    const statusOptions = [
        { label: "Tất cả", value: -1 },
        { label: "0. Khởi tạo", value: 0 },
        { label: "1. Đã xác nhận", value: 1 },
        { label: "2. Hoàn thành", value: 2 },
        { label: "3. Trả lại", value: 3 },
        { label: "4. Hủy", value: 4 },
    ];
    const [searchValue, setSearchValue] = useState("");
    const [orderList, setOrderList] = useState<PaymentForm[]>([]);
    const [orderParams, setOrderParams] = useState({
        filter: "",
        status: -1,
        offSet: 0,
        pageSize: 10,
    });

    useEffect(() => {
        fetchOrder(orderParams);
    }, [orderParams]);

    const changeCtgHanlder = (e: any) => {
        setSelectStatus(e.value);
        setOrderParams((prevParams) => ({
            ...prevParams,
            status: e.value ? e.value : "0",
        }));
        op2.current?.toggle(e);
    };

    const fetchOrder = async (orderParams: any) => {
        try {
            const queryParams = queryString.stringify(orderParams);
            const slideList = await ApiService.getPaymentList(queryParams);
            setOrderList(slideList.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const searchHandler = () => {
        setOrderParams((prevParams) => ({
            ...prevParams,
            filter: searchValue,
        }));
    };

    const handleKeyDown = (event: any) => {
        if (event && event.key === "Enter") {
            searchHandler();
        }
    };

    const statusTemplate = (product: any) => {
        let template;
        if (product.status === 0) {
            template = <div className="status status-0">Khởi tạo</div>;
        } else if (product.status === 1) {
            template = <div className="status status-1">Đã xác nhận</div>;
        } else if (product.status === 2) {
            template = <div className="status status-2">Hoàn thành</div>;
        } else if (product.status === 3) {
            template = <div className="status status-3">Trả lại</div>;
        } else if (product.status === 4) {
            template = <div className="status status-4">Hủy</div>;
        }
        return template;
    };

    const methodTemplate = (product: any) => {
        let template;
        if (product.payment_method == 0) {
            template = <div>Chuyển khoản ngân hàng</div>;
        } else if (product.payment_method == 1) {
            template = <div>Kiểm tra thanh toán</div>;
        } else if (product.payment_method == 2) {
            template = <div>Trả tiền mặt khi nhận hàng</div>;
        }
        return template;
    };

    const dateTemplate = (product : any) => {
        return moment(product.date).format('DD/MM/YYYY')
    }

    const optionsTemplate = (rowData: any) => {
        return (
            <span
                className="flex justify-content-center"
                onClick={(e) => {
                    op.current?.toggle(e);
                    setSelectedId(rowData.id);
                }}
            >
                <i className="pi pi-ellipsis-v"></i>
            </span>
        );
    };

    const priceFormatTemplate = (rowData: any) => {
        return (
            <span className="total-bill ">
                {rowData.total_bill.toLocaleString("vi-VN")}
            </span>
        );
    };

    const confirmDelete = () => {
        confirmDialog({
            header: "Xác nhận",
            message: "Bạn muốn xóa bản ghi này không ?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "Xóa",
            rejectLabel: "Hủy",
            accept: acceptDeleteOrder,
        });
    };

    const acceptDeleteOrder = async () => {
        try {
            const deleteCtg = await ApiService.deletePayment(selectedId || "");
            if (deleteCtg.status === "success") {
                if (toast.current) {
                    toast.current.show({
                        severity: "success",
                        summary: "Thông báo",
                        detail: "Xóa bản ghi thành công !",
                        life: 3000,
                    });
                }
                fetchOrder(orderParams);
            } else {
                if (toast.current) {
                    toast.current.show({
                        severity: "error",
                        summary: "Thông báo",
                        detail: deleteCtg.message || "Không thành công !",
                        life: 3000,
                    });
                }
            }
        } catch (err) {
            if (toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Thông báo",
                    detail: "Không thành công !",
                    life: 2000,
                });
            }
        }
    };

    const changeOrderStatus = async (newStatus: number) => {
        const data = {
            id: selectedId,
            status: newStatus,
        };
        try {
            const response = await ApiService.updatePaymentStatus(data);
            if (response.status === "success" && toast.current) {
                toast.current.show({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Cập nhật trạng thái thành công !",
                });
                fetchOrder(orderParams);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="order-wrapper">
                <div className="header">
                    <BreadCrumb model={breadcrumbItems} home={home} />
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
                                    onKeyDown={(e) => handleKeyDown(e)}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                />
                                <Button
                                    onClick={() => searchHandler()}
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
                                            onChange={(e) =>
                                                changeCtgHanlder(e)
                                            }
                                            options={statusOptions}
                                            placeholder="Select"
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
                        responsiveLayout="scroll"
                        scrollable
                        rowHover={true}
                    >
                        <Column
                            style={{ minWidth: "120px" }}
                            field="phone"
                            header="Số ĐT"
                            frozen
                        ></Column>
                        <Column
                            style={{ minWidth: "300px" }}
                            field="product_name"
                            header="Tên SP"
                            frozen
                        ></Column>
                        <Column
                            style={{ minWidth: "100px" }}
                            field="total_bill"
                            header="Tổng HĐ"
                            body={(rowData) => priceFormatTemplate(rowData)}
                            frozen
                        ></Column>
                        <Column
                            style={{ minWidth: "200px" }}
                            field="name"
                            header="Tên KH"
                        ></Column>
                        <Column
                            style={{ minWidth: "400px" }}
                            field="address"
                            header="Địa chỉ"
                        ></Column>
                        <Column
                            style={{ minWidth: "140px" }}
                            field="tp"
                            header="T.Phố"
                        ></Column>
                        <Column
                            style={{ minWidth: "140px" }}
                            field="qh"
                            header="Q.Huyện"
                        ></Column>
                        <Column
                            style={{ minWidth: "140px" }}
                            field="px"
                            header="P.Xã"
                        ></Column>
                        <Column
                            style={{ minWidth: "140px" }}
                            field="note"
                            header="Ghi chú"
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
