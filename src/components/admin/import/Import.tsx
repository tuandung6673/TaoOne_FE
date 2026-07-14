import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import ApiService from "../../../services/api.service";
import "./Import.scss";

function Import() {
    const home = { icon: "pi pi-home", url: "" };
    const breadcrumbItems = [{ label: "Import" }];
    const toast = useRef<Toast>(null);
    const fileUploadRef = useRef<FileUpload>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

    const handleImport = () => {
        if (!selectedFile) {
            toast.current?.show({
                severity: "warn",
                summary: "Chưa chọn file",
                detail: "Vui lòng chọn file để import",
                life: 2000
            });
            return;
        }

        toast.current?.show({
            severity: "info",
            summary: "Import",
            detail: "Chức năng đang được phát triển",
            life: 2000
        });
    };

    return (
        <div className="wrapper import-admin">
            <Toast ref={toast} />
            <div className="header">
                <BreadCrumb model={breadcrumbItems} home={home} />
                <div className="grid">
                    <div className="col-6 header-left flex">
                        <div className="empty"></div>
                        <div className="main-title flex align-items-center ml-2">Import</div>
                    </div>
                    <div className="col-6 header-right flex align-items-center justify-content-end">
                        <Button
                            label="Tải file mẫu"
                            icon="pi pi-download"
                            className="p-button-outlined mr-2"
                            onClick={handleDownloadTemplate}
                        />
                    </div>
                </div>
            </div>

            <div className="card">
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
                    emptyTemplate={<p className="m-0">Kéo thả file vào đây hoặc bấm "Chọn file" (.xlsx, .xls, .csv)</p>}
                />

                <div className="import-actions flex justify-content-end mt-3">
                    <Button
                        label="Hủy"
                        icon="pi pi-times"
                        className="p-button-text mr-2"
                        onClick={handleClearFile}
                        disabled={!selectedFile}
                    />
                    <Button
                        label="Import"
                        icon="pi pi-upload"
                        onClick={handleImport}
                        disabled={!selectedFile}
                    />
                </div>
            </div>
        </div>
    );
}

export default Import;
