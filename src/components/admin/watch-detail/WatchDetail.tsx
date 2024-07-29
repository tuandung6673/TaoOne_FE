import { Editor } from '@tinymce/tinymce-react';
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from "primereact/toast";
import queryString from 'query-string';
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Editor as TinyMCEEditor } from 'tinymce';
import { Category, CategoryDetail, ItemDetail } from '../../../constants/interface';
import ApiService from '../../../services/api.service';
import './WatchDetail.scss';

function WatchDetail() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ItemDetail>(new ItemDetail());
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [categoryDetailList, setCategoryDetailList] = useState<CategoryDetail[]>([]);
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

    useEffect(() => {
        if(!!productId) {
            fetchDetailProduct(productId);
        }
        fetchCategory();
    } , [])

    useEffect(() => {
        if (formData.category_id) {
            fetchCategoryDetail();
        }
    }, [formData.category_code]);

    const fetchDetailProduct = async (id : string) => {
        try {
            const productDetail = await ApiService.getProductDetail(id);
            setFormData(productDetail.data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategory = async (queryParams = '') => {
        try {
            const categoryList = await ApiService.getCategoryList(queryParams);
            const ctgList = categoryList.data.data.map((item : Category) => {
                return {
                    label: item.name,
                    value: item.id,
                    code: item.code
                }
            });
            setCategoryList(ctgList);
        }
        catch (err) {
            console.log(err);
        }
    }

    const fetchCategoryDetail = async () => {
        try {
            const queryParams = queryString.stringify({category_code: formData.category_code})
            const categoryDetailList = await ApiService.getCategoryDetailList(queryParams);
            const ctgDList = categoryDetailList.data.data.map((item : CategoryDetail) => {
                return {
                    label: item.name,
                    value: item.id,
                }
            })
            setCategoryDetailList(ctgDList);
        } catch (error) {
            console.log(error);
            
        }
    }

    const handleCategoryChange = (e : any) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            category_code: e.code,
            category_id: e.value
        }));
        setCategoryDetailList([]);
    }

    const handleCategoryDetailChange = (e : any) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            category_detail_id: e.value,
        }));
    };

    
    const handleChange = (e : any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleEditorChange = (content : any) => {
        setFormData((prev) => ({
            ...prev,
            description: content
        }));
    }

    const handleBack = () => {
        navigate(-1);
    }

    const handleSubmit = async () => {
        const data : any = formData;
        delete data.category_code;
        delete data.category_detail_name;
        if(!productId) {
            delete data.id;
        }
        try {
            const response = await ApiService.postProduct(data);
            if (response.status === 'success' && toast.current) {
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: (!!productId ? 'Lưu' : 'Thêm mới') + ' thành công !' });
                navigate(-1);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <div className="detail-wrapper">
                <div className="header mb-3">
                    <BreadCrumb model={breadcrumbItems} home={home}></BreadCrumb>
                    <div className='header-main flex justify-content-between'>
                        <div className="header-left flex">
                            <div className="empty"></div>
                            <div className="main-title flex align-items-center ml-2">
                                {!!productId ? 'Chi tiết' : 'Thêm mới'}
                            </div>
                        </div>
                        <div className='flex mr-3'>
                            <div className='cancel-btn mr-2'>
                                <Button onClick={handleBack} label='Hủy' style={{'height': '40px'}} />
                            </div>
                            <div className='save-btn'>
                                <Button onClick={handleSubmit} label='Lưu' style={{'height': '40px'}} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <div className="col-12 md:col-3">
                        <div className="avatar">
                            <img className="w-full" src={formData.img ? formData.img : 'https://hochieuqua7.web.app/images/admin/setting/slide/empty-image.png'} alt="" />
                            <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} chooseLabel="Ảnh đại diện" />
                        </div>
                        <div className="grid mt-1">
                            {/* <div className="col-4">
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
                            </div> */}
                            {formData && formData.listImages?.map((item : any) => (
                                <div className="col-4 sub-image">
                                    <input type="file" id="file-input" />
                                    <label htmlFor='file-input' className='addimage'>
                                        <img className='w-full' src={item.imgSource ? item.imgSource : 'https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'} alt='' />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-12 md:col-9 md:pl-5">
                        <div className="grid">
                            <div className="col-6">
                                <div className=''>Loại</div>
                                <Dropdown 
                                    className='w-full' 
                                    optionValue='code'
                                    value={formData.category_code}
                                    options={categoryList}
                                    onChange={(e) => handleCategoryChange(categoryList.filter(item => item.code === e.value)[0])}
                                />
                            </div>
                            <div className="col-6">
                                <div className=''>Loại chi tiết</div>
                                <Dropdown 
                                    className='w-full'
                                    value={formData.category_detail_id}
                                    options={categoryDetailList}
                                    onChange={(e) => handleCategoryDetailChange(e)}
                                />
                            </div>
                            <div className="col-12">
                                <div className=''>Tên sản phẩm</div>
                                <InputText className='w-full' value={formData.name} name='name' onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="col-6">
                                <div className=''>Giá bán</div>
                                <InputText className='w-full' keyfilter="int" value={formData.salePrice.toLocaleString("vi-VN")} name='salePrice' onChange={(e) => handleChange(e)}/>
                            </div>
                            <div className="col-6">
                                <div className=''>Giá niêm yết</div>
                                <InputText className='w-full' keyfilter="int" value={formData.price.toLocaleString("vi-VN")} name='price' onChange={(e) => handleChange(e)}/>
                            </div>
                        </div>
                        <div className='description editor p-2 mt-3'>
                            <Editor
                                    apiKey='6e616i1xetsifvarffma6u3bq62jkr5tbl6gngodsp2p24pg'
                                    onInit={(_evt, editor) => (editorRef.current = editor)}
                                    value={formData.description}
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
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px;}',
                                        // language: 'vi'
                                    }}
                                    onEditorChange={handleEditorChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WatchDetail;