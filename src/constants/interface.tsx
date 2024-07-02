export interface BannerDetail {
    id: string;
    img: string;
    name: string;
    screen: string;
}
export interface CategoryDetail {
    id: string;
    name: string;
    category_id: string;
}

export class ItemDetail {
    id: string = '';
    category_id?: string = '';
    category_code?: string = '';
    category_detail_id?: string = '';
    category_detail_name?: string = '';
    img?: string = '';
    name?: string = ''; 
    price: number = 0;
    salePrice: number = 0;
    description?: string = '';
    specs?: string = '';
}

export interface HomeCategory {
    code: string, 
    id: string, 
    img: string, 
    is_show_home: number,
    name: string,
    order: number,
    status: number,
    products: ItemDetail[]
}

export interface HomeInterface {
    categories : HomeCategory[];
}

export interface DropdownInterface {
    label: string,
    value: string
}
export interface Category {
    id: string,
    code: string,
    name: string,
    img: string,
    order: number,
    status: number,
    is_show_home: number,
    products: any,
}