import he from 'he';
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemDetail } from "../../../constants/interface";
import ApiService from "../../../services/api.service";

const NewsAdmin = () => {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const op = useRef<OverlayPanel>(null);
    const home = { icon: "pi pi-home", url: "" };
    const breadcrumbItems = [{ label: "Tin tức" }];
    const [newsParams, setNewsParams] = useState({
        filter: "",
        status: null,
        offSet: 0,
        pageSize: 10
    });
    const [newsList, setNewsList] = useState<ItemDetail[]>([]);
    const [selectedId, setSelectedId] = useState<string>();
    const [searchValue, setSearchValue] = useState("");
    const [recordsTotal, setRecordsTotal] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    const fetchNews = async (newsParams: any) => {
        try {
            const queryParams = queryString.stringify(newsParams);
            const newsList = await ApiService.getNewsList(queryParams);
            setRecordsTotal(newsList.data.recordsTotal);
            setNewsList(newsList.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNews(newsParams);
    }, [newsParams]);

    const imageBodyTemplate = (product: any) => {
        return (
            <img
                src={product.thumbnailUrl}
                alt={product.thumbnailUrl}
                style={{ objectFit: "cover" }}
                className="w-9rem h-3rem shadow-2 border-round"
            />
        );
    };

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

    const accept = () => {
        deleteNews();
    };

    const deleteNews = async () => {
        try {
            const deleteNews = await ApiService.deleteNews(selectedId || "");
            if (deleteNews.status === "success") {
                if (toast.current) {
                    toast.current.show({
                        severity: "success",
                        summary: "Thông báo",
                        detail: "Xóa bản ghi thành công !",
                        life: 2000,
                    });
                }
                fetchNews(newsParams);
            } else {
                if (toast.current) {
                    toast.current.show({
                        severity: "error",
                        summary: "Thông báo",
                        detail: "Không thành công !",
                        life: 2000,
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

    const showStatusTemplate = (product: any) => {
        return <Checkbox checked={product.status == "1"}></Checkbox>;
    };

    const confirmDelete = () => {
        confirmDialog({
            header: "Xác nhận",
            message: "Bạn muốn xóa bản ghi này không ?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "Xóa",
            rejectLabel: "Hủy",
            accept,
        });
    };

    const viewDetail = () => {
        navigate(`/admin/news/${selectedId}`);
    };

    const handleAddBanner = () => {
        const currentPath = window.location.pathname;
        navigate(`${currentPath}/them-moi`);
    };

    const searchHandler = () => {
        setNewsParams((prevParams) => ({
            ...prevParams,
            filter: searchValue,
        }));
    };

    const handleKeyDown = (event: any) => {
        if (event && event.key === "Enter") {
            searchHandler();
        }
    };

    const stripHtmlAndDecode = (html: string) => {
        // Bỏ thẻ HTML
        const stripped = html.replace(/<\/?[^>]+(>|$)/g, '');
        // Decode HTML entities
        return he.decode(stripped);
    };

    const onPageChange = (event: any) => {
        setRows(event.rows);
        setFirst(event.first);
        setNewsParams((prevParams) => ({
            ...prevParams,
            offSet: event.first,
            pageSize: event.rows,
        }));
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
                            <div className="main-title flex align-items-center ml-2">
                                Tin tức
                            </div>
                        </div>
                        <div className="col-6 header-right flex align-items-center justify-content-end">
                            <div className="search-btn flex">
                                <InputText
                                    placeholder="Nhập nội dung tìm kiếm"
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
                            <div className="add-btn">
                                <Button
                                    onClick={handleAddBanner}
                                    label="Thêm mới"
                                    icon="pi pi-plus"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div>
                        <DataTable value={newsList}>
                            <Column
                                field="thumbnailUrl"
                                header="Thumbnail"
                                body={imageBodyTemplate}
                            ></Column>
                            <Column field="title" header="Tiêu đề"></Column>
                            <Column field="slug" header="Slug"></Column>
                            <Column field="excerpt" header="Mô tả ngắn" body={(rowData) => stripHtmlAndDecode(rowData.excerpt)}></Column>
                            <Column field="publishedAt" header="Ngày đăng"></Column>
                            <Column field="updatedAt" header="Ngày cập nhật"></Column>
                            <Column
                                field="status"
                                header="Hiển thị"
                                body={showStatusTemplate}
                            ></Column>
                            <Column body={optionsTemplate}></Column>
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
            <OverlayPanel ref={op}>
                <div className="sort_option" onClick={() => viewDetail()}>
                    <span className="mr-2">
                        <i className="pi pi-pencil"></i>
                    </span>
                    Chỉnh sửa
                </div>
                <div className="sort_option" onClick={confirmDelete}>
                    <span className="mr-2">
                        <i className="pi pi-trash text-red-500"></i>
                    </span>
                    Xóa
                </div>
            </OverlayPanel>
        </>
    );
}

export default NewsAdmin;    