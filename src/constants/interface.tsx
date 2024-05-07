export interface BannerDetail {
    image: string;
    name: string;
}

export interface CategoryItem {
    name: string;
    image: string;
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
    name: string, 
    image: string,
    listImage: Image[],
    price: number,
    salePrice: number,
    categoryType: string,
    description: string,
    specs: string
}
