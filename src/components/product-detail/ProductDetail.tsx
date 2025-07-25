/* eslint-disable react-hooks/exhaustive-deps */
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import "swiper/css";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss/navigation";
import { AllRouteType, CAM_KET, QUA_TANG } from "../../constants/constants";
import { ItemDetail } from "../../constants/interface";
import GiftIcon from "../../icons/giftbox.png";
import saleLogo from "../../images/sale_tag_2.png";
import ApiService from "../../services/api.service";
import { useCart } from "../../custom-hook/CartContext";
import "./ProductDetail.scss";

function ProductDetail() {
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    const [detailData, setDetailData] = useState<ItemDetail>(new ItemDetail());
    const [mainImage, setMainImage] = useState<string>();
    const { categoryName, itemId } = useParams();
    const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([]);
    const { addToCart } = useCart();
    const home = { icon: "pi pi-home", url: "/" };
    const breadcrumItem = useMemo(
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

    const formatNumber = (number: number) => {
        return new Intl.NumberFormat("de-DE").format(number);
    };

    useEffect(() => {
        if (itemId) {
            fetchProductDetail(itemId);
        }
    }, [itemId]);

    useEffect(() => {
        if (detailData) {
            const newBreadcrumbItems = [
                // Tạo breadcrumb cho các loại sản phẩm
                ...breadcrumItem,
                {
                    label: detailData.category_detail_name,
                    command: () => {
                        navigate(`/${detailData.category_code}?ctgDetail=${detailData.category_detail_id}`);
                    }
                },
            ];
            setBreadcrumbItems(newBreadcrumbItems);
        }
    }, [detailData, breadcrumItem]);

    const fetchProductDetail = async (id: string) => {
        try {
            const productDetail = await ApiService.getProductDetail(id);
            setDetailData(productDetail.data);
            setMainImage(productDetail.data.img);
        } catch (error) {}
    };

    const changeImage = (item: any) => {
        setMainImage(item.imgSource);
    };

    const buynow = () => {
        navigate("/thanh-toan/" + itemId);
    };

    const bagnow = () => {
        if (detailData && detailData.id) {
            addToCart({
                id: detailData.id,
                name: detailData.name || "",
                price: detailData.price,
                salePrice: detailData.salePrice,
                img: detailData.img || "",
                quantity: 1,
                category_code: detailData.category_code,
                category_detail_name: detailData.category_detail_name
            });
            
            if (toast.current) {
                toast.current.show({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Đã thêm sản phẩm vào giỏ hàng!",
                });
            }
        }
    };

    return (
        <div className="product">
            <Toast ref={toast} />
            <div className="product1">
                <div className="product_up">
                    <div className="breadcrumb_mb p-0">
                        <BreadCrumb model={breadcrumbItems} home={home} />
                    </div>
                    <div className="product_left">
                        <div className="product_left2">
                            {detailData && detailData.img && (
                                <Zoom>
                                    <img
                                        className="product_image"
                                        src={mainImage}
                                        alt={detailData.name}
                                    />
                                </Zoom>
                            )}
                            {detailData?.price !== detailData?.salePrice && (
                                <div>
                                    <img
                                        className="sale_logo"
                                        src={saleLogo}
                                        alt="logo"
                                    />
                                    <span className="sale_percent">
                                        -
                                        {(
                                            (1 -
                                                detailData.salePrice /
                                                    detailData.price) *
                                            100
                                        ).toFixed(0)}
                                        %
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="list_image">
                            <Swiper
                                spaceBetween={20}
                                slidesPerView={5}
                                breakpoints={{
                                    1200: { slidesPerView: 5 }, // Từ 1200px trở lên, hiển thị 4 slides
                                    576: { slidesPerView: 4 }, // Từ 576px trở lên, hiển thị 2 slides
                                    0: { slidesPerView: 3 }, // Dưới 576px, hiển thị 1 slide
                                }}
                                modules={[
                                    Navigation,
                                    Pagination,
                                    Scrollbar,
                                    A11y,
                                ]}
                            >
                                {detailData &&
                                    detailData.listImages?.map(
                                        (item: any, index: any) => (
                                            <SwiperSlide
                                                onClick={() =>
                                                    changeImage(item)
                                                }
                                                key={index}
                                            >
                                                <img
                                                    src={item.imgSource}
                                                    alt={item.name}
                                                />
                                            </SwiperSlide>
                                        )
                                    )}
                            </Swiper>
                        </div>
                    </div>
                    <div className="product_right">
                        <div className="breadcrumb">
                            <BreadCrumb model={breadcrumbItems} home={home} />
                        </div>
                        {detailData && detailData.name && (
                            <div className="product_name">
                                {detailData.name}
                            </div>
                        )}
                        {/* <div className="product_rating">
                            <div>
                                <Rating value={4} readOnly cancel={false} />
                            </div>
                            |<span>5 Đánh giá</span>|<span>Nhận xét</span>
                        </div> */}
                        {detailData &&
                            detailData.price &&
                            detailData.salePrice && (
                                <div>
                                    <span className="sale_price">
                                        {formatNumber(detailData.salePrice)}đ
                                    </span>
                                    <span className="price">
                                        {formatNumber(detailData.price)}đ
                                    </span>
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
                            {CAM_KET.map((item: any, index: any) => (
                                <div className="status_item" key={index}>
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
                            {QUA_TANG.map((item: any, index: any) => (
                                <div key={index}>{item}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="product2">
                <div className="product_down">
                    <TabView>
                        <TabPanel header="Mô tả">
                            <div
                                className="descrip"
                                dangerouslySetInnerHTML={{
                                    __html: `${detailData.description}`,
                                }}
                            ></div>
                        </TabPanel>
                        <TabPanel header="Thông số kĩ thuật">
                            <div
                                className="descrip"
                                dangerouslySetInnerHTML={{
                                    __html: `${detailData.specs}`,
                                }}
                            ></div>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
