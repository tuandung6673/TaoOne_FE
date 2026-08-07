import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useCallback, useEffect, useRef, useState } from "react";
import { ROLE } from "../../../constants/constants";
import {
    BannerDetail,
    DropdownInterface,
} from "../../../constants/interface";
import ApiService from "../../../services/api.service";
import ImagePickerDialog from "../../PickerDialog/ImagePickerDialog";
import "./banner.scss";

const HOME_BREADCRUMB = { icon: "pi pi-home", url: "" };
const BREADCRUMB_ITEMS = [{ label: "Banner" }];
const EMPTY_IMAGE_URL = "https://hochieuqua7.web.app/images/admin/setting/slide/empty-image.png";

function Banner() {
    const toast = useRef<Toast>(null);
    const op = useRef<OverlayPanel>(null);
    const [visibleRight, setVisibleRight] = useState(false);
    const op2 = useRef<OverlayPanel>(null);
    const [image, setImage] = useState<File | null>(null);
    const [isChangeAvatar, setIsChangeAvatar] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [slideParams, setSlideParams] = useState({
        screen: "",
        rules: (window.location.pathname).includes(ROLE.admin) ? 'admin' : null
    });
    const [slideList, setSlideList] = useState<BannerDetail[]>([]);
    const [selectCtg, setSelectCtg] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string>();
    const [showImagePicker, setShowImagePicker] = useState<boolean>(false);
    const [listCtg, setListCtg] = useState<DropdownInterface[]>([]);
    const [bannerDetail, setBannerDetail] = useState<BannerDetail>(
        new BannerDetail()
    );

    const fetchSlide = useCallback(async (params: typeof slideParams) => {
        try {
            const queryParams = queryString.stringify(params);
            const response = await ApiService.getSlideList(queryParams);
            setSlideList(response.data.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        const fetchCategoryDetail = async () => {
            try {
                const ctgDetailList = await ApiService.getCategoryList(
                    queryString.stringify({
                        filter: "",
                    })
                );
                const formattedList = ctgDetailList.data.data.map((item: any) => ({
                    label: item.name,
                    value: item.code,
                }));

                setListCtg([
                    { label: "Trang chủ", value: "home" },
                    ...formattedList,
                ]);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCategoryDetail();
    }, []);

    useEffect(() => {
        fetchSlide(slideParams);
    }, [slideParams, fetchSlide]);

    const imageBodyTemplate = useCallback((banner: BannerDetail) => (
        <img
            src={banner.img}
            alt={banner.img}
            style={{ objectFit: "cover" }}
            className="w-9rem h-3rem shadow-2 border-round"
        />
    ), []);

    const optionsTemplate = useCallback((banner: BannerDetail) => (
        <span
            className="flex justify-content-center"
            onClick={(e) => {
                op.current?.toggle(e);
                setSelectedId(banner.id);
            }}
        >
            <i className="pi pi-ellipsis-v"></i>
        </span>
    ), []);

    const showHomeTemplate = useCallback((banner: BannerDetail) => (
        <Checkbox checked={String(banner.status) === "1"}></Checkbox>
    ), []);

    const changeCtgHanlder = useCallback((e: DropdownChangeEvent) => {
        setSelectCtg(e.value);
        setSlideParams((prevParams) => ({
            ...prevParams,
            screen: e.value ? e.value : "",
        }));
        op2.current?.toggle(e.originalEvent);
    }, []);

    const deleteSlide = useCallback(async () => {
        try {
            const deleteResult = await ApiService.deleteSlide(selectedId || "");
            if (deleteResult.status === "success") {
                toast.current?.show({
                    severity: "success",
                    summary: "Thông báo",
                    detail: "Xóa bản ghi thành công !",
                    life: 2000,
                });
                fetchSlide(slideParams);
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
    }, [selectedId, slideParams, fetchSlide]);

    const confirmDelete = useCallback(() => {
        confirmDialog({
            header: "Xác nhận",
            message: "Bạn muốn xóa bản ghi này không ?",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "Xóa",
            rejectLabel: "Hủy",
            accept: deleteSlide,
        });
    }, [deleteSlide]);

    const fetchDetailBanner = useCallback(async () => {
        try {
            const detailBanner = await ApiService.getSlideDetail(
                selectedId || ""
            );
            setBannerDetail(detailBanner.data);
            setImageUrl(detailBanner.data.img);
        } catch (error) {
            console.log(error);
        }
    }, [selectedId]);

    const viewDetail = useCallback(() => {
        fetchDetailBanner();
        setVisibleRight(true);
    }, [fetchDetailBanner]);

    const handleChangeScreen = useCallback((e: DropdownChangeEvent) => {
        setBannerDetail((prev) => ({
            ...prev,
            screen: e.value,
        }));
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | CheckboxChangeEvent) => {
        const { name, checked, value } = e.target;
        setBannerDetail((prev) => ({
            ...prev,
            [name as string]: value != null ? value : checked ? 1 : 0,
        }));
    }, []);

    const handleSubmit = useCallback(async () => {
        const data: any = bannerDetail;
        data.img = isChangeAvatar
            ? image?.name
            : bannerDetail.img;
        if (!selectedId) {
            delete data.id;
        }
        try {
            const response = await ApiService.postSlide(data);
            if (response.status === "success") {
                toast.current?.show({
                    severity: "success",
                    summary: "Thành công",
                    detail:
                        (!!selectedId ? "Lưu" : "Thêm mới") +
                        " thành công !",
                });
                setVisibleRight(false);
                fetchSlide(slideParams);
            }
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Thông báo",
                detail: "Không thành công !",
                life: 2000,
            });
        }
    }, [bannerDetail, isChangeAvatar, image, selectedId, slideParams, fetchSlide]);

    const handleCancel = useCallback(() => {
        setSelectedId(undefined);
        setVisibleRight(false);
    }, []);

    const handleAddBanner = useCallback(() => {
        setSelectedId(undefined);
        setVisibleRight(true);
        setBannerDetail(new BannerDetail());
        setImageUrl("");
    }, []);

    const openImagePicker = useCallback(() => {
        setShowImagePicker(true);
    }, []);

    const handleImagePickerHide = useCallback(() => {
        setShowImagePicker(false);
    }, []);

    const handleImageSelect = useCallback((selectedImageUrl: string) => {
        setImageUrl(selectedImageUrl);
        setIsChangeAvatar(true);
        // Set a dummy file object to maintain compatibility with existing logic
        setImage(new File([], selectedImageUrl));
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
                                        <div className="pb-1">Màn hình</div>
                                        <Dropdown
                                            value={selectCtg}
                                            onChange={changeCtgHanlder}
                                            options={listCtg}
                                            showClear
                                            placeholder="Lựa chọn"
                                            className="w-full"
                                        // onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </OverlayPanel>
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
                        <DataTable value={slideList}>
                            <Column
                                field="img"
                                header="Hình ảnh"
                                body={imageBodyTemplate}
                            ></Column>
                            <Column field="screen" header="Màn hình"></Column>
                            <Column field="name" header="Tên"></Column>
                            <Column
                                field="status"
                                header="Hiển thị"
                                body={showHomeTemplate}
                            ></Column>
                            <Column body={optionsTemplate}></Column>
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
            <Sidebar
                visible={visibleRight}
                className="w-6"
                position="right"
                onHide={() => setVisibleRight(false)}
            >
                <h2>Banner</h2>
                <div className="grid banner">
                    <div className="col-12 avatar">
                        {/* <input
                            type="file"
                            id="avatar-input"
                            accept="image/*"
                            onChange={onSelect}
                        /> */}
                        {/* <label htmlFor="avatar-input"> */}
                        <img
                            onClick={openImagePicker}
                            className="w-full"
                            src={imageUrl || EMPTY_IMAGE_URL}
                            alt={imageUrl || "error"}
                        />
                        {/* </label> */}
                    </div>
                    <div className="col-6">
                        <div>Màn hình</div>
                        <Dropdown
                            value={bannerDetail.screen}
                            className="w-full"
                            options={listCtg}
                            onChange={handleChangeScreen}
                        />
                    </div>
                    <div className="col-6">
                        <div>Tên</div>
                        <InputText
                            className="w-full"
                            value={bannerDetail.name}
                            name="name"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-6">
                        <div>Hiển thị</div>
                        <Checkbox
                            name="status"
                            onChange={handleChange}
                            checked={
                                bannerDetail.status === 1 ? true : false
                            }
                        ></Checkbox>
                    </div>
                </div>
                <div className="flex mt-5 mr-2 justify-content-end">
                    <div className="cancel-btn mr-2">
                        <Button
                            onClick={handleCancel}
                            label="Hủy"
                            style={{ height: "40px" }}
                        />
                    </div>
                    <div className="save-btn">
                        <Button
                            onClick={handleSubmit}
                            label="Lưu"
                            style={{ height: "40px" }}
                        />
                    </div>
                </div>
                <ImagePickerDialog
                    visible={showImagePicker}
                    onHide={handleImagePickerHide}
                    onImageSelect={handleImageSelect}
                    title="Chọn ảnh từ thư viện"
                />
            </Sidebar>
        </>
    );
}

export default Banner;
