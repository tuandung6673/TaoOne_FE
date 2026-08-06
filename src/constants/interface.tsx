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
    size: any = "";
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
    status: number = 1;
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
    status : number = 1
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

export interface AdviseForm {
    id?: string;
    name?: string;
    phone?: string;
    note?: string;
    source?: string;
    status: number;
    submitDate:string;
}

export interface SaleRecord {
    id: string;
    month: number;
    year: number;
    importBatchId: string;
    createdDate: string;
    stt: number;
    phone: string;
    address: string;
    facebook: string;
    gender: string;
    productLine: string;
    size: string;
    color: string;
    material: string;
    imei: string;
    version: string;
    paymentMethod: string;
    battery: string;
    soldDate: string;
    deliveryDate: string;
    warranty: string;
    importPrice: number;
    sellPrice: number;
    cost: number;
    profit: number;
    customerPaid: number | null;
    note: string | null;
    source: string | null;
}

export interface VoucherCategoryDetail {
    category_detail_id: string;
}

export interface VoucherCategory {
    category_id: string;
    category_details: VoucherCategoryDetail[];
}

export class VoucherModel {
    id?: string = "";
    code: string = "";
    name: string = "";
    discount_type: "percent" | "amount" = "percent";
    discount_value: number = 0;
    max_discount_amount?: number | null = null;
    min_order_amount?: number | null = null;
    start_date: string = "";
    end_date: string = "";
    usage_limit?: number | null = null;
    usage_limit_per_user?: number | null = null;
    status: number = 1;
    apply_scope: "all" | "category" = "all";
    categories: VoucherCategory[] = [];
}

export interface VoucherListItem {
    id: string;
    code: string;
    name: string;
    discount_type: "percent" | "amount";
    discount_value: number;
    start_date: string;
    end_date: string;
    usage_limit: number | null;
    used_count: number;
    status: number;
}

export interface CheckApplyVoucherCartLine {
    product_id: string;
    price: number;
    quantity: number;
}

export interface CheckApplyVoucherRequest {
    code: string;
    phone: string | null;
    cart: CheckApplyVoucherCartLine[];
}

export interface VoucherApplicableProduct {
    product_id: string;
    discount_amount: number;
}

export interface VoucherIneligibleProduct {
    product_id: string;
    reason: string;
}

export interface CheckApplyVoucherResult {
    valid: boolean;
    message: string;
    voucher_id?: string;
    discount_amount: number;
    applicable_products: VoucherApplicableProduct[];
    ineligible_products: VoucherIneligibleProduct[];
}
