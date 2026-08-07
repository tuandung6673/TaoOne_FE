import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import queryString from "query-string";
import { useCallback, useEffect, useState } from "react";
import { SaleRecord } from "../../../constants/interface";
import ApiService from "../../../services/api.service";
import "./SaleRecordList.scss";

const HOME_BREADCRUMB = { icon: "pi pi-home", url: "" };
const BREADCRUMB_ITEMS = [{ label: "Đơn hàng Online" }];

const formatCurrency = (value: number | null) =>
    value == null ? "" : value.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

const formatDate = (value: string | null) => {
    if (!value) return "";
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleDateString("vi-VN");
};

function SaleRecordList() {
    const [list, setList] = useState<SaleRecord[]>([]);
    const [recordsTotal, setRecordsTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(50);
    const [phoneInput, setPhoneInput] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        const fetchList = async () => {
            setLoading(true);
            try {
                const queryParams = queryString.stringify({
                    phone,
                    offSet: first,
                    pageSize: rows
                });
                const res = await ApiService.getSaleRecordList(queryParams);
                const data = res?.data?.data ?? res?.data ?? res ?? [];
                setRecordsTotal(res?.data?.recordsTotal ?? 0);
                setList(Array.isArray(data) ? data : []);
            } catch (err) {
                setList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchList();
    }, [first, rows, phone]);

    const searchHandler = useCallback(() => {
        setFirst(0);
        setPhone(phoneInput.trim());
    }, [phoneInput]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            searchHandler();
        }
    }, [searchHandler]);

    const onPageChange = useCallback((event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        setRows(event.rows);
    }, []);

    const sellPriceTemplate = useCallback((rowData: SaleRecord) => formatCurrency(rowData.sellPrice), []);
    const importPriceTemplate = useCallback((rowData: SaleRecord) => formatCurrency(rowData.importPrice), []);
    const costTemplate = useCallback((rowData: SaleRecord) => formatCurrency(rowData.cost), []);
    const profitTemplate = useCallback((rowData: SaleRecord) => formatCurrency(rowData.profit), []);
    const soldDateTemplate = useCallback((rowData: SaleRecord) => formatDate(rowData.soldDate), []);
    const deliveryDateTemplate = useCallback((rowData: SaleRecord) => formatDate(rowData.deliveryDate), []);
    const phoneTemplate = useCallback((rowData: SaleRecord) => (
        <span className={rowData.profit < 0 ? "sale-record-negative-profit" : ""}>{'0' + rowData.phone}</span>
    ), []);

    return (
        <div className="wrapper sale-record-admin">
            <div className="header">
                <BreadCrumb model={BREADCRUMB_ITEMS} home={HOME_BREADCRUMB} />
                <div className="grid">
                    <div className="col-6 header-left flex">
                        <div className="empty"></div>
                        <div className="main-title flex align-items-center ml-2">Đơn hàng Online</div>
                    </div>
                    <div className="col-6 header-right flex align-items-center justify-content-end">
                        <div className="search-btn flex">
                            <InputText
                                placeholder="Nhập số điện thoại tìm kiếm"
                                value={phoneInput}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => setPhoneInput(e.target.value)}
                            />
                            <Button
                                onClick={searchHandler}
                                icon="pi pi-search"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <DataTable
                    value={list}
                    loading={loading}
                    dataKey="id"
                    scrollable
                    scrollHeight="600px"
                >
                    <Column field="stt" header="STT" frozen style={{ minWidth: "5rem" }} />
                    <Column header="Số điện thoại" body={phoneTemplate} style={{ minWidth: "10rem" }} />
                    <Column field="address" header="Địa chỉ" style={{ minWidth: "10rem" }} />
                    <Column field="facebook" header="Facebook" style={{ minWidth: "9rem" }} />
                    <Column field="gender" header="Giới tính" style={{ minWidth: "7rem" }} />
                    <Column field="productLine" header="Dòng sản phẩm" style={{ minWidth: "8rem" }} />
                    <Column field="size" header="Size" style={{ minWidth: "6rem" }} />
                    <Column field="color" header="Màu" style={{ minWidth: "7rem" }} />
                    <Column field="material" header="Chất liệu" style={{ minWidth: "7rem" }} />
                    <Column field="imei" header="IMEI" style={{ minWidth: "10rem" }} />
                    <Column field="version" header="Loại" style={{ minWidth: "7rem" }} />
                    <Column field="paymentMethod" header="Tình trạng" style={{ minWidth: "8rem" }} />
                    <Column field="battery" header="Pin (%)" style={{ minWidth: "6rem" }} />
                    <Column header="Ngày bán" body={soldDateTemplate} style={{ minWidth: "9rem" }} />
                    <Column header="Ngày giao" body={deliveryDateTemplate} style={{ minWidth: "9rem" }} />
                    <Column field="warranty" header="Bảo hành" style={{ minWidth: "7rem" }} />
                    <Column header="Giá nhập" body={importPriceTemplate} style={{ minWidth: "9rem" }} />
                    <Column header="Giá bán" body={sellPriceTemplate} style={{ minWidth: "9rem" }} />
                    <Column header="Chi phí" body={costTemplate} style={{ minWidth: "9rem" }} />
                    <Column header="Lợi nhuận" body={profitTemplate} style={{ minWidth: "9rem" }} />
                    <Column field="note" header="Ghi chú" style={{ minWidth: "10rem" }} />
                    {/* <Column field="source" header="Nguồn" style={{ minWidth: "8rem" }} /> */}
                </DataTable>

                <div className="flex justify-content-between surface-section mt-3">
                    <div className="flex align-items-center pl-3">
                        Tổng số {recordsTotal} bản ghi
                    </div>
                    <Paginator
                        first={first}
                        rows={rows}
                        totalRecords={recordsTotal}
                        rowsPerPageOptions={[20, 50, 100]}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default SaleRecordList;
