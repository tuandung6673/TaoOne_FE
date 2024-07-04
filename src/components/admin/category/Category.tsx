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
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import {
    CategoryDetail,
    Category as Ctg,
    DropdownInterface,
} from "../../../constants/interface";
import ApiService from "../../../services/api.service";

function Category() {
    const onUpload = () => {
        if (toast.current) {
            toast.current.show({
                severity: "info",
                summary: "Success",
                detail: "File Uploaded",
            });
        }
    };
    const toast = useRef<Toast>(null);
    const home = { icon: "pi pi-home", url: "" };
    const op = useRef<OverlayPanel>(null);
    const op2 = useRef<OverlayPanel>(null);
    const breadcrumbItems = [{ label: "Phân loại" }, { label: "Loại" }];

    const [selectedId, setSelectedId] = useState<string>();
    const [selectedDetailId, setSelectedDetailId] = useState<string>();

    const [detailCtg, setDetailCtg] = useState<Ctg>(new Ctg());
    const [detailDetailCtg, setDetailDetailCtg] = useState<CategoryDetail>(
        new CategoryDetail()
    );

    const [combinedData, setCombinedData] = useState([]);
    const [visibleRight, setVisibleRight] = useState(false);
    const [visibleLeft, setVisibleLeft] = useState(false);
    const [listCtg, setListCtg] = useState<DropdownInterface[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { categories, categoryDetails } =
            await fetchCategoriesAndDetails();
        const combined = combineCategoryAndDetails(categories, categoryDetails);
        setCombinedData(combined);
    };

    const fetchCategoriesAndDetails = async () => {
        try {
            const [categoryResponse, categoryDetailResponse] =
                await Promise.all([
                    ApiService.getCategoryList(
                        queryString.stringify({ filter: "" })
                    ), // Giả sử đây là API lấy danh sách category
                    ApiService.getCategoryDetailList(
                        queryString.stringify({
                            category_code: "",
                            screen: "admin",
                        })
                    ), // Giả sử đây là API lấy danh sách category detail
                ]);

            const categories = categoryResponse?.data?.data;
            const listCtg = categories.map((item: any) => {
                return {
                    label: item.name,
                    value: item.id,
                };
            });
            setListCtg(listCtg);
            const categoryDetails = categoryDetailResponse?.data?.data;

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
            const childs = categoryDetails
                ? categoryDetails.filter(
                      (detail: any) => detail.category_id === category.id
                  )
                : [];
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

    const statusTemplate = (product: any) => {
        return <Checkbox checked={product.status == "1"}></Checkbox>;
    };

    const showHomeTemplate = (product: any) => {
        return <Checkbox checked={product.is_show_home == "1"}></Checkbox>;
    };

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
                    setSelectedDetailId(rowData.id);
                }}
            >
                <i className="pi pi-ellipsis-v"></i>
            </span>
        );
    };

    const acceptCtg = async () => {
        try {
            const deleteCtg = await ApiService.deleteCategory(selectedId || "");
            if (deleteCtg.status === "success") {
                if (toast.current) {
                    toast.current.show({
                        severity: "success",
                        summary: "Thông báo",
                        detail: "Xóa bản ghi thành công !",
                        life: 3000,
                    });
                }
                fetchCategoriesAndDetails();
            } else {
                if (toast.current) {
                    toast.current.show({
                        severity: "error",
                        summary: "Thông báo",
                        detail: deleteCtg.message || "Không thành công !",
                        life: 3000,
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const acceptCtgDetail = async () => {
        try {
            const deleteCtg = await ApiService.deleteCategoryDetail(
                selectedDetailId || ""
            );
            if (toast.current) {
                toast.current.show({
                    severity:
                        deleteCtg.status === "success" ? "success" : "error",
                    summary: "Thông báo",
                    detail: deleteCtg.message,
                    life: 3000,
                }); 
            }
            if(deleteCtg.status === "success") {
                fetchData()
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
            accept: acceptCtg,
        });
    };

    const confirmDeleteCtgDetail = () => {
        confirmDialog({
            header: "Xác nhận",
            message: "Bạn muốn xóa bản ghi này không ?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "Xóa",
            rejectLabel: "Hủy",
            accept: acceptCtgDetail,
        });
    };

    const fetchCtgDetail = async () => {
        try {
            const detailCtg = await ApiService.getCategoryDetail(
                selectedId || ""
            );
            setDetailCtg(detailCtg.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCtgDetailDetail = async () => {
        try {
            const detailDetailCtg = await ApiService.getCategoryDetailDetail(
                selectedDetailId || ""
            );
            setDetailDetailCtg(detailDetailCtg.data);
        } catch (error) {
            console.log(error);
        }
    };

    const changeCtgHanlder = (e: any) => {
        setDetailDetailCtg((prevParams) => ({
            ...prevParams,
            category_id: e.value ? e.value : "",
        }));
    };

    const viewCtgDetail = () => {
        fetchCtgDetail();
        setVisibleRight(true);
    };

    const handleEditDetailDetailCtg = () => {
        fetchCtgDetailDetail();
        setVisibleLeft(true);
    };

    const handleCtgChange = (e: any) => {
        const { name, checked, value } = e.target;
        setDetailCtg((prev) => ({
            ...prev,
            [name]: value != null ? value : checked ? 1 : 0,
        }));
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setDetailDetailCtg((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveDetailCtg = async () => {
        const data: Ctg = detailCtg;
        if (!selectedId) {
            delete data.id;
        }
        delete data.products;
        try {
            const response = await ApiService.postCategory(data);
            if (response.status === "success" && toast.current) {
                toast.current.show({
                    severity: "success",
                    summary: "Thành công",
                    detail:
                        (!!selectedId ? "Lưu" : "Thêm mới") + " thành công !",
                });
                fetchData();
                setVisibleRight(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const submitDetailDetail = async () => {
        // console.log(detailDetailCtg);
        const data: any = detailDetailCtg;
        if (!selectedDetailId) {
            delete data.id;
        }
        try {
            const response = await ApiService.postCategoryDetail(data);
            if (response.status === "success" && toast.current) {
                toast.current.show({
                    severity: "success",
                    summary: "Thành công",
                    detail:
                        (!!selectedDetailId ? "Lưu" : "Thêm mới") +
                        " thành công !",
                });
                fetchData();
                setVisibleLeft(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddCtg = () => {
        setSelectedId(undefined);
        setVisibleRight(true);
        setDetailCtg(new Ctg());
    };

    const addCtgDetail = () => {
        setVisibleLeft(true);
        const newData : CategoryDetail = new CategoryDetail();
        newData.category_id = selectedId || "";
        setDetailDetailCtg(newData)
    }

    const rowExpansionTemplate = (data: any) => {
        return (
            <>
                <div>
                    <DataTable value={data.childs}>
                        <Column
                            className="w-4rem"
                            header="#"
                            body={(data, options) => options.rowIndex + 1}
                        ></Column>
                        <Column field="name" header="Loại chi tiết"></Column>
                        <Column
                            header="Số sản phẩm"
                            field="product_count"
                        ></Column>
                        <Column body={optionsTemplate2}></Column>
                    </DataTable>
                </div>
                <OverlayPanel ref={op2}>
                    <div
                        className="sort_option"
                        onClick={handleEditDetailDetailCtg}
                    >
                        <span className="mr-2">
                            <i className="pi pi-pencil"></i>
                        </span>
                        Chỉnh sửa
                    </div>
                    <div
                        className="sort_option"
                        onClick={confirmDeleteCtgDetail}
                    >
                        <span className="mr-2">
                            <i className="pi pi-trash text-red-500"></i>
                        </span>
                        Xóa
                    </div>
                </OverlayPanel>
            </>
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
                            <div className="main-title flex align-items-center ml-2">
                                Loại
                            </div>
                        </div>
                        <div className="col-6 header-right flex align-items-center justify-content-end">
                            <div className="add-btn">
                                <Button
                                    onClick={handleAddCtg}
                                    label="Thêm mới"
                                    icon="pi pi-plus"
                                />
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
                            <Column
                                expander={allowExpansion}
                                style={{ width: "5rem" }}
                            />
                            <Column
                                field="img"
                                header="Hình ảnh"
                                body={imageBodyTemplate}
                            ></Column>
                            <Column field="code" header="Mã"></Column>
                            <Column field="name" header="Tên"></Column>
                            <Column field="order" header="STT"></Column>
                            <Column
                                field="status"
                                header="Trạng thái"
                                body={statusTemplate}
                            ></Column>
                            <Column
                                field="is_show_home"
                                header="HT Trang chủ"
                                body={showHomeTemplate}
                            ></Column>
                            <Column body={optionsTemplate}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <OverlayPanel ref={op}>
                <div className="sort_option" onClick={addCtgDetail}>
                    <span className="mr-2">
                        <i className="pi pi-plus" style={{'color': '#007bff'}}></i>
                    </span>
                    Thêm
                </div>
                <div className="sort_option" onClick={viewCtgDetail}>
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
            <Sidebar
                visible={visibleRight}
                className="w-6"
                position="right"
                onHide={() => setVisibleRight(false)}
            >
                <h2>Loại</h2>
                <div className="grid">
                    <div className="col-12">
                        <img
                            className="w-full"
                            style={{ height: "300px", objectFit: "none" }}
                            src={
                                detailCtg?.img ||
                                "https://hochieuqua7.web.app/images/admin/setting/slide/empty-image.png"
                            }
                            alt=""
                        />
                        <FileUpload
                            mode="basic"
                            name="demo[]"
                            url="/api/upload"
                            accept="image/*"
                            maxFileSize={1000000}
                            onUpload={onUpload}
                            chooseLabel="Ảnh"
                        />
                    </div>
                    <div className="col-6">
                        <div>Mã</div>
                        <InputText
                            className="w-full"
                            value={detailCtg.code}
                            name="code"
                            onChange={(e) => handleCtgChange(e)}
                            disabled={!!selectedId}
                        />
                    </div>
                    <div className="col-6">
                        <div>Tên</div>
                        <InputText
                            className="w-full"
                            value={detailCtg.name}
                            name="name"
                            onChange={(e) => handleCtgChange(e)}
                        />
                    </div>
                    <div className="col-6">
                        <div>STT</div>
                        <InputText
                            className="w-full"
                            value={detailCtg.order.toString()}
                            name="order"
                            onChange={(e) => handleCtgChange(e)}
                        />
                    </div>
                    <div className="col-3">
                        <div>Trạng thái</div>
                        <Checkbox
                            name="status"
                            onChange={(e) => handleCtgChange(e)}
                            checked={detailCtg.status === 1 ? true : false}
                        ></Checkbox>
                    </div>
                    <div className="col-3">
                        <div>Hiển thị Trang chủ</div>
                        <Checkbox
                            name="is_show_home"
                            onChange={(e) => handleCtgChange(e)}
                            checked={
                                detailCtg.is_show_home === 1 ? true : false
                            }
                        ></Checkbox>
                    </div>
                </div>
                <div className="flex mt-5 mr-2 justify-content-end">
                    <div
                        className="cancel-btn mr-2"
                        onClick={() => setVisibleRight(false)}
                    >
                        <Button label="Hủy" style={{ height: "40px" }} />
                    </div>
                    <div className="save-btn" onClick={handleSaveDetailCtg}>
                        <Button label="Lưu" style={{ height: "40px" }} />
                    </div>
                </div>
            </Sidebar>

            <Dialog
                header="Loại chi tiết"
                visible={visibleLeft}
                style={{ width: "500px" }}
                onHide={() => {
                    if (!visibleLeft) return;
                    setVisibleLeft(false);
                }}
            >
                <div className="grid">
                    <div className="col-12">
                        <div>Loại</div>
                        <Dropdown
                            className="w-full"
                            options={listCtg}
                            value={detailDetailCtg.category_id}
                            onChange={(e) => changeCtgHanlder(e)}
                            disabled={!!selectedDetailId}
                        />
                    </div>
                    <div className="col-12">
                        <div>Tên</div>
                        <InputText
                            className="w-full"
                            name="name"
                            value={detailDetailCtg.name}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                </div>
                <div className="flex mt-5 mr-2 justify-content-end">
                    <div
                        className="cancel-btn mr-2"
                        onClick={() => setVisibleLeft(false)}
                    >
                        <Button label="Hủy" style={{ height: "40px" }} />
                    </div>
                    <div className="save-btn" onClick={submitDetailDetail}>
                        <Button label="Lưu" style={{ height: "40px" }} />
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default Category;
