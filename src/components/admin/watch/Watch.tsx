import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AllRouteType } from "../../../constants/constants";
import { DropdownInterface, ItemDetail } from "../../../constants/interface";
import ApiService from "../../../services/api.service";
import "./Watch.scss";

function Watch() {
    const toast = useRef<Toast>(null);
    const op = useRef<OverlayPanel>(null);
    const op2 = useRef<OverlayPanel>(null);
    const home = { icon: "pi pi-home", url: "" };
    const { categoryName } = useParams<{ categoryName?: string }>();
    const [items, setItems] = useState([{ label: "Sản phẩm" }, { label: "" }]);
    const [slideParams, setSlideParams] = useState({
        category_code: "",
        category_detail_id: "",
        filter: "",
        offSet: 0,
        pageSize: 10,
    });
    const [searchValue, setSearchValue] = useState("");
    const [watchList, setWatchList] = useState<ItemDetail[]>([]);
    const [recordsTotal, setRecordsTotal] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [selectCtg, setSelectCtg] = useState(null);
    const [selectedId, setSelectedId] = useState<string>();
    const [listCtg, setListCtg] = useState<DropdownInterface[]>([]);

    useEffect(() => {
        if (categoryName) {
            setSlideParams((prevParams) => ({
                ...prevParams,
                category_code: categoryName,
            }));
            fetchCategoryDetail();
        }
        setItems((prevItems) => {
            const newItems = [...prevItems];
            if (categoryName === AllRouteType.watch) {
                newItems[1].label = "Apple Watch";
            } else if (categoryName === AllRouteType.ipad) {
                newItems[1].label = "iPad";
            } else if (categoryName === AllRouteType.macbook) {
                newItems[1].label = "Macbook";
            } else if (categoryName === AllRouteType.airpods) {
                newItems[1].label = "Airpod";
            } else {
                newItems[1].label = "Accessories";
            }
            return newItems;
        });
    }, [categoryName]);

    const fetchWatch = async (slideParams: any) => {
        try {
            const queryParams = queryString.stringify(slideParams);
            const watchList = await ApiService.getProductList(queryParams);
            setRecordsTotal(watchList.data.recordsTotal);
            setWatchList(watchList.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchWatch(slideParams);
    }, [slideParams, searchValue, rows, first]);

    const fetchCategoryDetail = async () => {
        try {
            const queryParams = queryString.stringify({
                category_code: categoryName,
            });
            const ctgDetailList = await ApiService.GetCategoryDetailList(
                queryParams
            );
            setListCtg(
                ctgDetailList.data.data.map((item: any) => {
                    return {
                        label: item.name,
                        value: item.id,
                    };
                })
            );
        } catch (err) {
            console.error(err);
        }
    };

    const onPageChange = (event: any) => {
        setRows(event.rows);
        setFirst(event.first);
        setSlideParams((prevParams) => ({
            ...prevParams,
            offSet: event.first,
            pageSize: event.rows,
        }));
    };

    const imageBodyTemplate = (product: any) => {
        return (
            <img
                src={product.img}
                alt={product.img}
                className="w-3rem shadow-2 border-round"
            />
        );
    };

    const priceFormatTemplate = (rowData: any, type: any) => {
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

    const searchHandler = () => {
        setSlideParams((prevParams) => ({
            ...prevParams,
            filter: searchValue,
        }));
    };

    const handleKeyDown = (event: any) => {
        if (event && event.key === "Enter") {
            searchHandler();
        }
    };

    const changeCtgHanlder = (e: any) => {
        setSelectCtg(e.value);
        setSlideParams((prevParams) => ({
            ...prevParams,
            category_detail_id: e.value ? e.value : "",
        }));
        op2.current?.toggle(e);
    };

    const accept = () => {
        deleteProduct();
    };

    const deleteProduct = async () => {
        try {
            const deleteProduct = await ApiService.deleteProduct(
                selectedId || ""
            );
            if (deleteProduct.status === "success") {
                if (toast.current) {
                    toast.current.show({
                        severity: "success",
                        summary: "Thông báo",
                        detail: "Xóa bản ghi thành công !",
                        life: 2000,
                    });
                }
                fetchWatch(slideParams);
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
            console.log(err);
        }
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

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="wrapper">
                <div className="header">
                    <BreadCrumb model={items} home={home} />
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
                                        <div className="pb-1">
                                            Loại chi tiết
                                        </div>
                                        <Dropdown
                                            value={selectCtg}
                                            onChange={(e) =>
                                                changeCtgHanlder(e)
                                            }
                                            options={listCtg}
                                            showClear
                                            placeholder="Select"
                                            className="w-full"
                                            // onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </OverlayPanel>
                            </div>
                            <div className="add-btn">
                                <Button label="Thêm mới" icon="pi pi-plus" />
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
                            rowsPerPageOptions={[10, 20, 30]}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
            </div>
            <OverlayPanel ref={op}>
                <div className="sort_option">
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
