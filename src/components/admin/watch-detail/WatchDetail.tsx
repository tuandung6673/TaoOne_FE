import './WatchDetail.scss'
import { BreadCrumb } from "primereact/breadcrumb";
import { useParams } from "react-router-dom";
import { FileUpload } from 'primereact/fileupload';
import { Toast } from "primereact/toast";
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from "react";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import type { Editor as TinyMCEEditor } from 'tinymce';
        

function WatchDetail() {
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const toast = useRef<Toast>(null);
    // them moi se ko co productId nen se check (productId)
    const { productId } = useParams<{ productId?: string }>();
    const breadcrumbItems = [{ label: "Sản phẩm" }, { label: !!productId ? 'Chi tiết' : 'Thêm mới' }];
    const home = { icon: "pi pi-home", url: "" };
    const onUpload = () => {
        if (toast.current) {
            toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
        }
    };
    return (
        <>
            <Toast ref={toast} />
            <div className="detail-wrapper">
                <div className="header mb-3">
                    <BreadCrumb model={breadcrumbItems} home={home}></BreadCrumb>
                    <div className="header-left flex">
                        <div className="empty"></div>
                        <div className="main-title flex align-items-center ml-2">
                            {!!productId ? 'Chi tiết' : 'Thêm mới'}
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <div className="col-12 md:col-3">
                        <div className="avatar">
                            <img className="w-full" src="https://hochieuqua7.web.app/images/admin/setting/slide/empty-image.png" alt="" />
                            <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} chooseLabel="Ảnh đại diện" />
                        </div>
                        <div className="grid mt-1">
                            <div className="col-4">
                                <input type="file" id="file-input" />
                                <label htmlFor='file-input' className='addimage'>
                                    <img className='w-full' src='https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg' alt='' />
                                </label>
                            </div>
                            <div className="col-4">
                                <input type="file" id="file-input" />
                                <label htmlFor='file-input' className='addimage'>
                                    <img className='w-full' src='https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg' alt='' />
                                </label>
                            </div>
                            <div className="col-4">
                                <input type="file" id="file-input" />
                                <label htmlFor='file-input' className='addimage'>
                                    <img className='w-full' src='https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg' alt='' />
                                </label>
                            </div>
                            <div className="col-4">
                                <input type="file" id="file-input" />
                                <label htmlFor='file-input' className='addimage'>
                                    <img className='w-full' src='https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg' alt='' />
                                </label>
                            </div>
                            <div className="col-4">
                                <input type="file" id="file-input" />
                                <label htmlFor='file-input' className='addimage'>
                                    <img className='w-full' src='https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg' alt='' />
                                </label>
                            </div>
                            <div className="col-4">
                                <input type="file" id="file-input" />
                                <label htmlFor='file-input' className='addimage'>
                                    <img className='w-full' src='https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg' alt='' />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 md:col-9 md:pl-5">
                        <div className="grid">
                            <div className="col-6">
                                <div className=''>Loại</div>
                                <Dropdown className='w-full'></Dropdown>
                            </div>
                            <div className="col-6">
                                <div className=''>Loại chi tiết</div>
                                <Dropdown className='w-full'></Dropdown>
                            </div>
                            <div className="col-12">
                                <div className=''>Tên sản phẩm</div>
                                <InputText className='w-full' />
                            </div>
                            <div className="col-6">
                                <div className=''>Giá bán</div>
                                <InputText className='w-full' />
                            </div>
                            <div className="col-6">
                                <div className=''>Giá niêm yết</div>
                                <InputText className='w-full' />
                            </div>
                        </div>
                        <div className='description editor p-2 mt-3'>
                            <Editor
                                    apiKey='6e616i1xetsifvarffma6u3bq62jkr5tbl6gngodsp2p24pg'
                                    onInit={(_evt, editor) => (editorRef.current = editor)}
                                    init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WatchDetail;