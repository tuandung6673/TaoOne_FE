import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";
import { Sidebar } from 'primereact/sidebar';
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { BannerDetail, DropdownInterface, ItemDetail } from "../../../constants/interface";
import ApiService from "../../../services/api.service";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";

function Banner() {
    const toast = useRef<Toast>(null);
    const op = useRef<OverlayPanel>(null);
    const [visibleRight, setVisibleRight] = useState(false);
    const op2 = useRef<OverlayPanel>(null);
    const home = { icon: "pi pi-home", url: "" };
    const breadcrumbItems = [{ label: "Banner" }];
    const [slideParams, setSlideParams] = useState({
        screen: ''
    });
    const [slideList, setSlideList] = useState<ItemDetail[]>([]);
    const [selectCtg, setSelectCtg] = useState(null);
    const [selectedId, setSelectedId] = useState<string>();
    const [listCtg, setListCtg] = useState<DropdownInterface[]>([]);
    const [bannerDetail, setBannerDetail] = useState<BannerDetail>(new BannerDetail())
    const onUpload = () => {
        if (toast.current) {
            toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
        }
    };
    useEffect(() => {
        fetchCategoryDetail();
    }, []);

    const fetchSlide = async (slideParams: any) => {
        try {
            const queryParams = queryString.stringify(slideParams);
            const slideList = await ApiService.getSlideList(queryParams);
            setSlideList(slideList.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSlide(slideParams);
    }, [slideParams]);

    const fetchCategoryDetail = async () => {
        try {
            const ctgDetailList = await ApiService.getCategoryList(
                queryString.stringify({
                    filter: '',
                })
            );
            const formattedList = ctgDetailList.data.data.map((item: any) => {
                return {
                    label: item.name,
                    value: item.code,
                };
            });
    
            setListCtg([{ label: 'Trang chủ', value: 'home' }, ...formattedList]);
        } catch (err) {
            console.error(err);
        }
    };

    const imageBodyTemplate = (product: any) => {
        return (
            <img
                src={product.img}
                alt={product.img}
                style={{'objectFit': 'cover'}}
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

    const changeCtgHanlder = (e: any) => {
        setSelectCtg(e.value);
        setSlideParams((prevParams) => ({
            ...prevParams,
            screen: e.value ? e.value : "",
        }));
        op2.current?.toggle(e);
    };

    const accept = () => {
        deleteSlide();
    };

    const deleteSlide = async () => {
        try {
            const deleteSlide = await ApiService.deleteSlide(
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
                fetchSlide(slideParams);
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

    const fetchDetailBanner = async () => {
        try {
            const detailBanner = await ApiService.getSlideDetail(selectedId || "")
            setBannerDetail(detailBanner.data)
        } catch (error) {
            console.log(error);
        }
    }

    const viewDetail = () => {
        fetchDetailBanner();
        setVisibleRight(true);
    }

    const handleChangeScreen = (e : any) => {
        setBannerDetail((prev) => ({
            ...prev,
            screen: e.value
        }))
    } 

    const handleChange = (e : any) => {
        const { name, value } = e.target;
        setBannerDetail((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        console.log('bannerDetail', bannerDetail);
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
                                Banner
                            </div>
                        </div>
                        <div className="col-6 header-right flex align-items-center justify-content-end">
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
                                            Màn hình
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
                        <DataTable value={slideList}>
                            <Column
                                field="img"
                                header="Hình ảnh"
                                body={imageBodyTemplate}
                            ></Column>
                            <Column
                                field="screen"
                                header="Màn hình"
                            ></Column>
                            <Column
                                body={optionsTemplate}
                            ></Column>
                        </DataTable>
                    </div>
                    {/* <div className="flex justify-content-between surface-section">
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
                    </div> */}
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
            <Sidebar visible={visibleRight} className="w-6" position="right" onHide={() => setVisibleRight(false)}>
                <h2>Banner</h2>
                <div className="grid">
                    <div className="col-12">
                        <img className="w-full" style={{'height': '300px', 'objectFit': 'contain'}} src={bannerDetail?.img || "https://hochieuqua7.web.app/images/admin/setting/slide/empty-image.png"} alt="" />
                        <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} chooseLabel="Ảnh" />
                    </div>
                    <div className="col-6">
                        <div>Màn hình</div>
                        <Dropdown
                            value={bannerDetail.screen}
                            className='w-full'
                            options={listCtg}
                            onChange={(e) => handleChangeScreen(e)}
                        />
                    </div>
                    <div className="col-6">
                        <div>Tên</div>
                        <InputText 
                            className='w-full'
                            value={bannerDetail.name}
                            name='name'
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                </div>
                <div className='flex mt-5 mr-2 justify-content-end'>
                    <div className='cancel-btn mr-2'>
                        <Button label='Hủy' style={{'height': '40px'}} />
                    </div>
                    <div className='save-btn'>
                        <Button onClick={handleSubmit} label='Lưu' style={{'height': '40px'}} />
                    </div>
                </div>
            </Sidebar>
        </>
    );
}

export default Banner;