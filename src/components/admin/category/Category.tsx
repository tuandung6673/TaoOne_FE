/* eslint-disable eqeqeq */
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
    DataTable,
    DataTableExpandedRows,
    DataTableValueArray,
} from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { Category as Ctg } from "../../../constants/interface";
import ApiService from "../../../services/api.service";

function Category() {
    const toast = useRef<Toast>(null);
    const home = { icon: "pi pi-home", url: "" };
    const op = useRef<OverlayPanel>(null);
    const op2 = useRef<OverlayPanel>(null);
    const breadcrumbItems = [{ label: "Phân loại" }, { label: "Loại" }];
    const [slideList, setSlideList] = useState<Ctg[]>([]);
    const [selectedId, setSelectedId] = useState<string>();
    const [combinedData, setCombinedData] = useState([]);

    const fetchSlide = async () => {
        try {
            const slideList = await ApiService.getCategoryList(
                queryString.stringify({ filter: "" })
            );
            setSlideList(slideList.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const { categories, categoryDetails } =
                await fetchCategoriesAndDetails();
            const combined = combineCategoryAndDetails(
                categories,
                categoryDetails
            );
            setCombinedData(combined);
            console.log('combined', combined);
            
        };

        fetchData();
    }, []);

    const fetchCategoriesAndDetails = async () => {
        try {
            const [categoryResponse, categoryDetailResponse] =
                await Promise.all([
                    ApiService.getCategoryList(
                        queryString.stringify({ filter: "" })
                    ), // Giả sử đây là API lấy danh sách category
                    ApiService.getCategoryDetailList(
                        queryString.stringify({ category_code: "", screen: 'admin' })
                    ), // Giả sử đây là API lấy danh sách category detail
                ]);

            const categories = categoryResponse.data.data;
            const categoryDetails = categoryDetailResponse.data.data;

            return { categories, categoryDetails };
        } catch (err) {
            console.error(err);
            return { categories: [], categoryDetails: [] };
        }
    };

    const combineCategoryAndDetails = (
        categories: any,
        categoryDetails: any
    ) => {
        return categories.map((category: any) => {
            const childs = categoryDetails.filter(
                (detail: any) => detail.category_id === category.id
            );
            return {
                ...category,
                childs,
            };
        });
    };

    const allowExpansion = (rowData: any) => {
        return rowData.childs?.length > 0;
    };

    const imageBodyTemplate = (product: any) => {
        return (
            <img
                src={product.img}
                alt={product.img}
                style={{ objectFit: "contain" }}
                className="w-9rem h-3rem shadow-2 border-round"
            />
        );
    };

    const statusTemplate = (product : any) => {
        return (
            <Checkbox checked={product.status == "1"}></Checkbox>
        )
    }

    const showHomeTemplate = (product : any) => {
        return (
            <Checkbox checked={product.is_show_home == "1"}></Checkbox>
        )
    }

    const [expandedRows, setExpandedRows] = useState<
        DataTableExpandedRows | DataTableValueArray | undefined
    >(undefined);

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

    const optionsTemplate2 = (rowData: any) => {
        return (
            <span
                className="flex justify-content-center"
                onClick={(e) => {
                    op2.current?.toggle(e);
                    // setSelectedId(rowData.id);
                }}
            >
                <i className="pi pi-ellipsis-v"></i>
            </span>
        );
    };

    const accept = () => {
        deleteSlide();
    };

    const deleteSlide = async () => {
        try {
            const deleteSlide = await ApiService.deleteCategory(
                selectedId || ""
            );
            if (deleteSlide.status === "success") {
                if (toast.current) {
                    toast.current.show({
                        severity: "success",
                        summary: "Thông báo",
                        detail: "Xóa bản ghi thành công !",
                        life: 2000,
                    });
                }
                fetchSlide();
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

    const rowExpansionTemplate = (data : any) => {
        return (
            <>
                <div>
                    <DataTable value={data.childs}>
                        <Column className="w-4rem" header="#" body={(data, options) => options.rowIndex + 1}></Column>
                        <Column field="name" header="Loại chi tiết"></Column>
                        <Column header="Số sản phẩm" field="product_count"></Column>
                        <Column body={optionsTemplate2}></Column>
                    </DataTable>
                </div>
                <OverlayPanel ref={op2}>
                <div className="sort_option">
                    <span className="mr-2">
                        <i className="pi pi-pencil"></i>
                    </span>
                    Chỉnh sửa
                </div>
                <div className="sort_option">
                    <span className="mr-2">
                        <i className="pi pi-trash text-red-500"></i>
                    </span>
                    Xóa
                </div>
            </OverlayPanel>
            </>
        )
    }

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
                                Loại
                            </div>
                        </div>
                        <div className="col-6 header-right flex align-items-center justify-content-end">
                            <div className="add-btn">
                                <Button label="Thêm mới" icon="pi pi-plus" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div>
                        <DataTable
                            value={combinedData}
                            expandedRows={expandedRows}
                            onRowToggle={(e) => setExpandedRows(e.data)}
                            rowExpansionTemplate={rowExpansionTemplate}
                            dataKey="id"
                        >
                            <Column expander={allowExpansion} style={{ width: '5rem' }} />
                            <Column
                                field="img"
                                header="Hình ảnh"
                                body={imageBodyTemplate}
                            ></Column>
                            <Column field="name" header="Tên"></Column>
                            <Column field="code" header="Mã"></Column>
                            <Column field="status" header="Trạng thái" body={statusTemplate}></Column>
                            <Column field="is_show_home" header="HT Trang chủ" body={showHomeTemplate}></Column>
                            <Column body={optionsTemplate}></Column>
                        </DataTable>
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

export default Category;
