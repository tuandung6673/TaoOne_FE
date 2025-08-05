import { Editor } from "@tinymce/tinymce-react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Editor as TinyMCEEditor } from "tinymce";
import { NewsDetail } from "../../../../constants/interface";
import { useSpinner } from "../../../../custom-hook/SpinnerContext";
import { storage } from "../../../../firebase/firebaseConfig";
import ApiService from "../../../../services/api.service";
import { BreadCrumb } from "primereact/breadcrumb";
import queryString from 'query-string';


const NewsAdminDetail = () => {
    const navigate = useNavigate();
    const { showSpinner, hideSpinner } = useSpinner();
    const { newsId } = useParams<{ newsId?: string }>();
    const toast = useRef<Toast>(null);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isChangeAvatar, setIsChangeAvatar] = useState<boolean>(false);
    const [newsDetail, setNewsDetail] = useState<NewsDetail>(
        new NewsDetail()
    );
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const breadcrumbItems = [
        { label: "Sản phẩm" },
        { label: !!newsId ? "Chi tiết" : "Thêm mới" },
    ];
    const home = { icon: "pi pi-home", url: "" };
    const newsDetailParams = {
        id: newsId,
        slug: ""
    }

    useEffect(() => {
        if (!!newsId) {
            fetchDetailNews(newsId)
        }
    }, [newsId]);

    const fetchDetailNews = async (queryParams: string) => {
        try {
            const queryParam = queryString.stringify(newsDetailParams);
            const detailBanner = await ApiService.getNewsDetail(
                queryParam
            );
            setNewsDetail(detailBanner.data);
            setImageUrl(detailBanner.data.thumbnailUrl);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e: any) => {
        const { name, checked, value } = e.target;
        setNewsDetail((prev) => ({
            ...prev,
            [name]: value != null ? value : checked ? 1 : 0,
        }));
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

    const handleCancel = () => {
        // setSelectedId(undefined);
        // setVisibleRight(false);
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


    const handleSubmit = async () => {
        const data: any = newsDetail;
        data.thumbnailUrl = isChangeAvatar
            ? "https://firebasestorage.googleapis.com/v0/b/taoone-c4bb7.appspot.com/o/images%2F" +
            image?.name +
            "?alt=media"
            : newsDetail.thumbnailUrl;
        if (!newsId) {
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
                            (!!newsId ? "Lưu" : "Thêm mới") +
                            " thành công !",
                    });
                }
                if (isChangeAvatar) {
                    await uploadAvatar();
                }
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

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="grid banner detail-wrapper">
                <div className="header mb-3 w-full">
                    <BreadCrumb
                        model={breadcrumbItems}
                        home={home}
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
        </>
    )
}

export default NewsAdminDetail;
