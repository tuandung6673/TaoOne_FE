import { Editor } from "@tinymce/tinymce-react";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Editor as TinyMCEEditor } from "tinymce";
import {
    Category,
    CategoryDetail,
    DropdownInterface,
    ItemDetail,
} from "../../../constants/interface";
import ApiService from "../../../services/api.service";
import ImagePickerDialog from "../../PickerDialog/ImagePickerDialog";
import "./WatchDetail.scss";

const HOME_BREADCRUMB = { icon: "pi pi-home", url: "" };
const EMPTY_IMAGE_URL = "https://hochieuqua7.web.app/images/admin/setting/slide/empty-image.png";
const EMPTY_SUB_IMAGE_URL = "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
const MAX_SUB_IMAGES = 6;

const EDITOR_INIT = {
    height: 500,
    menubar: true,
    plugins: [
        "advlist",
        "autolink",
        "lists",
        "link",
        "image",
        "charmap",
        "preview",
        "anchor",
        "searchreplace",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "code",
        "help",
        "wordcount",
    ],
    toolbar:
        "undo redo | blocks fontfamily fontsize | " +
        "bold italic forecolor | alignleft aligncenter " +
        "alignright alignjustify | bullist numlist outdent indent | " +
        "removeformat | help",
    content_style:
        "body { font-family:Arial,sans-serif; font-size:14px;}",
};

interface CategoryOption {
    label: string;
    value: string;
    code: string;
}

function WatchDetail() {
    const navigate = useNavigate();
    const [image, setImage] = useState<File | null>(null);
    const [isChangeAvatar, setIsChangeAvatar] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [showImagePicker, setShowImagePicker] = useState<boolean>(false);
    const [showSubImagePicker, setShowSubImagePicker] = useState<boolean>(false);
    const [selectedSubImageIndex, setSelectedSubImageIndex] = useState<number>(-1);
    const [formData, setFormData] = useState<ItemDetail>(new ItemDetail());
    const [categoryList, setCategoryList] = useState<CategoryOption[]>([]);
    const [categoryDetailList, setCategoryDetailList] = useState<
        CategoryDetail[]
    >([]);
    const [categoryDetailOptions, setCategoryDetailOptions] = useState<DropdownInterface[]>([]);
    const [sizeOptions, setSizeOptions] = useState<DropdownInterface[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const toast = useRef<Toast>(null);
    // them moi se ko co productId nen se check (productId)
    const { productId } = useParams<{ productId?: string }>();
    const breadcrumbItems = [
        { label: "Sản phẩm" },
        { label: !!productId ? "Chi tiết" : "Thêm mới" },
    ];

    const loadSizeOptions = useCallback((categoryDetailId: string, list: CategoryDetail[]) => {
        const selectedCategoryDetail = list.find(item => item.id === categoryDetailId);
        if (selectedCategoryDetail && selectedCategoryDetail.size) {
            setSizeOptions(selectedCategoryDetail.size.split(',').map((size: string) => ({
                label: size.trim(),
                value: size.trim()
            })));
        } else {
            setSizeOptions([]);
        }
    }, []);

    useEffect(() => {
        const fetchDetailProduct = async (id: string) => {
            try {
                const productDetail = await ApiService.getProductDetail(id);
                setFormData(productDetail.data);
                setImageUrl(productDetail.data.img);

                // Parse existing size string to array for multi-select
                if (productDetail.data.size) {
                    const sizes = productDetail.data.size.split(',').map((s: string) => s.trim()).filter((s: string) => s);
                    setSelectedSizes(sizes);
                }
            } catch (error) {
                console.log(error);
            }
        };

        const fetchCategory = async () => {
            try {
                const categoryList = await ApiService.getCategoryList("");
                setCategoryList(categoryList.data.data.map((item: Category) => ({
                    label: item.name,
                    value: item.id || "",
                    code: item.code,
                })));
            } catch (err) {
                console.log(err);
            }
        };

        if (!!productId) {
            fetchDetailProduct(productId);
        }
        fetchCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!formData.category_id) return;

        const fetchCategoryDetail = async () => {
            try {
                const queryParams = queryString.stringify({
                    category_code: formData.category_code,
                });
                const categoryDetailList = await ApiService.getCategoryDetailList(
                    queryParams
                );
                setCategoryDetailList(categoryDetailList.data.data);
                setCategoryDetailOptions(categoryDetailList.data.data.map(
                    (item: CategoryDetail) => ({
                        label: item.name,
                        value: item.id,
                    })
                ));
            } catch (error) {
                console.log(error);
            }
        };

        fetchCategoryDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.category_code]);

    useEffect(() => {
        // Load size options when category details are loaded and there's a selected category detail
        if (categoryDetailList.length > 0 && formData.category_detail_id) {
            loadSizeOptions(formData.category_detail_id, categoryDetailList);
        }
    }, [categoryDetailList, formData.category_detail_id, loadSizeOptions]);

    const handleImageSelect = useCallback((selectedImageUrl: string) => {
        setImageUrl(selectedImageUrl);
        setIsChangeAvatar(true);
        // Set a dummy file object to maintain compatibility with existing logic
        setImage(new File([], selectedImageUrl));
    }, []);

    const openImagePicker = useCallback(() => {
        setShowImagePicker(true);
    }, []);

    const handleImagePickerHide = useCallback(() => {
        setShowImagePicker(false);
    }, []);

    const handleSubImagePickerHide = useCallback(() => {
        setShowSubImagePicker(false);
        setSelectedSubImageIndex(-1);
    }, []);

    const openSubImagePicker = useCallback((index: number) => {
        setSelectedSubImageIndex(index);
        setShowSubImagePicker(true);
    }, []);

    const handleSubImageSelect = useCallback((selectedImageUrl: string) => {
        setFormData((prev) => {
            const newListImages = [...prev.listImages];
            if (selectedSubImageIndex === -1) {
                newListImages.push({ imgSource: selectedImageUrl });
            } else {
                newListImages[selectedSubImageIndex] = {
                    ...newListImages[selectedSubImageIndex],
                    imgSource: selectedImageUrl,
                };
            }
            return { ...prev, listImages: newListImages };
        });
        handleSubImagePickerHide();
    }, [selectedSubImageIndex, handleSubImagePickerHide]);

    const handleCategoryChange = useCallback((option?: CategoryOption) => {
        if (!option) return;
        setFormData((prevFormData) => ({
            ...prevFormData,
            category_code: option.code,
            category_id: option.value,
        }));
        setCategoryDetailList([]);
        setCategoryDetailOptions([]);
        setSizeOptions([]);
        setSelectedSizes([]);
    }, []);

    const handleCategoryDetailChange = useCallback((e: DropdownChangeEvent) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            category_detail_id: e.value,
        }));

        // Load size options from selected category detail
        loadSizeOptions(e.value, categoryDetailList);
        setSelectedSizes([]);
    }, [loadSizeOptions, categoryDetailList]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | CheckboxChangeEvent) => {
        const { name, checked, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name as string]: value != null ? value : checked ? 1 : 0,
        }));
    }, []);

    const handleSizeChange = useCallback((e: MultiSelectChangeEvent) => {
        setSelectedSizes(e.value);
        // Convert array to comma-separated string for formData
        setFormData((prev) => ({
            ...prev,
            size: e.value.join(',')
        }));
    }, []);

    const handleEditorChange = useCallback((content: string, key: "description" | "specs") => {
        setFormData((prev) => ({
            ...prev,
            [key]: content,
        }));
    }, []);

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleSubmit = useCallback(async () => {
        const data: any = formData;
        data.img = isChangeAvatar
            ? image?.name
            : formData.img;
        delete data.category_code;
        delete data.category_detail_name;
        if (!productId) {
            delete data.id;
        }

        try {
            const response = await ApiService.postProduct(data);
            if (response.status === "success") {
                toast.current?.show({
                    severity: "success",
                    summary: "Thành công",
                    detail:
                        (!!productId ? "Lưu" : "Thêm mới") +
                        " thành công !",
                });
                navigate(-1);
            }
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Thông báo",
                detail: "Không thành công !",
                life: 2000,
            });
        }
    }, [formData, isChangeAvatar, image, productId, navigate]);

    const handleDeleteSubImage = useCallback((index: number) => {
        setFormData((prev) => {
            const newListImages = [...prev.listImages];
            newListImages.splice(index, 1);
            return { ...prev, listImages: newListImages };
        });
    }, []);

    return (
        <>
            <Toast ref={toast} />
            <div className="detail-wrapper product-detail">
                <div className="header mb-3">
                    <BreadCrumb
                        model={breadcrumbItems}
                        home={HOME_BREADCRUMB}
                    ></BreadCrumb>
                    <div className="header-main flex justify-content-between">
                        <div className="header-left flex">
                            <div className="empty"></div>
                            <div className="main-title flex align-items-center ml-2">
                                {!!productId ? "Chi tiết" : "Thêm mới"}
                            </div>
                        </div>
                        <div className="flex mr-3">
                            <div className="cancel-btn mr-2">
                                <Button
                                    onClick={handleBack}
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
                    </div>
                </div>
                <div className="grid">
                    <div className="col-12 md:col-3">
                        <div className="avatar">
                            <div className="avatar-preview">
                                <img
                                    className="w-full"
                                    src={imageUrl || EMPTY_IMAGE_URL}
                                    alt={imageUrl || "error"}
                                />
                            </div>
                            <Button
                                label="Chọn ảnh từ thư viện"
                                icon="pi pi-image"
                                onClick={openImagePicker}
                                className="w-full mb-2"
                                loading={showImagePicker}
                                disabled={showImagePicker}
                            />
                        </div>
                        <div className="grid mt-2">
                            {formData &&
                                formData.listImages?.map((item, index) => (
                                    <div
                                        className="col-4 sub-image"
                                        key={index}
                                    >
                                        <img
                                            onClick={() => openSubImagePicker(index)}
                                            src={item.imgSource || EMPTY_SUB_IMAGE_URL}
                                            alt=""
                                        />
                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDeleteSubImage(index)
                                            }
                                        >
                                            <i className="pi pi-trash"></i>
                                        </button>
                                    </div>
                                ))}
                            {formData && formData.listImages?.length < MAX_SUB_IMAGES && (
                                <div className="col-4 sub-image add-image cursor-pointer" onClick={() => openSubImagePicker(-1)}>
                                    <div
                                        className="flex justify-content-center align-items-center h-full"
                                    >
                                        <i className="pi pi-plus text-3xl"></i>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-12 md:col-9 md:pl-5">
                        <div className="grid">
                            <div className="col-6">
                                <div className="">Loại</div>
                                <Dropdown
                                    className="w-full"
                                    optionValue="code"
                                    value={formData.category_code}
                                    options={categoryList}
                                    onChange={(e) =>
                                        handleCategoryChange(
                                            categoryList.find((item) => item.code === e.value)
                                        )
                                    }
                                />
                            </div>
                            <div className="col-6">
                                <div className="">Loại chi tiết</div>
                                <Dropdown
                                    className="w-full"
                                    value={formData.category_detail_id}
                                    options={categoryDetailOptions}
                                    onChange={handleCategoryDetailChange}
                                />
                            </div>
                            <div className="col-12">
                                <div className="">Tên sản phẩm</div>
                                <InputText
                                    className="w-full"
                                    value={formData.name}
                                    name="name"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-6">
                                <div className="">Giá bán</div>
                                <InputText
                                    className="w-full"
                                    keyfilter="int"
                                    value={formData.salePrice.toLocaleString(
                                        "vi-VN"
                                    )}
                                    name="salePrice"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-6">
                                <div className="">Giá niêm yết</div>
                                <InputText
                                    className="w-full"
                                    keyfilter="int"
                                    value={formData.price.toLocaleString(
                                        "vi-VN"
                                    )}
                                    name="price"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-6">
                                <div className="">Phiên bản</div>
                                <MultiSelect
                                    className="w-full"
                                    value={selectedSizes}
                                    options={sizeOptions}
                                    onChange={handleSizeChange}
                                    placeholder="Chọn phiên bản"
                                    display="chip"
                                />
                            </div>
                            <div className="col-6">
                                <div className="">Hiển thị</div>
                                <Checkbox
                                    name="status"
                                    onChange={handleChange}
                                    checked={formData.status === 1 ? true : false}
                                ></Checkbox>
                            </div>
                        </div>
                        <div className="description editor p-2 mt-3">
                            <TabView>
                                <TabPanel header="Mô tả">
                                    <Editor
                                        apiKey={process.env.REACT_APP_TINY_KEY}
                                        onInit={(_evt, editor) =>
                                            (editorRef.current = editor)
                                        }
                                        value={formData.description}
                                        init={EDITOR_INIT}
                                        onEditorChange={
                                            (content) => handleEditorChange(content, 'description')
                                        }
                                    />
                                </TabPanel>
                                <TabPanel header="Thông số kĩ thuật">
                                    <Editor
                                        apiKey={process.env.REACT_APP_TINY_KEY}
                                        onInit={(_evt, editor) =>
                                            (editorRef.current = editor)
                                        }
                                        value={formData.specs}
                                        init={EDITOR_INIT}
                                        onEditorChange={(content) => handleEditorChange(content, 'specs')}
                                    />
                                </TabPanel>
                            </TabView>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Picker Dialogs */}
            <ImagePickerDialog
                visible={showImagePicker}
                onHide={handleImagePickerHide}
                onImageSelect={handleImageSelect}
                title="Chọn ảnh từ thư viện"
            />
            <ImagePickerDialog
                visible={showSubImagePicker}
                onHide={handleSubImagePickerHide}
                onImageSelect={handleSubImageSelect}
                title="Chọn ảnh phụ từ thư viện"
            />
        </>
    );
}

export default WatchDetail;
