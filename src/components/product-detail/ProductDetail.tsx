/* eslint-disable react-hooks/exhaustive-deps */
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { TabPanel, TabView } from 'primereact/tabview';
import { useEffect, useMemo, useRef, useState } from "react";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useNavigate, useParams } from "react-router-dom";
import "swiper/css";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss/navigation";
import { AllRouteType } from "../../constants/constants";
import { ItemDetail } from "../../constants/interface";
import saleLogo from "../../images/sale_tag_2.png";
import ApiService from "../../services/api.service";
import './ProductDetail.scss'
import { Toast } from "primereact/toast";

function ProductDetail() {
    const toast = useRef<Toast>(null);
    const abc = `<div class="woocommerce-Tabs-panel woocommerce-Tabs-panel--description panel entry-content active" id="tab-description" role="tabpanel" aria-labelledby="tab-title-description" bis_skin_checked="1">
        <h2><strong>Apple Watch Series 8 45mm GPS – Kháng nước, chống nứt, chống bụi tiêu chuẩn cao</strong></h2>
        <p>Apple Watch Series 8 45mm GPS là chiếc smartwatch sang trọng, được chế tác tinh xảo có khả năng chống nước và chống bụi. Đồng hồ được cải tiến nhiều tính năng đảm bảo độ chính xác khi theo dõi sức khỏe của người dùng. Bạn đã sẵn sàng tìm hiểu những điểm đặc biệt <a title="Đồng hồ Apple Watch Series 8 chính hãng" href="https://cellphones.com.vn/do-choi-cong-nghe/apple-watch/series-8.html" target="_blank" rel="noopener"><strong>đồng hồ&nbsp;Apple watch Series 8</strong></a>&nbsp;này chưa, cùng mình tìm hiểu nhé!</p>
        <p></p><div bis_skin_checked="1"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://cdn.xtmobile.vn/vnt_upload/product/08_2019/apple-watch-series-5-xtmobile_1.jpg" alt="Apple Watch Series 5 44mm LTE Ch&iacute;nh h&atilde;ng, Gi&aacute; rẻ - XTmobile"></div><p></p>
        <p>&nbsp;</p>
        <h3><strong>Màn hình lớn rực rỡ, hiển thị thông minh</strong></h3>
        <p>Apple Watch S8 45mm GPS sở hữu màn hình 1.9 inch có độ phân giải 484×396 pixels vô cùng rực rỡ. Mặt đồng hồ được bảo vệ bởi lớp kính Ion-X strengthened glass, giúp Watch 8 đạt tiêu chuẩn chống nứt, chống nước IP6X và bụi WR50.</p>
        <p>Các chi tiết đồng hồ trông tuyệt đẹp kết hợp với màn hình Retina Always – On sáng sủa khiến tổng thể trông vô cùng nổi bật. Chế độ Always-On cũng giúp bạn dễ dàng theo dõi các thông tin trên đồng hồ mà không cần phải chạm vào bề mặt hay ấn nút gì cả.</p>
        <blockquote><p>Xem thêm mẫu đồng hồ Apple Watch Series 8 tại Mạnh Quân Store</p></blockquote>
        <p>Đồng hồ cũng giúp phát hiện những tai nạn và biến cố xảy ra đối với người thân và liên lạc tìm sự trợ giúp để bảo vệ cho bạn. Cảm biến nhiệt độ giúp theo dõi nhiệt độ cơ thể để nhận biết chu kỳ rụng trứng, hỗ trợ hiệu quả kế hoạch hóa gia đình.</p>
        <p>Cac thông tin dữ liệu về chu kỳ của bạn sẽ được mã hóa bằng mật mã, do đó bạn hoàn toàn yên tâm về tính năng bảo mật. Nếu có bất cứ vấn đề gì bất thường, bạn có thể chọn chia sẻ chu kỳ của bản thân với dịch vụ chăm sóc sức khỏe để có biện pháp cải thiện tốt nhất.</p>
        <p></p><div bis_skin_checked="1"><img style="display: block; margin-left: auto; margin-right: auto;" loading="lazy" decoding="async" class="aligncenter" src="https://cdn.viettelstore.vn/Images/Product/ProductImage/69267744.jpeg" alt="Apple Watch Series 8 GPS 41mm - ViettelStore.vn" width="429" height="429"></div><p></p>
        <h3><strong>Kết nối dễ dàng</strong></h3>
        <p>Apple Series 8 45mm GPS có thể kết nối với điện thoại hoặc máy tính dễ dàng qua Bluetooth 5.0. Giúp bạn tra cứu, truyền tải thông tin nhanh chóng, bạn cũng có thể nhận được thông báo từ các ứng dụng, mạng xã hội,…để giúp cho việc học tập, liên lạc dễ dàng hơn.</p>
        <h3><strong>Pin ấn tượng</strong></h3>
        <p>Apple Watch Series 8 45mm được tích hợp viên pin chất lượng cao cung cấp thời gian dùng lớn đến 36 giờ khi sử dụng ở chế độ nguồn điện thấp. Bạn có thể giữ thiết bị dùng lâu hơn với chế độ nguồn Nghe gọi qua Bluetoothn điện thấp để tiết kiệm năng lượng.</p>
        <p>&nbsp;</p>
        <p></p><div bis_skin_checked="1"><img style="display: block; margin-left: auto; margin-right: auto;" decoding="async" class="aligncenter" src="https://cdn.xtmobile.vn/vnt_upload/product/08_2019/apple-watch-series-5-xtmobile_1.jpg" alt="Apple Watch Series 5 44mm LTE Chính hãng, Giá rẻ - XTmobile"></div><p></p>
    </div>`
    const navigate = useNavigate();
    const [detailData, setDetailData] = useState<ItemDetail>(new ItemDetail());
    const [mainImage, setMainImage] = useState<string>();
    const { categoryName, itemId } = useParams();
    const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([]);
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

    const formatNumber = (number : number) => {
        return new Intl.NumberFormat('de-DE').format(number);
    };

    useEffect(() => {
        if(itemId) {
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
                },
            ];
            setBreadcrumbItems(newBreadcrumbItems);
        }
    }, [detailData, breadcrumItem]);

    const fetchProductDetail = async (id : string) => {
        try {
            const productDetail = await ApiService.getProductDetail(id);
            setDetailData(productDetail.data);
            setMainImage(productDetail.data.img);
        } catch (error) {
            
        }
    }

    const changeImage = (item : any) => {
        setMainImage(item.imgSource)
    }

    const buynow = () => {
        navigate('/thanh-toan/'+ itemId)
    }

    const bagnow = () => {
        if(toast.current) {
            toast.current.show({severity: 'warn', summary: 'Thông báo', detail: 'Tính năng giỏ hàng đang được phát triển'})
        }
    }

    return (
        <div className="product">
            <Toast ref={toast} />
            <div className="product1">
                <div className="product_up">
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
                                    1200: { slidesPerView: 5 },  // Từ 1200px trở lên, hiển thị 4 slides
                                    576: { slidesPerView: 4 },   // Từ 576px trở lên, hiển thị 2 slides
                                    0: { slidesPerView: 3 }      // Dưới 576px, hiển thị 1 slide
                                }}
                                modules={[
                                    Navigation,
                                    Pagination,
                                    Scrollbar,
                                    A11y,
                                ]}
                            >
                                {detailData && detailData.listImages?.map((item : any, index : any) => (
                                    <SwiperSlide onClick={() => changeImage(item)} key={index}>
                                        <img src={item.imgSource} alt={item.name}/>
                                    </SwiperSlide>
                                ))}
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
                        {detailData && detailData.price && detailData.salePrice && (
                            <div>
                                <span className="sale_price">
                                    {formatNumber(detailData.salePrice)}đ
                                </span>
                                <span className="price">
                                    {formatNumber(detailData.price)}đ
                                </span>
                            </div>
                        )}
                        <div className="status">
                            <div className="status_item">
                                <span className="status_icon pi pi pi-star-fill"></span>
                                <span className="status_value">Sản phẩm chính hãng Apple 100%</span>
                            </div>
                            <div className="status_item">
                                <span className="status_icon pi pi pi-star-fill"></span>
                                <span className="status_value">Giá đã bao gồm VAT</span>
                            </div>
                            <div className="status_item">
                                <span className="status_icon pi pi pi-star-fill"></span>
                                <span className="status_value">Bảo hành 4/6/12 tháng</span>
                            </div>
                            <div className="status_item">
                                <span className="status_icon pi pi pi-star-fill"></span>
                                <span className="status_value">Giảm giá 10% phụ kiện khi mua kèm theo</span>
                            </div>
                        </div>
                        <div className="gift">
                            <div className="gift_header">
                                <i className="pi pi-ticket"></i>
                                <span>Quà tặng</span>
                            </div>
                            <div> - Dây đeo và dây sạc chính hãng</div>
                            <div> - Miếng dán màn hình</div>
                            <div> - Vệ sinh máy trọn đời</div>
                        </div>
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
                    </div>
                </div>
            </div>
            <div className="product2">
                <div className="product_down">
                    <TabView>
                        <TabPanel header="Mô tả">
                            <div className="descrip" dangerouslySetInnerHTML={{__html: `${detailData.description}`}}>

                            </div>
                        </TabPanel>
                        <TabPanel header="Thông số kĩ thuật">
                            <div className="descrip" dangerouslySetInnerHTML={{__html: `${detailData.specs}`}}>

                            </div>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
