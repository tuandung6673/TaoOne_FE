import { Editor } from '@tinymce/tinymce-react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from "primereact/toast";
import queryString from 'query-string';
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Editor as TinyMCEEditor } from 'tinymce';
import { Category, CategoryDetail, ItemDetail } from '../../../constants/interface';
import { storage } from '../../../firebase/firebaseConfig';
import ApiService from '../../../services/api.service';
import './WatchDetail.scss';
import { useSpinner } from '../../../custom-hook/SpinnerContext';

function WatchDetail() {
    const navigate = useNavigate();
    const { showSpinner, hideSpinner } = useSpinner();
    const [image, setImage] = useState<File | null>(null);
    const [isChangeAvatar, setIsChangeAvatar] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [formData, setFormData] = useState<ItemDetail>(new ItemDetail());
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [categoryDetailList, setCategoryDetailList] = useState<CategoryDetail[]>([]);
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const toast = useRef<Toast>(null);
    // them moi se ko co productId nen se check (productId)
    const { productId } = useParams<{ productId?: string }>();
    const breadcrumbItems = [{ label: "Sản phẩm" }, { label: !!productId ? 'Chi tiết' : 'Thêm mới' }];
    const home = { icon: "pi pi-home", url: "" };
    
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
    
    const uploadAvatar = (): Promise<void> => {
        showSpinner();
        return new Promise((resolve, reject) => {
            if (image) {
                const storageRef = ref(storage, `images/${image.name}`);
                const uploadTask = uploadBytesResumable(storageRef, image);
          
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        // Tiến trình tải lên
                    },
                    (error) => {
                        console.error("Upload failed", error);
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL1) => {
                            setImageUrl(downloadURL1);
                            hideSpinner();
                            resolve();
                        });
                    }
                );
            } else {
                resolve();
            }
        });
    }

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
            setImageUrl(productDetail.data.img);
        } catch (error) {
            console.log(error);
        }
    }

    const uploadSubImage = (file: File): Promise<string> => {
        showSpinner();
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
    
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Tiến trình tải lên
                },
                (error) => {
                    console.error("Upload failed", error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        // resolve(downloadURL);
                        resolve('https://firebasestorage.googleapis.com/v0/b/taoone-c4bb7.appspot.com/o/images%2F' + file?.name + '?alt=media')
                        hideSpinner();
                    });
                }
            );
        });
    };

    const handleSubImageChange = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            try {
                const downloadURL = await uploadSubImage(file);
                const newListImages = [...formData.listImages];
                newListImages[index] = { ...newListImages[index], imgSource: downloadURL };
                setFormData({ ...formData, listImages: newListImages });
            } catch (error) {
                console.error("Error uploading image", error);
            }
        }
    };
    
    const handleAddSubImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            try {
                const downloadURL = await uploadSubImage(file);
                const newListImages = [...formData.listImages, { imgSource: downloadURL }];
                setFormData({ ...formData, listImages: newListImages });
            } catch (error) {
                console.error("Error uploading image", error);
            }
        }
    };

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
        data.img = isChangeAvatar ? 'https://firebasestorage.googleapis.com/v0/b/taoone-c4bb7.appspot.com/o/images%2F' + image?.name + '?alt=media' : formData.img;
        delete data.category_code;
        delete data.category_detail_name;
        if(!productId) {
            delete data.id;
        }

        try {
            const response = await ApiService.postProduct(data);
            if (response.status === 'success') {
                if (toast.current) {
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: (!!productId ? 'Lưu' : 'Thêm mới') + ' thành công !' });
                }
                if(isChangeAvatar) {
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
    }

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
                            <input type='file' id='avatar-input' accept='image/*' onChange={onSelect}/>
                            <label htmlFor='avatar-input'>
                                <img className="w-full" src={imageUrl ? imageUrl : 'https://hochieuqua7.web.app/images/admin/setting/slide/empty-image.png'} alt="abcákjdh" />
                            </label>
                        </div>
                        <div className="grid mt-3">
                            {formData && formData.listImages?.map((item : any, index) => (
                                <div className="col-4 sub-image" key={index}>
                                    <input type="file" id={`file-input-${index}`} accept='image/*' onChange={(event) => handleSubImageChange(index, event)} />
                                    <label htmlFor={`file-input-${index}`} className='addimage cursor-pointer'>
                                        <img className='w-full h-full' src={item.imgSource ? item.imgSource : 'https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'} alt='' />
                                    </label>
                                    <button className="delete-button" onClick={() => handleDeleteSubImage(index)}><i className='pi pi-trash'></i></button>
                                </div>
                            ))}
                            {formData && formData.listImages?.length < 6 && (
                                <div className="col-4 sub-image add-image">
                                    <input type="file" id="file-input" accept='image/*' onChange={handleAddSubImage}  />
                                    <label htmlFor='file-input' className='flex justify-content-center align-items-center w-full h-full cursor-pointer'>
                                        <span className='w-full flex justify-content-center align-items-center'><i className='pi pi-plus text-3xl'></i></span>
                                    </label>
                                </div>
                            )}
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