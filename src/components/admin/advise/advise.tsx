import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import ApiService from "../../../services/api.service";
import { AdviseForm } from "../../../constants/interface";
import "./advise.scss";
import queryString from "query-string";
import { Paginator } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";

function Advise() {
    const [selectStatus, setSelectStatus] = useState(null);
    const toast = useRef<Toast>(null);
    const op2 = useRef<OverlayPanel>(null);
    const home = { icon: "pi pi-home", url: "" };
    const breadcrumbItems = [{ label: "Tư vấn" }];
    const [adviseParams, setAdviseParams] = useState({
        status: null,
        offSet: 0,
        pageSize: 10
    });
    const [recordsTotal, setRecordsTotal] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const statusOptions = [
        { label: "Tất cả", value: null },
        { label: "Chưa tư vấn", value: 0 },
        { label: "Đã tư vấn", value: 1 }
    ];

    const [adviseList, setAdviseList] = useState<AdviseForm[]>([]);
    const [searchValue, setSearchValue] = useState("");

    const filteredList = useMemo(() => {
        const q = searchValue.trim().toLowerCase();
        if (!q) return adviseList;

        return adviseList.filter((row: AdviseForm) => {
            const name = row.name?.toString().toLowerCase() ?? "";
            const phone = row.phone?.toString().toLowerCase() ?? "";
            return name.includes(q) || phone.includes(q);
        });
    }, [adviseList, searchValue]);

    const fetchAdviseList = async () => {
        try {
            const queryParams = queryString.stringify(adviseParams);
            const res = await ApiService.getAdviseList(queryParams);
            // Backend response shape isn't guaranteed; handle the common patterns safely.
            const list =
                res?.data?.data ?? res?.data ?? res ?? [];
            setRecordsTotal(res.data.recordsTotal);
            setAdviseList(Array.isArray(list) ? (list as AdviseForm[]) : []);
        } catch (err) {
            console.error(err);
            setAdviseList([]);
        }
    };

    const changeCtgHanlder = (e: any) => {
        setSelectStatus(e.value);
        setAdviseParams((prevParams) => ({
            ...prevParams,
            status: e.value,
        }));
        op2.current?.toggle(e);
    };

    const onPageChange = (event: any) => {
        setRows(event.rows);
        setFirst(event.first);
        setAdviseParams((prevParams) => ({
            ...prevParams,
            offSet: event.first,
            pageSize: event.rows,
        }));
    };

    useEffect(() => {
        fetchAdviseList();
    }, [adviseParams]);

    const toggleAdviseStatus = async (rowData: AdviseForm) => {
        try {
            const currentStatus = Number(rowData.status ?? 0);
            const nextStatus = currentStatus === 1 ? 0 : 1;

            const payload: AdviseForm = {
                ...rowData,
                status: nextStatus,
                submitDate: rowData.submitDate || new Date().toISOString(),
            };

            await ApiService.postAdvise(payload);

            toast.current?.show({
                severity: "success",
                summary: "Đã cập nhật",
                detail: `Trạng thái: ${nextStatus}`,
                life: 2000,
            });

            await fetchAdviseList();
        } catch (err) {
            console.error(err);
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không thể cập nhật trạng thái. Vui lòng thử lại.",
                life: 2000,
            });
        }
    };

    const showStatusTemplate = (rowData: AdviseForm) => {
        const checked = Number(rowData.status ?? 0) === 1;

        return (
            <div
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleAdviseStatus(rowData);
                }}
            >
                <Checkbox
                    checked={checked}
                    // Disable single-click behavior; only double-click should trigger API call.
                    onChange={() => {}}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                />
            </div>
        );
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="wrapper">
                <div className="header">
                    <BreadCrumb model={breadcrumbItems} home={home} />
                    <div className="grid">
                        <div className="col-6 header-left flex">
                            <div className="empty"></div>
                            <div className="main-title flex align-items-center ml-2">Tư vấn</div>
                        </div>
                        <div className="col-6 header-right flex align-items-center justify-content-end">
                            {/* <div className="search-btn flex">
                                <InputText
                                    placeholder="Nhập tên hoặc SĐT"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                                <Button icon="pi pi-search" onClick={fetchAdviseList} />
                            </div> */}
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
                    <div>
                        <DataTable value={filteredList}>
                            <Column field="name" header="Họ và tên" />
                            <Column field="phone" header="Số điện thoại" />
                            <Column field="source" header="Nguồn" />
                            <Column field="note" header="Ghi chú" />
                            <Column
                                field="submitDate"
                                header="Thời gian"
                                body={(rowData: AdviseForm) => {
                                    if (!rowData.submitDate) return "";
                                    const d = new Date(rowData.submitDate);
                                    return isNaN(d.getTime())
                                        ? rowData.submitDate
                                        : d.toLocaleString("vi-VN");
                                }}
                            />
                            <Column
                                field="status"
                                header="Đã tư vấn"
                                body={showStatusTemplate}
                            />
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
                </div>
            </div>

        </>
    );
}

export default Advise;