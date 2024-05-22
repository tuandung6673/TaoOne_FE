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
                url: "/watch",
            },
            {
                label: "iPad",
                name: "ipad",
                visible: AllRouteType.ipad === categoryName,
                url: "/ipad",
            },
            {
                label: "Macbook",
                name: "macbook",
                visible: AllRouteType.macbook === categoryName,
                url: "/macbook",
            },
            {
                label: "Airpod",
                name: "airpod",
                visible: AllRouteType.airpod === categoryName,
                url: "/airpod",
            },
            {
                label: "Phụ kiện",
                name: "accessories",
                visible: AllRouteType.accessories === categoryName,
                url: "/accessories",
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
            <div className={classes.product_up}>
                <div className={classes.product_left}>
                    {detailData && detailData.img && (
                        <img
                            className={classes.product_image}
                            src={detailData.img}
                            alt={detailData.name}
                        />
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
            <div className={classes.product_down}></div>
        </div>
    );
}

export default ProductDetail;
