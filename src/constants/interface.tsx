export interface BannerDetail {
    id: string;
    img: string;
    name: string;
    screen: string;
}

export interface CategoryItem {
    name: string;
    img: string;
    price: number;
    salePrice: number;
}

export interface Category {
    ctgName: string;
    ctgImage: string;
    listItems: CategoryItem[];
}

export interface Image {
    img: string;
    name: string;
}

export interface ItemDetail {
    id: string,
    category_id: string,
    category_detail_id: string,
    category_detail_name: string,
    img: string,
    name: string, 
    price: number,
    salePrice: number,
    description: string,
    specs: string
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