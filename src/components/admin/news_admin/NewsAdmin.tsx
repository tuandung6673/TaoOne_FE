import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import type { Editor as TinyMCEEditor } from "tinymce";
import { Editor } from "@tinymce/tinymce-react";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { ItemDetail, NewsDetail } from "../../../constants/interface";
import { useSpinner } from "../../../custom-hook/SpinnerContext";
import { storage } from "../../../firebase/firebaseConfig";
import ApiService from "../../../services/api.service";
import he from 'he';
import { useNavigate } from "react-router-dom";

const NewsAdmin = () => {
    const navigate = useNavigate();
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const { showSpinner, hideSpinner } = useSpinner();
    const toast = useRef<Toast>(null);
    const op = useRef<OverlayPanel>(null);
    const [visibleRight, setVisibleRight] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [isChangeAvatar, setIsChangeAvatar] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const home = { icon: "pi pi-home", url: "" };
    const breadcrumbItems = [{ label: "Tin tức" }];
    const [newsParams, setNewsParams] = useState({
        filter: "",
    });
    const [newsList, setNewsList] = useState<ItemDetail[]>([]);
    const [selectedId, setSelectedId] = useState<string>();
    const [newsDetail, setNewsDetail] = useState<NewsDetail>(
        new NewsDetail()
    );
    const [searchValue, setSearchValue] = useState("");

    const fetchNews = async (slideParams: any) => {
        try {
            const queryParams = queryString.stringify(slideParams);
            const newsList = await ApiService.getNewsList(queryParams);
            setNewsList(newsList.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNews(newsParams);
    }, [newsParams]);

    const imageBodyTemplate = (product: any) => {
        return (
            <img
                src={product.thumbnailUrl}
                alt={product.thumbnailUrl}
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
                fetchNews(newsParams);
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

    const fetchDetailNews = async () => {
        try {
            const detailBanner = await ApiService.getNewsDetail(
                selectedId || ""
            );
            setNewsDetail(detailBanner.data);
            setImageUrl(detailBanner.data.thumbnailUrl);
        } catch (error) {
            console.log(error);
        }
    };

    const viewDetail = () => {
        fetchDetailNews();
        navigate(`/admin/news/${selectedId}`);
        // setVisibleRight(true);
    };

    const handleChange = (e: any) => {
        const { name, checked, value } = e.target;
        setNewsDetail((prev) => ({
            ...prev,
            [name]: value != null ? value : checked ? 1 : 0,
        }));
    };

    const handleSubmit = async () => {
        const data: any = newsDetail;
        data.thumbnailUrl = isChangeAvatar
            ? "https://firebasestorage.googleapis.com/v0/b/taoone-c4bb7.appspot.com/o/images%2F" +
            image?.name +
            "?alt=media"
            : newsDetail.thumbnailUrl;
        if (!selectedId) {
            delete data.id;
        }
        try {
            const response = await ApiService.postNews(data);
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
                fetchNews(newsParams);
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
        setNewsDetail(new NewsDetail());
        setImageUrl("");
    };

    const searchHandler = () => {
        setNewsParams((prevParams) => ({
            ...prevParams,
            filter: searchValue,
        }));
    };

    const handleKeyDown = (event: any) => {
        if (event && event.key === "Enter") {
            searchHandler();
        }
    };

    const handleExpertEditorChange = (content: any) => {
        setNewsDetail((prev) => ({
            ...prev,
            excerpt: content,
        }));
    };

    const handleContentEditorChange = (content: any) => {
        setNewsDetail((prev) => ({
            ...prev,
            contentHtml: content,
        }));
    };

    const stripHtmlAndDecode = (html: string) => {
        // Bỏ thẻ HTML
        const stripped = html.replace(/<\/?[^>]+(>|$)/g, '');
        // Decode HTML entities
        return he.decode(stripped);
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
                                Tin tức
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
                        <DataTable value={newsList}>
                            <Column
                                field="thumbnailUrl"
                                header="Thumbnail"
                                body={imageBodyTemplate}
                            ></Column>
                            <Column field="title" header="Tiêu đề"></Column>
                            <Column field="slug" header="Slug"></Column>
                            <Column field="excerpt" header="Mô tả ngắn" body={(rowData) => stripHtmlAndDecode(rowData.excerpt)}></Column>
                            <Column field="publishedAt" header="Ngày đăng"></Column>
                            <Column field="updatedAt" header="Ngày cập nhật"></Column>
                            <Column
                                field="status"
                                header="Hiển thị"
                                body={showHomeTemplate}
                            ></Column>
                            <Column body={optionsTemplate}></Column>
                        </DataTable>
                    </div>
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
            {/* detail */}
            <Sidebar
                visible={visibleRight}
                className="w-4"
                position="right"
                onHide={() => setVisibleRight(false)}
            >
                <h2>Tin tức</h2>
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
                    <div className="col-12">
                        <div>Tiêu đề</div>
                        <InputText
                            className="w-full"
                            value={newsDetail.title}
                            name="title"
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div className="col-12">
                        <div>Slug</div>
                        <InputText
                            className="w-full"
                            value={newsDetail.slug}
                            name="slug"
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div className="col-12">
                        <div>Hiển thị</div>
                        <Checkbox
                            name="status"
                            onChange={(e) => handleChange(e)}
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
                            init={{
                                height: 300,
                                menubar: false,
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
                                    "undo redo | blocks | " +
                                    "bold italic forecolor | alignleft aligncenter " +
                                    "alignright alignjustify | bullist numlist outdent indent | " +
                                    "removeformat | help",
                                content_style:
                                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px;}",
                                // language: 'vi'
                            }}
                            onEditorChange={
                                handleExpertEditorChange
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
                            init={{
                                height: 500,
                                menubar: false,
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
                                    "undo redo | blocks | " +
                                    "bold italic forecolor | alignleft aligncenter " +
                                    "alignright alignjustify | bullist numlist outdent indent | " +
                                    "removeformat | help",
                                content_style:
                                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px;}",
                                // language: 'vi'
                            }}
                            onEditorChange={
                                handleContentEditorChange
                            }
                        />
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

export default NewsAdmin;    