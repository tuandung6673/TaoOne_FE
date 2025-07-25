import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { ROLE } from "../../../constants/constants";
import {
    BannerDetail,
    DropdownInterface,
    ItemDetail,
} from "../../../constants/interface";
import { useSpinner } from "../../../custom-hook/SpinnerContext";
import { storage } from "../../../firebase/firebaseConfig";
import ApiService from "../../../services/api.service";
import "./banner.scss";

function Banner() {
    const { showSpinner, hideSpinner } = useSpinner();
    const toast = useRef<Toast>(null);
    const op = useRef<OverlayPanel>(null);
    const [visibleRight, setVisibleRight] = useState(false);
    const op2 = useRef<OverlayPanel>(null);
    const [image, setImage] = useState<File | null>(null);
    const [isChangeAvatar, setIsChangeAvatar] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const home = { icon: "pi pi-home", url: "" };
    const breadcrumbItems = [{ label: "Banner" }];
    const [slideParams, setSlideParams] = useState({
        screen: "",
        rules: (window.location.pathname).includes(ROLE.admin) ? 'admin' : null
    });
    const [slideList, setSlideList] = useState<ItemDetail[]>([]);
    const [selectCtg, setSelectCtg] = useState(null);
    const [selectedId, setSelectedId] = useState<string>();
    const [listCtg, setListCtg] = useState<DropdownInterface[]>([]);
    const [bannerDetail, setBannerDetail] = useState<BannerDetail>(
        new BannerDetail()
    );

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
                    filter: "",
                })
            );
            const formattedList = ctgDetailList.data.data.map((item: any) => {
                return {
                    label: item.name,
                    value: item.code,
                };
            });

            setListCtg([
                { label: "Trang chủ", value: "home" },
                ...formattedList,
            ]);
        } catch (err) {
            console.error(err);
        }
    };

    const imageBodyTemplate = (product: any) => {
        return (
            <img
                src={product.img}
                alt={product.img}
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
            const deleteSlide = await ApiService.deleteSlide(selectedId || "");
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

    const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedImage = e.target.files[0];
            setImage(selectedImage);
            // setAvatarImageName(image.name);
            const reader = new FileReader();

            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };

            reader.readAsDataURL(selectedImage);
            setIsChangeAvatar(true);
        }
    };

    const showHomeTemplate = (product: any) => {
            return <Checkbox checked={product.status == "1"}></Checkbox>;
        };

    const uploadAvatar = (): Promise<void> => {
        showSpinner();
        return new Promise((resolve, reject) => {
            if (image) {
                const storageRef = ref(storage, `images/${image.name}`);
                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Tiến trình tải lên
                    },
                    (error) => {
                        console.error("Upload failed", error);
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(
                            (downloadURL1) => {
                                setImageUrl(downloadURL1);
                                hideSpinner();
                                resolve();
                            }
                        );
                    }
                );
            } else {
                resolve();
            }
        });
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
            const detailBanner = await ApiService.getSlideDetail(
                selectedId || ""
            );
            setBannerDetail(detailBanner.data);
            setImageUrl(detailBanner.data.img);
        } catch (error) {
            console.log(error);
        }
    };

    const viewDetail = () => {
        fetchDetailBanner();
        setVisibleRight(true);
    };

    const handleChangeScreen = (e: any) => {
        setBannerDetail((prev) => ({
            ...prev,
            screen: e.value,
        }));
    };

    const handleChange = (e: any) => {
        const { name, checked, value } = e.target;
        setBannerDetail((prev) => ({
            ...prev,
            [name]: value != null ? value : checked ? 1 : 0,
        }));
    };

    const handleSubmit = async () => {
        const data: any = bannerDetail;
        data.img = isChangeAvatar
            ? "https://firebasestorage.googleapis.com/v0/b/taoone-c4bb7.appspot.com/o/images%2F" +
              image?.name +
              "?alt=media"
            : bannerDetail.img;
        if (!selectedId) {
            delete data.id;
        }
        try {
            const response = await ApiService.postSlide(data);
            if (response.status === "success") {
                if (toast.current) {
                    toast.current.show({
                        severity: "success",
                        summary: "Thành công",
                        detail:
                            (!!selectedId ? "Lưu" : "Thêm mới") +
                            " thành công !",
                    });
                }
                if (isChangeAvatar) {
                    await uploadAvatar();
                }
                setVisibleRight(false);
                fetchSlide(slideParams);
            }
        } catch (error) {
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

    const handleCancel = () => {
        setSelectedId(undefined);
        setVisibleRight(false);
    };

    const handleAddBanner = () => {
        setSelectedId(undefined);
        setVisibleRight(true);
        setBannerDetail(new BannerDetail());
        setImageUrl("");
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
            <Sidebar
                visible={visibleRight}
                className="w-6"
                position="right"
                onHide={() => setVisibleRight(false)}
            >
                <h2>Banner</h2>
                <div className="grid banner">
                    <div className="col-12 avatar">
                        <input
                            type="file"
                            id="avatar-input"
                            accept="image/*"
                            onChange={onSelect}
                        />
                        <label htmlFor="avatar-input">
                            <img
                                className="w-full"
                                src={
                                    imageUrl
                                        ? imageUrl
                                        : "https://hochieuqua7.web.app/images/admin/setting/slide/empty-image.png"
                                }
                                alt="abcákjdh"
                            />
                        </label>
                    </div>
                    <div className="col-6">
                        <div>Màn hình</div>
                        <Dropdown
                            value={bannerDetail.screen}
                            className="w-full"
                            options={listCtg}
                            onChange={(e) => handleChangeScreen(e)}
                        />
                    </div>
                    <div className="col-6">
                        <div>Tên</div>
                        <InputText
                            className="w-full"
                            value={bannerDetail.name}
                            name="name"
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div className="col-6">
                        <div>Hiển thị</div>
                        <Checkbox
                            name="status"
                            onChange={(e) => handleChange(e)}
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
            </Sidebar>
        </>
    );
}

export default Banner;
