import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import ApiService from "../../../services/api.service";
import "./Import.scss";

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
    label: `Tháng ${i + 1}`,
    value: i + 1
}));

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => {
    const year = CURRENT_YEAR - i;
    return { label: String(year), value: year };
});

function Import() {
    const home = { icon: "pi pi-home", url: "" };
    const breadcrumbItems = [{ label: "Import" }];
    const toast = useRef<Toast>(null);
    const fileUploadRef = useRef<FileUpload>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(CURRENT_YEAR);
    const [uploading, setUploading] = useState(false);

    const handleSelectFile = (e: FileUploadSelectEvent) => {
        setSelectedFile(e.files[0] ?? null);
    };

    const handleClearFile = () => {
        setSelectedFile(null);
        fileUploadRef.current?.clear();
    };

    const handleDownloadTemplate = async () => {
        try {
            const blob = await ApiService.downloadProductSample();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "TaoOne_DoanhThuThang.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không thể tải file mẫu. Vui lòng thử lại.",
                life: 2000
            });
        }
    };

    const handleImport = async () => {
        if (!selectedFile) {
            toast.current?.show({
                severity: "warn",
                summary: "Chưa chọn file",
                detail: "Vui lòng chọn file để import",
                life: 2000
            });
            return;
        }

        setUploading(true);
        try {
            await ApiService.uploadSaleRecordFile(selectedFile, month, year);
            toast.current?.show({
                severity: "success",
                summary: "Import thành công",
                detail: "File đã được tải lên thành công",
                life: 2000
            });
            handleClearFile();
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không thể import file. Vui lòng thử lại.",
                life: 2000
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="wrapper import-admin">
            <Toast ref={toast} />
            <div className="header">
                <BreadCrumb model={breadcrumbItems} home={home} />
                <div className="grid">
                    <div className="col-6 header-left flex">
                        <div className="empty"></div>
                        <div className="main-title flex align-items-center ml-2">Import doanh thu</div>
                    </div>
                    <div className="col-6 header-right flex align-items-center justify-content-end">
                        <Button
                            label="Tải file mẫu"
                            icon="pi pi-download"
                            className="p-button-outlined"
                            onClick={handleDownloadTemplate}
                        />
                    </div>
                </div>
            </div>

            <div className="card import-card">
                <div className="import-section">
                    <div className="import-section-title">1. Chọn thời gian import</div>
                    <div className="grid">
                        <div className="col-12 md:col-3">
                            <label className="import-label">Tháng</label>
                            <Dropdown
                                value={month}
                                options={MONTH_OPTIONS}
                                onChange={(e) => setMonth(e.value)}
                                className="w-full"
                                placeholder="Chọn tháng"
                            />
                        </div>
                        <div className="col-12 md:col-3">
                            <label className="import-label">Năm</label>
                            <Dropdown
                                value={year}
                                options={YEAR_OPTIONS}
                                onChange={(e) => setYear(e.value)}
                                className="w-full"
                                placeholder="Chọn năm"
                            />
                        </div>
                    </div>
                </div>

                <div className="import-section">
                    <div className="import-section-title">2. Chọn file dữ liệu</div>
                    <FileUpload
                        ref={fileUploadRef}
                        name="importFile"
                        accept=".xlsx,.xls,.csv"
                        maxFileSize={10000000}
                        customUpload
                        auto={false}
                        chooseLabel="Chọn file"
                        onSelect={handleSelectFile}
                        onClear={() => setSelectedFile(null)}
                        emptyTemplate={
                            <div className="import-dropzone">
                                <i className="pi pi-cloud-upload import-dropzone-icon"></i>
                                <p className="m-0">Kéo thả file vào đây hoặc bấm "Chọn file"</p>
                                <p className="m-0 import-dropzone-hint">Định dạng hỗ trợ: .xlsx, .xls, .csv</p>
                            </div>
                        }
                    />
                </div>

                <div className="import-actions flex justify-content-end">
                    <Button
                        label="Hủy"
                        icon="pi pi-times"
                        className="p-button-text mr-2"
                        onClick={handleClearFile}
                        disabled={!selectedFile || uploading}
                    />
                    <Button
                        label="Import"
                        icon="pi pi-upload"
                        onClick={handleImport}
                        disabled={!selectedFile}
                        loading={uploading}
                    />
                </div>
            </div>
        </div>
    );
}

export default Import;
