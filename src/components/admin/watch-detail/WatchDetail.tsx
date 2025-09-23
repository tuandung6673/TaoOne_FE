import { Editor } from "@tinymce/tinymce-react";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { MultiSelect } from "primereact/multiselect";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Editor as TinyMCEEditor } from "tinymce";
import {
    Category,
    CategoryDetail,
    ItemDetail,
} from "../../../constants/interface";
import ApiService from "../../../services/api.service";
import ImagePickerDialog from "../../PickerDialog/ImagePickerDialog";
import "./WatchDetail.scss";
import { Checkbox } from "primereact/checkbox";

function WatchDetail() {
    const navigate = useNavigate();
    const [image, setImage] = useState<File | null>(null);
    const [isChangeAvatar, setIsChangeAvatar] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [showImagePicker, setShowImagePicker] = useState<boolean>(false);
    const [showSubImagePicker, setShowSubImagePicker] = useState<boolean>(false);
    const [selectedSubImageIndex, setSelectedSubImageIndex] = useState<number>(-1);
    const [formData, setFormData] = useState<ItemDetail>(new ItemDetail());
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [categoryDetailList, setCategoryDetailList] = useState<
        CategoryDetail[]
    >([]);
    const [categoryDetailOptions, setCategoryDetailOptions] = useState<{label: string, value: string}[]>([]);
    const [sizeOptions, setSizeOptions] = useState<{label: string, value: string}[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const toast = useRef<Toast>(null);
    // them moi se ko co productId nen se check (productId)
    const { productId } = useParams<{ productId?: string }>();
    const breadcrumbItems = [
        { label: "Sản phẩm" },
        { label: !!productId ? "Chi tiết" : "Thêm mới" },
    ];
    const home = { icon: "pi pi-home", url: "" };

    useEffect(() => {
        if (!!productId) {
            fetchDetailProduct(productId);
        }
        fetchCategory();
    }, []);

    useEffect(() => {
        if (formData.category_id) {
            fetchCategoryDetail();
        }
    }, [formData.category_code]);

    useEffect(() => {
        // Load size options when category details are loaded and there's a selected category detail
        if (categoryDetailList.length > 0 && formData.category_detail_id) {
            loadSizeOptions(formData.category_detail_id);
        }
    }, [categoryDetailList, formData.category_detail_id]);

    const handleImageSelect = (selectedImageUrl: string) => {
        setImageUrl(selectedImageUrl);
        setIsChangeAvatar(true);
        // Set a dummy file object to maintain compatibility with existing logic
        setImage(new File([], selectedImageUrl));
    };

    const openImagePicker = () => {
        setShowImagePicker(true);
    };

    const handleImagePickerHide = () => {
        setShowImagePicker(false);
    };

    const handleSubImagePickerHide = () => {
        setShowSubImagePicker(false);
        setSelectedSubImageIndex(-1);
    };

    const openSubImagePicker = (index: number) => {
        setSelectedSubImageIndex(index);
        setShowSubImagePicker(true);
    };

    const handleSubImageSelect = (selectedImageUrl: string) => {
        if (selectedSubImageIndex === -1) {
            // Adding new image
            const newListImages = [
                ...formData.listImages,
                { imgSource: selectedImageUrl },
            ];
            setFormData({ ...formData, listImages: newListImages });
        } else {
            // Updating existing image
            const newListImages = [...formData.listImages];
            newListImages[selectedSubImageIndex] = {
                ...newListImages[selectedSubImageIndex],
                imgSource: selectedImageUrl,
            };
            setFormData({ ...formData, listImages: newListImages });
        }
        handleSubImagePickerHide();
    };

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

    const fetchCategory = async (queryParams = "") => {
        try {
            const categoryList = await ApiService.getCategoryList(queryParams);
            const ctgList = categoryList.data.data.map((item: Category) => {
                return {
                    label: item.name,
                    value: item.id,
                    code: item.code,
                };
            });
            setCategoryList(ctgList);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchCategoryDetail = async () => {
        try {
            const queryParams = queryString.stringify({
                category_code: formData.category_code,
            });
            const categoryDetailList = await ApiService.getCategoryDetailList(
                queryParams
            );
            const ctgDList = categoryDetailList.data.data.map(
                (item: CategoryDetail) => {
                    return {
                        label: item.name,
                        value: item.id,
                    };
                }
            );
            setCategoryDetailList(categoryDetailList.data.data);
            setCategoryDetailOptions(ctgDList);
        } catch (error) {
            console.log(error);
        }
    };

    const loadSizeOptions = (categoryDetailId: string) => {
        const selectedCategoryDetail = categoryDetailList.find(item => item.id === categoryDetailId);
        if (selectedCategoryDetail && selectedCategoryDetail.size) {
            const sizeOpts = selectedCategoryDetail.size.split(',').map((size: string) => ({
                label: size.trim(),
                value: size.trim()
            }));
            setSizeOptions(sizeOpts);
        } else {
            setSizeOptions([]);
        }
    };

    const handleCategoryChange = (e: any) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            category_code: e.code,
            category_id: e.value,
        }));
        setCategoryDetailList([]);
        setCategoryDetailOptions([]);
        setSizeOptions([]);
        setSelectedSizes([]);
    };

    const handleCategoryDetailChange = (e: any) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            category_detail_id: e.value,
        }));
        
        // Load size options from selected category detail
        loadSizeOptions(e.value);
        setSelectedSizes([]);
    };

    const handleChange = (e: any) => {
        const { name, checked, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value != null ? value : checked ? 1 : 0,
        }));
    };

    const handleSizeChange = (e: any) => {
        setSelectedSizes(e.value);
        // Convert array to comma-separated string for formData
        setFormData((prev) => ({
            ...prev,
            size: e.value.join(',')
        }));
    };

    const handleEditorChange = (content: any, key: string) => {
        setFormData((prev) => ({
            ...prev,
            [key]: content,
        }));
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleSubmit = async () => {
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
                if (toast.current) {
                    toast.current.show({
                        severity: "success",
                        summary: "Thành công",
                        detail:
                            (!!productId ? "Lưu" : "Thêm mới") +
                            " thành công !",
                    });
                }
                // if (isChangeAvatar) {
                //     await uploadAvatar();
                // }
                navigate(-1);
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

    const handleDeleteSubImage = (index: number) => {
        const newListImages = [...formData.listImages];
        newListImages.splice(index, 1);
        setFormData({ ...formData, listImages: newListImages });
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="detail-wrapper product-detail">
                <div className="header mb-3">
                    <BreadCrumb
                        model={breadcrumbItems}
                        home={home}
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
                                    src={
                                        imageUrl
                                            ? imageUrl
                                            : "https://hochieuqua7.web.app/images/admin/setting/slide/empty-image.png"
                                    }
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
                                formData.listImages?.map((item: any, index) => (
                                    <div
                                        className="col-4 sub-image"
                                        key={index}
                                    >
                                        <img
                                            onClick={() => openSubImagePicker(index)}
                                            src={
                                                item.imgSource
                                                    ? item.imgSource
                                                    : "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                                            }
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
                            {formData && formData.listImages?.length < 6 && (
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
                                            categoryList.filter(
                                                (item) => item.code === e.value
                                            )[0]
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
                                    onChange={(e) =>
                                        handleCategoryDetailChange(e)
                                    }
                                />
                            </div>
                            <div className="col-12">
                                <div className="">Tên sản phẩm</div>
                                <InputText
                                    className="w-full"
                                    value={formData.name}
                                    name="name"
                                    onChange={(e) => handleChange(e)}
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
                                    onChange={(e) => handleChange(e)}
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
                                    onChange={(e) => handleChange(e)}
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
                                    onChange={(e: any) => handleChange(e)}
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
                                        init={{
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
                                            // language: 'vi'
                                        }}
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
                                        init={{
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
                                            // language: 'vi'
                                        }}
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
