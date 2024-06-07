/* eslint-disable react-hooks/exhaustive-deps */
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AllRouteType } from "../../constants/constants";
import { ItemDetail } from "../../constants/interface";
import saleLogo from "../../images/sale_tag_2.png";
import ApiService from "../../services/api.service";
import classes from "./ProductDetail.module.scss";
import { TabView, TabPanel } from 'primereact/tabview';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

function ProductDetail() {
    const [detailData, setDetailData] = useState<ItemDetail>(new ItemDetail());
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
            setDetailData(productDetail.data)
        } catch (error) {
            
        }
    }

    return (
        <div className={classes.product}>
            <div className={classes.product1}>
                <div className={classes.product_up}>
                    <div className={classes.product_left}>
                        {detailData && detailData.img && (
                            <Zoom>
                                <img
                                    className={classes.product_image}
                                    src={detailData.img}
                                    alt={detailData.name}
                                />
                            </Zoom>
                        )}
                        {detailData?.price !== detailData?.salePrice && (
                            <div>
                                <img
                                    className={classes.sale_logo}
                                    src={saleLogo}
                                    alt="logo"
                                />
                                <span className={classes.sale_percent}>
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
                    <div className={classes.product_right}>
                        <div className={classes.breadcrumb}>
                            <BreadCrumb model={breadcrumbItems} home={home} />
                        </div>
                        {detailData && detailData.name && (
                            <div className={classes.product_name}>
                                {detailData.name}
                            </div>
                        )}
                        {/* <div className={classes.product_rating}>
                            <div>
                                <Rating value={4} readOnly cancel={false} />
                            </div>
                            |<span>5 Đánh giá</span>|<span>Nhận xét</span>
                        </div> */}
                        {detailData && detailData.price && detailData.salePrice && (
                            <div>
                                <span className={classes.sale_price}>
                                    {formatNumber(detailData.salePrice)}đ
                                </span>
                                <span className={classes.price}>
                                    {formatNumber(detailData.price)}đ
                                </span>
                            </div>
                        )}
                        <div className={classes.status}>
                            Tình trạng: Còn sản phẩm
                        </div>
                        <div className={classes.product_action}>
                            <div className={classes.cart}>
                                <Button
                                    label="Mua ngay"
                                    icon="pi pi-shopping-cart"
                                />
                            </div>
                            <div className={classes.bag}>
                                <Button
                                    label="Thêm vào giỏ hàng"
                                    icon="pi pi-shopping-bag"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.product2}>
                <div className={classes.product_down}>
                    <TabView>
                        <TabPanel header="Mô tả">
                            <p className="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </TabPanel>
                        <TabPanel header="Thông số kĩ thuật">
                            <p className="m-0">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
                                eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                                enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui 
                                ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                            </p>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
