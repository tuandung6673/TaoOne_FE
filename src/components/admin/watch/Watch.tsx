import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Paginator } from 'primereact/paginator';
import queryString from "query-string";
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ItemDetail } from '../../../constants/interface';
import ApiService from '../../../services/api.service';
import './Watch.scss';
import { AllRouteType } from '../../../constants/constants';

function Watch() {
    const op = useRef<OverlayPanel>(null);
    const home = { icon: 'pi pi-home', url: '' };
    const { categoryName } = useParams<{ categoryName?: string }>();
    const [items, setItems] = useState([
        { label: 'Sản phẩm' },
        { label: '' }
    ]);
    const slideParams = {
        category_code: '',
        category_detail_id: '',
        filter: '',
        offSet: 0,
        pageSize: 10
    }
    const [searchValue, setSearchValue] = useState('');
    const [watchList, setWatchList] = useState<ItemDetail[]>([]);
    const [recordsTotal, setRecordsTotal] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    useEffect(() => {
        if (categoryName) {
            slideParams.category_code = categoryName;
            fetchWatch();
        }
        setItems(prevItems => {
            const newItems = [...prevItems];
            if (categoryName === AllRouteType.watch) {
                newItems[1].label = 'Apple Watch';
            } else if (categoryName === AllRouteType.ipad) {
                newItems[1].label = 'iPad';
            } else if (categoryName === AllRouteType.macbook) {
                newItems[1].label = 'Macbook';
            } else if (categoryName === AllRouteType.airpods) {
                newItems[1].label = 'Airpod';
            } else {
                newItems[1].label = 'Accessories';
            }
            return newItems;
        });
    }, [categoryName]);

    const fetchWatch = async () => {
        try {
            const queryParams = queryString.stringify(slideParams);
            const watchList = await ApiService.getProductList(queryParams);
            setRecordsTotal(watchList.data.recordsTotal);
            setWatchList(watchList.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const onPageChange = (event : any) => {
        setRows(event.rows);
        setFirst(event.first);
        slideParams.offSet = event.first;
        slideParams.pageSize = event.rows;
        fetchWatch();
    };

    const imageBodyTemplate = (product : any) => {
        return <img src={product.img} alt={product.img} className="w-3rem shadow-2 border-round" />;
    };

    const priceFormatTemplate = (rowData : any, type : any) => {
        if(type === 'price') {
            return <span className='opacity-90 line-through'>{rowData.price.toLocaleString("vi-VN")}</span>
        }
        return <span className='font-semibold'>{rowData.salePrice.toLocaleString("vi-VN")}</span>
    }

    const optionsTemplate = () => {
        return <span className='flex justify-content-center' onClick={(e) => op.current?.toggle(e)}>
            <i className='pi pi-ellipsis-v'></i>
        </span>
    }

    const searchHandler = () => {
        slideParams.filter = searchValue;
        fetchWatch();
    }

    const handleKeyDown = (event : any) => {
        if(event && event.key === 'Enter') {
            searchHandler()
        }
    }

    return (
        <>
            <div className='wrapper'>
                <div className='header'>
                    <BreadCrumb model={items} home={home} />
                    <div className='grid'>
                        <div className="col-6 header-left flex" >
                            <div className="empty"></div>
                            <div className="main-title flex align-items-center ml-2">{items[1]?.label}</div>
                        </div>
                        <div className="col-6 header-right flex align-items-center justify-content-end">
                            <div className="search-btn flex">
                                <InputText placeholder='Nhập nội dung tìm kiếm' value={searchValue} onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => setSearchValue(e.target.value)} />
                                <Button onClick={() => searchHandler()} icon="pi pi-search" />
                            </div>
                            <div className='filter-btn'>
                                <Button label='Bộ lọc' icon="pi pi-sliders-h"/>
                            </div>
                            <div className='add-btn'>
                                <Button label='Thêm mới' icon="pi pi-plus" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='card'>
                    <div>
                        <DataTable value={watchList}>
                            <Column field='img' header="Hình ảnh" body={imageBodyTemplate}></Column>
                            <Column field='name' header="Tên"></Column>
                            <Column field='category_detail_name' header="Loại chi tiết"></Column>
                            <Column field='salePrice' header="Giá bán" body={(rowData) => priceFormatTemplate(rowData, 'salePrice')}></Column>
                            <Column field='price' header="Giá niêm yết" body={(rowData) => priceFormatTemplate(rowData, 'price')}></Column>
                            <Column header="Tùy chọn" body={optionsTemplate}></Column>
                        </DataTable>
                    </div>
                    <div className='flex justify-content-between surface-section'>
                        <div className='flex align-items-center pl-3'>
                            Tổng số {recordsTotal} bản ghi
                        </div>
                        <Paginator first={first} rows={rows} totalRecords={recordsTotal} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
                    </div>
                </div>
            </div>
            <OverlayPanel ref={op}>
                <div className='sort_option'>
                    <span className='mr-2'>
                        <i className='pi pi-pencil'></i>
                    </span>
                    Chỉnh sửa
                </div>
                <div className='sort_option'>
                    <span className='mr-2'>
                        <i className='pi pi-trash text-red-500'></i>
                    </span>
                    Xóa</div>
            </OverlayPanel>
        </>
    )
}

export default Watch;