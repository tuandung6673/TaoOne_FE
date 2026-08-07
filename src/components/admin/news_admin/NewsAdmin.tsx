import moment from 'moment';
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewsDetail } from "../../../constants/interface";
import ApiService from "../../../services/api.service";

const HOME_BREADCRUMB = { icon: "pi pi-home", url: "" };
const BREADCRUMB_ITEMS = [{ label: "Tin tức" }];

const NewsAdmin = () => {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const op = useRef<OverlayPanel>(null);
    const [newsParams, setNewsParams] = useState({
        filter: "",
        status: null,
        offSet: 0,
        pageSize: 10
    });
    const [newsList, setNewsList] = useState<NewsDetail[]>([]);
    const [selectedId, setSelectedId] = useState<string>();
    const [searchValue, setSearchValue] = useState("");
    const [recordsTotal, setRecordsTotal] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    const fetchNews = useCallback(async (params: typeof newsParams) => {
        try {
            const queryParams = queryString.stringify(params);
            const response = await ApiService.getNewsList(queryParams);
            setRecordsTotal(response.data.recordsTotal);
            setNewsList(response.data.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchNews(newsParams);
    }, [newsParams, fetchNews]);

    const imageBodyTemplate = useCallback((product: NewsDetail) => (
        <img
            src={product.thumbnailUrl}
            alt={product.thumbnailUrl}
            style={{ objectFit: "cover" }}
            className="w-9rem h-4rem shadow-2 border-round"
        />
    ), []);

    const optionsTemplate = useCallback((rowData: NewsDetail) => (
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

    const deleteNews = useCallback(async () => {
        try {
            const response = await ApiService.deleteNews(selectedId || "");
            if (response.status === "success") {
                toast.current?.show({
                    severity: "success",
                    summary: "Thông báo",
                    detail: "Xóa bản ghi thành công !",
                    life: 2000,
                });
                fetchNews(newsParams);
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Thông báo",
                    detail: "Không thành công !",
                    life: 2000,
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
    }, [selectedId, newsParams, fetchNews]);

    const showStatusTemplate = useCallback((product: NewsDetail) => (
        <Checkbox checked={String(product.status) === "1"}></Checkbox>
    ), []);

    const confirmDelete = useCallback(() => {
        confirmDialog({
            header: "Xác nhận",
            message: "Bạn muốn xóa bản ghi này không ?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "Xóa",
            rejectLabel: "Hủy",
            accept: deleteNews,
        });
    }, [deleteNews]);

    const viewDetail = useCallback(() => {
        navigate(`/admin/news/${selectedId}`);
    }, [navigate, selectedId]);

    const handleAddBanner = useCallback(() => {
        const currentPath = window.location.pathname;
        navigate(`${currentPath}/them-moi`);
    }, [navigate]);

    const searchHandler = useCallback(() => {
        setNewsParams((prevParams) => ({
            ...prevParams,
            filter: searchValue,
        }));
    }, [searchValue]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            searchHandler();
        }
    }, [searchHandler]);

    const dateBodyTemplate = useCallback((rowData: NewsDetail, field: 'publishedAt' | 'updatedAt') => {
        const value = rowData?.[field];
        if (!value) return '';
        return moment(value).format('DD/MM/YYYY hh:mm:ss');
    }, []);

    const onPageChange = useCallback((event: PaginatorPageChangeEvent) => {
        setRows(event.rows);
        setFirst(event.first);
        setNewsParams((prevParams) => ({
            ...prevParams,
            offSet: event.first,
            pageSize: event.rows,
        }));
    }, []);

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="wrapper">
                <div className="header">
                    <BreadCrumb model={BREADCRUMB_ITEMS} home={HOME_BREADCRUMB} />
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
                            {/* <Column field="excerpt" header="Mô tả ngắn" body={(rowData) => stripHtmlAndDecode(rowData.excerpt)}></Column> */}
                            <Column field="publishedAt" header="Ngày đăng" body={(rowData) => dateBodyTemplate(rowData, 'publishedAt')}></Column>
                            <Column field="updatedAt" header="Ngày cập nhật" body={(rowData) => dateBodyTemplate(rowData, 'updatedAt')}></Column>
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
                <div className="sort_option" onClick={viewDetail}>
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
