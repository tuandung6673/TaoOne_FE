import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { useCallback, useEffect, useRef, useState } from "react";
import ApiService from "../../../services/api.service";
import "./Import.scss";

const HOME_BREADCRUMB = { icon: "pi pi-home", url: "" };
const BREADCRUMB_ITEMS = [{ label: "Import" }, { label: "Lịch sử" }];

interface ImportHistoryItem {
    importBatchId: string;
    fileName: string;
    recordCount: number;
    month: number;
    year: number;
    importedAt: string;
}

const sttTemplate = (_rowData: ImportHistoryItem, options: { rowIndex: number }) => options.rowIndex + 1;

const monthYearTemplate = (rowData: ImportHistoryItem) => `Tháng ${rowData.month}/${rowData.year}`;

const importedAtTemplate = (rowData: ImportHistoryItem) =>
    new Date(rowData.importedAt).toLocaleString("vi-VN");

function ImportHistory() {
    const toast = useRef<Toast>(null);

    const [history, setHistory] = useState<ImportHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const res = await ApiService.getImportHistory();
            setHistory(Array.isArray(res?.data) ? res.data : []);
        } catch (err) {
            setHistory([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleDelete = useCallback(async (rowData: ImportHistoryItem) => {
        try {
            await ApiService.deleteImportHistory(rowData.importBatchId);
            toast.current?.show({
                severity: "success",
                summary: "Đã xóa",
                detail: `Xóa lịch sử import "${rowData.fileName}" thành công`,
                life: 2000
            });
            await fetchHistory();
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không thể xóa bản ghi. Vui lòng thử lại.",
                life: 2000
            });
        }
    }, [fetchHistory]);

    const confirmDelete = useCallback((rowData: ImportHistoryItem) => {
        confirmDialog({
            message: `Bạn có chắc muốn xóa lịch sử import file "${rowData.fileName}"?`,
            header: "Xác nhận xóa",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Xóa",
            rejectLabel: "Hủy",
            acceptClassName: "p-button-danger",
            accept: () => handleDelete(rowData)
        });
    }, [handleDelete]);

    const actionTemplate = useCallback((rowData: ImportHistoryItem) => (
        <Button
            icon="pi pi-trash"
            className="p-button-text p-button-danger"
            onClick={() => confirmDelete(rowData)}
        />
    ), [confirmDelete]);

    return (
        <div className="wrapper import-admin">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="header">
                <BreadCrumb model={BREADCRUMB_ITEMS} home={HOME_BREADCRUMB} />
                <div className="grid">
                    <div className="col-6 header-left flex">
                        <div className="empty"></div>
                        <div className="main-title flex align-items-center ml-2">Lịch sử import</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <DataTable value={history} loading={loading} dataKey="importBatchId">
                    <Column header="STT" body={sttTemplate} style={{ width: "5rem" }} />
                    <Column field="fileName" header="Tên file import" />
                    <Column field="recordCount" header="Số dòng import" style={{ width: "12rem" }} />
                    <Column header="Thời gian import cho" body={monthYearTemplate} style={{ width: "12rem" }} />
                    <Column header="Ngày thực tế import" body={importedAtTemplate} style={{ width: "14rem" }} />
                    <Column header="Chức năng" body={actionTemplate} style={{ width: "8rem" }} />
                </DataTable>
            </div>
        </div>
    );
}

export default ImportHistory;
