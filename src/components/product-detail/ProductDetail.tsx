import { BreadCrumb } from "primereact/breadcrumb";
import { MenuItem } from "primereact/menuitem";
import { Button } from "primereact/button";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import "swiper/css";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss/navigation";
import { AllRouteType, CAM_KET, QUA_TANG } from "../../constants/constants";
import { ItemDetail, ProductCommentSummary, SubImage } from "../../constants/interface";
import { useCart } from "../../custom-hook/CartContext";
import GiftIcon from "../../icons/giftbox.png";
import saleLogo from "../../images/sale_tag_2.png";
import ApiService from "../../services/api.service";
import LeadForm from "../event/LeadForm";
import ProductCommentSection from "../product-comment/ProductCommentSection";
import StarRating from "../product-comment/StarRating";
import ProductItem from "../product-item/ProductItem";
import "./ProductDetail.scss";

const HOME_BREADCRUMB = { icon: "pi pi-home", url: "/" };
const REVIEWS_TAB_INDEX = 3;
const EMPTY_COMMENT_SUMMARY: ProductCommentSummary = { average_rating: 0, total_count: 0, comments: [] };

const RELATED_PRODUCTS_BREAKPOINTS = {
    1200: { slidesPerView: 4, spaceBetween: 25 },
    768: { slidesPerView: 3, spaceBetween: 20 },
    0: { slidesPerView: 2, spaceBetween: 15 },
};

const LIST_IMAGE_BREAKPOINTS = {
    1200: { slidesPerView: 5 },
    576: { slidesPerView: 4 },
    0: { slidesPerView: 3 },
};

const SWIPER_MODULES = [Navigation, Pagination, Scrollbar, A11y];

const formatNumber = (number: number) => new Intl.NumberFormat("de-DE").format(number);

const parseSizes = (size?: string) =>
    size ? size.split(",").map((s) => s.trim()) : [];

function ProductDetail() {
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    const [detailData, setDetailData] = useState<ItemDetail>(new ItemDetail());
    const [relatedProducts, setRelatedProducts] = useState<ItemDetail[]>([]);
    const [mainImage, setMainImage] = useState<string>();
    const [selectedSize, setSelectedSize] = useState<string>("");
    const { categoryName, itemId } = useParams();
    const [breadcrumbItems, setBreadcrumbItems] = useState<MenuItem[]>([]);
    const { addToCart } = useCart();
    const [commentSummary, setCommentSummary] = useState<ProductCommentSummary>(EMPTY_COMMENT_SUMMARY);
    const [commentLoading, setCommentLoading] = useState(false);
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    const categoryBreadcrumbItems = useMemo(
        () => [
            {
                label: "Apple Watch",
                name: "watch",
                visible: AllRouteType.watch === categoryName,
                url: "/" + AllRouteType.watch,
            },
            {
                label: "iPad",
                name: "ipad",
                visible: AllRouteType.ipad === categoryName,
                url: "/" + AllRouteType.ipad,
            },
            {
                label: "Macbook",
                name: "macbook",
                visible: AllRouteType.macbook === categoryName,
                url: "/" + AllRouteType.macbook,
            },
            {
                label: "Airpod",
                name: "airpod",
                visible: AllRouteType.airpods === categoryName,
                url: "/" + AllRouteType.airpods,
            },
            {
                label: "Phụ kiện",
                name: "accessories",
                visible: AllRouteType.accessories === categoryName,
                url: "/" + AllRouteType.accessories,
            },
        ],
        [categoryName]
    );

    const sizeOptions = useMemo(() => parseSizes(detailData.size), [detailData.size]);
    const salePercent = useMemo(() => {
        if (!detailData.price) return 0;
        return Math.round((1 - detailData.salePrice / detailData.price) * 100);
    }, [detailData.price, detailData.salePrice]);

    const fetchComments = useCallback(async () => {
        if (!itemId) return;

        setCommentLoading(true);
        try {
            const res = await ApiService.getProductCommentsByProduct(itemId);
            setCommentSummary(res?.data ?? EMPTY_COMMENT_SUMMARY);
        } catch (err) {
            console.error(err);
        } finally {
            setCommentLoading(false);
        }
    }, [itemId]);

    useEffect(() => {
        setActiveTabIndex(0);
        fetchComments();
    }, [fetchComments]);

    const handleViewReviews = useCallback(() => {
        setActiveTabIndex(REVIEWS_TAB_INDEX);
        document.querySelector(".product2")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    useEffect(() => {
        if (!itemId) return;

        const fetchProductDetail = async () => {
            try {
                const { data } = await ApiService.getProductDetail(itemId);
                setDetailData(data);
                setMainImage(data.img);

                const sizes = parseSizes(data.size);
                if (sizes.length > 0) {
                    setSelectedSize(sizes[0]);
                }

                if (data.id) {
                    const related = await ApiService.getRelatedProducts(data.id);
                    setRelatedProducts(related.data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchProductDetail();
        window.scrollTo(0, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemId]);

    useEffect(() => {
        const newBreadcrumbItems = [
            ...categoryBreadcrumbItems,
            {
                label: detailData.category_detail_name,
                command: () => {
                    navigate(
                        `/${detailData.category_code}?ctgDetail=${detailData.category_detail_id}`
                    );
                },
            },
        ];
        setBreadcrumbItems(newBreadcrumbItems);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detailData, categoryBreadcrumbItems]);

    const changeImage = useCallback((item: SubImage) => {
        setMainImage(item.imgSource);
    }, []);

    const buynow = useCallback(() => {
        const queryParams = selectedSize
            ? "?" + queryString.stringify({ size: selectedSize })
            : "";
        navigate(`/thanh-toan/${itemId}${queryParams}`);
    }, [navigate, itemId, selectedSize]);

    const bagnow = useCallback(() => {
        if (!detailData.id) return;

        addToCart({
            id: detailData.id,
            name: detailData.name || "",
            price: detailData.price,
            salePrice: detailData.salePrice,
            img: detailData.img || "",
            quantity: 1,
            category_code: detailData.category_code,
            category_detail_name: detailData.category_detail_name,
            size: selectedSize,
        });

        toast.current?.show({
            severity: "success",
            summary: "Thành công",
            detail: "Đã thêm sản phẩm vào giỏ hàng!",
        });
    }, [addToCart, detailData, selectedSize]);

    const handleAddToCart = useCallback((productName: string) => {
        toast.current?.show({
            severity: "success",
            summary: "Thành công",
            detail: `Đã thêm ${productName} vào giỏ hàng!`,
        });
    }, []);

    return (
        <div className="product">
            <Toast ref={toast} />
            <div className="product1">
                <div className="product_up">
                    <div className="breadcrumb_mb p-0">
                        <BreadCrumb model={breadcrumbItems} home={HOME_BREADCRUMB} />
                    </div>
                    <div className="product_left">
                        <div className="product_left2">
                            {detailData.img && (
                                <Zoom>
                                    <img
                                        className="product_image"
                                        src={mainImage}
                                        alt={detailData.name}
                                        loading="eager"
                                    />
                                </Zoom>
                            )}
                            {detailData.price !== detailData.salePrice && (
                                <div>
                                    <img
                                        className="sale_logo"
                                        src={saleLogo}
                                        alt="logo"
                                    />
                                    <span className="sale_percent">
                                        -{salePercent}%
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="list_image">
                            <Swiper
                                spaceBetween={20}
                                slidesPerView={5}
                                breakpoints={LIST_IMAGE_BREAKPOINTS}
                                modules={SWIPER_MODULES}
                            >
                                {detailData.listImages?.map((item, index) => (
                                    <SwiperSlide
                                        onClick={() => changeImage(item)}
                                        key={index}
                                    >
                                        <img src={item.imgSource} alt="" />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                    <div className="product_right">
                        <div className="breadcrumb">
                            <BreadCrumb model={breadcrumbItems} home={HOME_BREADCRUMB} />
                        </div>
                        {detailData.name && (
                            <div className="product_name">
                                {detailData.name}
                            </div>
                        )}
                        <div className="product_rating" onClick={handleViewReviews}>
                            <StarRating value={commentSummary.average_rating} size={14} />
                            {commentSummary.total_count > 0 ? (
                                <>
                                    <span className="product_rating_score">{commentSummary.average_rating.toFixed(1)}</span>
                                    <span className="product_rating_count">({commentSummary.total_count} đánh giá)</span>
                                </>
                            ) : (
                                <span className="product_rating_count">Chưa có đánh giá — Hãy là người đầu tiên</span>
                            )}
                        </div>
                        {detailData.price && detailData.salePrice && (
                            <div>
                                <span className="sale_price">
                                    {formatNumber(detailData.salePrice)}đ
                                </span>
                                <span className="price">
                                    {formatNumber(detailData.price)}đ
                                </span>
                            </div>
                        )}
                        {sizeOptions.length > 0 && (
                            <div className="product_size">
                                Phiên bản:
                                {sizeOptions.map((size) => (
                                    <span
                                        key={size}
                                        className={`product_size_item ${selectedSize === size ? "active" : ""}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="product_action">
                            <div className="cart" onClick={buynow}>
                                <Button
                                    label="Mua ngay"
                                    icon="pi pi-shopping-cart"
                                />
                            </div>
                            <div className="bag" onClick={bagnow}>
                                <Button
                                    label="Thêm giỏ hàng"
                                    icon="pi pi-shopping-bag"
                                />
                            </div>
                        </div>
                        <div className="status">
                            {CAM_KET.map((item) => (
                                <div className="status_item" key={item}>
                                    <span className="status_icon pi pi pi-star-fill"></span>
                                    <span className="status_value">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="gift">
                            <div className="gift_header">
                                {/* <i className="pi pi-ticket"></i> */}
                                <span>
                                    <img
                                        className="gift_icon"
                                        src={GiftIcon}
                                        alt=""
                                    />
                                </span>
                                <span>Quà tặng</span>
                            </div>
                            {QUA_TANG.map((item) => (
                                <div key={item}>- {item}</div>
                            ))}
                        </div>
                        <div className="lead_form_section">
                            <div className="lead_form_title">Đăng ký nhận ưu đãi</div>
                            <LeadForm source={detailData.name || ""} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="product2">
                <div className="product_down">
                    <TabView activeIndex={activeTabIndex} onTabChange={(e) => setActiveTabIndex(e.index)}>
                        <TabPanel header="Mô tả">
                            <div
                                className="descrip"
                                dangerouslySetInnerHTML={{
                                    __html: detailData.description || "",
                                }}
                            ></div>
                        </TabPanel>
                        <TabPanel header="Thông số kĩ thuật">
                            <div
                                className="descrip"
                                dangerouslySetInnerHTML={{
                                    __html: detailData.specs || "",
                                }}
                            ></div>
                        </TabPanel>
                        <TabPanel header="Sản phẩm tương tự">
                            {relatedProducts.length > 0 && (
                                <div className="related_products">
                                    <div className="related_inner">
                                        <Swiper
                                            breakpoints={RELATED_PRODUCTS_BREAKPOINTS}
                                            modules={SWIPER_MODULES}
                                        >
                                            {relatedProducts.map((item: ItemDetail, index: number) => (
                                                <SwiperSlide key={index}>
                                                    <ProductItem
                                                        productItem={item}
                                                        onAddToCart={handleAddToCart}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>
                            )}
                        </TabPanel>
                        <TabPanel header={`Đánh giá (${commentSummary.total_count})`}>
                            <ProductCommentSection
                                productId={detailData.id}
                                summary={commentSummary}
                                loading={commentLoading}
                                onCommentPosted={fetchComments}
                            />
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
