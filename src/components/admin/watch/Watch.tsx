import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AllRouteType } from "../../../constants/constants";
import { DropdownInterface, ItemDetail } from "../../../constants/interface";
import ApiService from "../../../services/api.service";
import "./Watch.scss";

const HOME_BREADCRUMB = { icon: "pi pi-home", url: "" };

const CATEGORY_LABELS: Record<string, string> = {
    [AllRouteType.watch]: "Apple Watch",
    [AllRouteType.ipad]: "iPad",
    [AllRouteType.macbook]: "Macbook",
    [AllRouteType.airpods]: "Airpod",
    [AllRouteType.accessories]: "Accessories",
};

const STATUS_OPTIONS = [
    { label: "Tất cả", value: -1 },
    { label: "Hiển thị", value: 1 },
    { label: "Ẩn", value: 0 }
];

function Watch() {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const op = useRef<OverlayPanel>(null);
    const op2 = useRef<OverlayPanel>(null);
    const { categoryName } = useParams<{ categoryName?: string }>();
    const [slideParams, setSlideParams] = useState({
        category_code: "",
        category_detail_id: "",
        filter: "",
        offSet: 0,
        pageSize: 50,
        status: -1,
    });
    const [searchValue, setSearchValue] = useState("");
    const [watchList, setWatchList] = useState<ItemDetail[]>([]);
    const [recordsTotal, setRecordsTotal] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(50);
    const [selectCtg, setSelectCtg] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string>();
    const [listCtg, setListCtg] = useState<DropdownInterface[]>([]);
    const [selectStatus, setSelectStatus] = useState<number | null>(null);

    const breadcrumbLabel = categoryName ? (CATEGORY_LABELS[categoryName] ?? "Accessories") : "";
    const items = useMemo(
        () => [{ label: "Sản phẩm" }, { label: breadcrumbLabel }],
        [breadcrumbLabel]
    );

    const fetchWatch = useCallback(async (params: typeof slideParams) => {
        try {
            const queryParams = queryString.stringify(params);
            const response = await ApiService.getProductList(queryParams);
            setRecordsTotal(response.data.recordsTotal);
            setWatchList(response.data.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        if (!categoryName) return;

        setSlideParams((prevParams) => ({
            ...prevParams,
            category_code: categoryName,
        }));

        const fetchCategoryDetail = async () => {
            try {
                const queryParams = queryString.stringify({
                    category_code: categoryName,
                });
                const ctgDetailList = await ApiService.getCategoryDetailList(
                    queryParams
                );
                setListCtg(
                    ctgDetailList.data.data.map((item: any) => ({
                        label: item.name,
                        value: item.id,
                    }))
                );
            } catch (err) {
                console.error(err);
            }
        };

        fetchCategoryDetail();
    }, [categoryName]);

    useEffect(() => {
        if (slideParams.category_code) fetchWatch(slideParams);
    }, [slideParams, rows, first, fetchWatch]);

    const onPageChange = useCallback((event: PaginatorPageChangeEvent) => {
        setRows(event.rows);
        setFirst(event.first);
        setSlideParams((prevParams) => ({
            ...prevParams,
            offSet: event.first,
            pageSize: event.rows,
        }));
    }, []);

    const imageBodyTemplate = useCallback((product: ItemDetail) => (
        <img
            src={product.img}
            alt={product.img}
            className="w-3rem shadow-2 border-round"
        />
    ), []);

    const priceFormatTemplate = useCallback((rowData: ItemDetail, type: "price" | "salePrice") => {
        if (type === "price") {
            return (
                <span className="opacity-90 line-through">
                    {rowData.price.toLocaleString("vi-VN")}
                </span>
            );
        }
        return (
            <span className="font-semibold">
                {rowData.salePrice.toLocaleString("vi-VN")}
            </span>
        );
    }, []);

    const optionsTemplate = useCallback((rowData: ItemDetail) => (
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

    const showStatusTemplate = useCallback((product: ItemDetail) => (
        <Checkbox checked={String(product.status) === "1"}></Checkbox>
    ), []);

    const searchHandler = useCallback(() => {
        setSlideParams((prevParams) => ({
            ...prevParams,
            filter: searchValue,
        }));
    }, [searchValue]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            searchHandler();
        }
    }, [searchHandler]);

    const changeStatusHanlder = useCallback((e: DropdownChangeEvent) => {
        setSelectStatus(e.value);
        setSlideParams((prevParams) => ({
            ...prevParams,
            status: e.value,
        }));
        op2.current?.toggle(e.originalEvent);
    }, []);

    const changeCtgHanlder = useCallback((e: DropdownChangeEvent) => {
        setSelectCtg(e.value);
        setSlideParams((prevParams) => ({
            ...prevParams,
            category_detail_id: e.value ? e.value : "",
        }));
        op2.current?.toggle(e.originalEvent);
    }, []);

    const deleteProduct = useCallback(async () => {
        try {
            const response = await ApiService.deleteProduct(selectedId || "");
            if (response.status === "success") {
                toast.current?.show({
                    severity: "success",
                    summary: "Thông báo",
                    detail: "Xóa bản ghi thành công !",
                    life: 2000,
                });
                fetchWatch(slideParams);
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
    }, [selectedId, slideParams, fetchWatch]);

    const confirmDelete = useCallback(() => {
        confirmDialog({
            header: "Xác nhận",
            message: "Bạn muốn xóa bản ghi này không ?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "Xóa",
            rejectLabel: "Hủy",
            accept: deleteProduct,
        });
    }, [deleteProduct]);

    const handleAdd = useCallback(() => {
        const currentPath = window.location.pathname;
        navigate(`${currentPath}/them-moi`);
    }, [navigate]);

    const handleEdit = useCallback(() => {
        const currentPath = window.location.pathname;
        navigate(`${currentPath}/${selectedId}`);
    }, [navigate, selectedId]);

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="wrapper">
                <div className="header">
                    <BreadCrumb model={items} home={HOME_BREADCRUMB} />
                    <div className="grid">
                        <div className="col-6 header-left flex">
                            <div className="empty"></div>
                            <div className="main-title flex align-items-center ml-2">
                                {items[1]?.label}
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
                                        <div className="pb-1">
                                            Loại chi tiết
                                        </div>
                                        <Dropdown
                                            value={selectCtg}
                                            onChange={changeCtgHanlder}
                                            options={listCtg}
                                            showClear
                                            placeholder="Lựa chọn"
                                            className="w-full"
                                        // onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="pt-3 pb-1">Trạng thái</div>
                                        <Dropdown
                                            value={selectStatus}
                                            onChange={changeStatusHanlder}
                                            options={STATUS_OPTIONS}
                                            placeholder="Lựa chọn"
                                            className="w-full"
                                        />
                                    </div>
                                </OverlayPanel>
                            </div>
                            <div className="add-btn">
                                <Button
                                    label="Thêm mới"
                                    icon="pi pi-plus"
                                    onClick={handleAdd}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div>
                        <DataTable value={watchList}>
                            <Column
                                field="img"
                                header="Hình ảnh"
                                body={imageBodyTemplate}
                            ></Column>
                            <Column field="name" header="Tên"></Column>
                            <Column
                                field="category_detail_name"
                                header="Loại chi tiết"
                            ></Column>
                            <Column field="size" header="Phiên bản"></Column>
                            <Column
                                field="salePrice"
                                header="Giá bán"
                                body={(rowData) =>
                                    priceFormatTemplate(rowData, "salePrice")
                                }
                            ></Column>
                            <Column
                                field="price"
                                header="Giá niêm yết"
                                body={(rowData) =>
                                    priceFormatTemplate(rowData, "price")
                                }
                            ></Column>
                            <Column field="status" header="Hiển thị" body={showStatusTemplate}></Column>
                            <Column
                                header="Tùy chọn"
                                body={optionsTemplate}
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
                            rowsPerPageOptions={[20, 30, 50, 100]}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
            </div>
            <OverlayPanel ref={op}>
                <div className="sort_option" onClick={handleEdit}>
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

export default Watch;
