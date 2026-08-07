import { Editor } from "@tinymce/tinymce-react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import queryString from 'query-string';
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Editor as TinyMCEEditor } from "tinymce";
import { NewsDetail } from "../../../../constants/interface";
import { useSpinner } from "../../../../custom-hook/SpinnerContext";
import { storage } from "../../../../firebase/firebaseConfig";
import ApiService from "../../../../services/api.service";
import ImagePickerDialog from "../../../PickerDialog/ImagePickerDialog";

const HOME_BREADCRUMB = { icon: "pi pi-home", url: "" };
const EMPTY_IMAGE_URL = "https://hochieuqua7.web.app/images/admin/setting/slide/empty-image.png";

const EDITOR_BASE_INIT = {
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

const EXCERPT_EDITOR_INIT = { ...EDITOR_BASE_INIT, height: 300, menubar: false };
const CONTENT_EDITOR_INIT = { ...EDITOR_BASE_INIT, height: 800, menubar: true };

const NewsAdminDetail = () => {
    const navigate = useNavigate();
    const { showSpinner, hideSpinner } = useSpinner();
    const { newsId } = useParams<{ newsId?: string }>();
    const toast = useRef<Toast>(null);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [showImagePicker, setShowImagePicker] = useState<boolean>(false);
    const [isChangeAvatar, setIsChangeAvatar] = useState<boolean>(false);
    const [newsDetail, setNewsDetail] = useState<NewsDetail>(
        new NewsDetail()
    );
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const breadcrumbItems = [
        { label: "Sản phẩm" },
        { label: !!newsId ? "Chi tiết" : "Thêm mới" },
    ];

    useEffect(() => {
        if (!newsId) return;

        const fetchDetailNews = async () => {
            try {
                const queryParam = queryString.stringify({ id: newsId, slug: "" });
                const detailBanner = await ApiService.getNewsDetail(queryParam);
                setNewsDetail(detailBanner.data);
                setImageUrl(detailBanner.data.thumbnailUrl);
            } catch (error) {
                console.log(error);
            }
        };

        fetchDetailNews();
    }, [newsId]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | CheckboxChangeEvent) => {
        const { name, checked, value } = e.target;
        setNewsDetail((prev) => ({
            ...prev,
            [name as string]: value != null ? value : checked ? 1 : 0,
        }));
    }, []);

    const handleEditorChange = useCallback((content: string, key: 'excerpt' | 'contentHtml') => {
        setNewsDetail((prev) => ({
            ...prev,
            [key]: content,
        }));
    }, []);

    const uploadAvatar = useCallback((): Promise<void> => {
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
    }, [image, showSpinner, hideSpinner]);

    const handleSubmit = useCallback(async () => {
        const data: any = newsDetail;
        data.thumbnailUrl = isChangeAvatar
            ? image?.name
            : newsDetail.thumbnailUrl;
        if (!newsId) {
            delete data.id;
        }
        try {
            const response = await ApiService.postNews(data);
            if (response.status === "success") {
                toast.current?.show({
                    severity: "success",
                    summary: "Thành công",
                    detail: response.message
                });
                if (isChangeAvatar) {
                    await uploadAvatar();
                }
                // Add delay to show toast before navigation
                setTimeout(() => {
                    navigate(-1);
                }, 500);
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Thông báo",
                    detail: response.message,
                    life: 2000,
                });
            }
        } catch (error) {
        }
    }, [newsDetail, isChangeAvatar, image, newsId, uploadAvatar, navigate]);

    const handleImagePickerHide = useCallback(() => {
        setShowImagePicker(false);
    }, []);

    const handleImageSelect = useCallback((selectedImageUrl: string) => {
        setImageUrl(selectedImageUrl);
        setIsChangeAvatar(true);
        // Set a dummy file object to maintain compatibility with existing logic
        setImage(new File([], selectedImageUrl));
    }, []);

    const openImagePicker = useCallback(() => {
        setShowImagePicker(true);
    }, []);

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return (
        <>
            <Toast ref={toast} />
            <div className="grid banner detail-wrapper">
                <div className="header mb-3 w-full">
                    <BreadCrumb
                        model={breadcrumbItems}
                        home={HOME_BREADCRUMB}
                    ></BreadCrumb>
                    <div className="header-main flex justify-content-between">
                        <div className="header-left flex">
                            <div className="empty"></div>
                            <div className="main-title flex align-items-center ml-2">
                                {!!newsId ? "Chi tiết" : "Thêm mới"}
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
                <div className="col-12 avatar">
                    <img
                        className="w-full"
                        onClick={openImagePicker}
                        src={imageUrl || EMPTY_IMAGE_URL}
                        alt={imageUrl || "error"}
                    />
                </div>
                <div className="col-12">
                    <div>Tiêu đề</div>
                    <InputText
                        className="w-full"
                        value={newsDetail.title}
                        name="title"
                        onChange={handleChange}
                    />
                </div>
                <div className="col-12">
                    <div>Slug</div>
                    <InputText
                        className="w-full"
                        value={newsDetail.slug}
                        name="slug"
                        disabled={!!newsId}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-12">
                    <div>Hiển thị</div>
                    <Checkbox
                        name="status"
                        onChange={handleChange}
                        checked={
                            newsDetail.status === 1 ? true : false
                        }
                    ></Checkbox>
                </div>
                <div className="col-12">
                    <div>Mô tả ngắn</div>
                    <Editor
                        apiKey={process.env.REACT_APP_TINY_KEY}
                        onInit={(_evt, editor) =>
                            (editorRef.current = editor)
                        }
                        value={newsDetail.excerpt}
                        init={EXCERPT_EDITOR_INIT}
                        onEditorChange={
                            (content) => handleEditorChange(content, 'excerpt')
                        }
                    />
                </div>
                <div className="col-12">
                    <div>Nội dung Bài viết</div>
                    <Editor
                        apiKey={process.env.REACT_APP_TINY_KEY}
                        onInit={(_evt, editor) =>
                            (editorRef.current = editor)
                        }
                        value={newsDetail.contentHtml}
                        init={CONTENT_EDITOR_INIT}
                        onEditorChange={
                            (content) => handleEditorChange(content, 'contentHtml')
                        }
                    />
                </div>
            </div>
            <ImagePickerDialog
                visible={showImagePicker}
                onHide={handleImagePickerHide}
                onImageSelect={handleImageSelect}
                title="Chọn ảnh từ thư viện"
            />
        </>
    )
}

export default NewsAdminDetail;
