export class BannerDetail {
    id: string = "";
    img: string = "";
    name: string = "";
    screen: string = "";
    status: number = 1;
}
export class CategoryDetail {
    id: string = "";
    category_id: string = "";
    name: string = "";
    size: string[] = [];
}

export class SubImage {
    imgSource: string = ""
}

export class ItemDetail {
    id: string = "";
    category_id?: string = "";
    category_code?: string = "";
    category_detail_id?: string = "";
    category_detail_name?: string = "";
    img?: string = "";
    name?: string = "";
    size?: string = "";
    price: number = 0;
    salePrice: number = 0;
    description?: string = "";
    specs?: string = "";
    status: number = 0;
    listImages : SubImage[] = [];
}

export interface HomeCategory {
    code: string;
    id: string;
    img: string;
    is_show_home: number;
    name: string;
    order: number;
    status: number;
    products: ItemDetail[];
}

export interface HomeInterface {
    categories: HomeCategory[];
}

export interface DropdownInterface {
    label: string;
    value: string;
}
export class Category {
    id?: string = "";
    code: string = "";
    name: string = "";
    img: any = "";
    order: number = 0;
    status: number = 0;
    is_show_home: number = 0;
    products: any = "";
}

export class UserInfo {
    name: string = "";
    phone: string = "";
    email: string = "";
    tp: string = "";
    qh: string = "";
    px: string = "";
    address: string = "";
}

export class NewsDetail {
    id?: string = ""
    title : string = ""
    slug : string = ""
    thumbnailUrl : string = ""
    coverImageUrl : string = ""
    excerpt : string = "" 
    contentHtml : string = ""
    publishedAt : string = ""
    updatedAt : string = ""
    status : number = 0
}

export class PaymentForm extends UserInfo {
    id?: string | undefined = undefined;
    payment_method: string = "";
    note: string = "";
    products?: CartItem[] = [];
    status?: number = 0;
    total_bill?:number = 0;
    date?:string = "";
}
export interface Window {
    fbAsyncInit: () => void;
}

export class Login {
    username: string = "";
    password: string = "";
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    salePrice: number;
    img: string;
    quantity: number;
    category_code?: string;
    category_detail_name?: string;
    size?: string;
}
