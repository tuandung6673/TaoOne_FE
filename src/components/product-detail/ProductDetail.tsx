/* eslint-disable react-hooks/exhaustive-deps */
import { BreadCrumb } from "primereact/breadcrumb";
import classes from "./ProductDetail.module.scss";
import { AllRouteType } from "../../constants/constants";
import { useParams } from "react-router-dom";
import { dummyDetail } from "../../dummyDatas/dummyData";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from 'primereact/button';
import { Rating } from "primereact/rating";

function ProductDetail() {
    const [detailData, setDetailData] = useState<any>();
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

    useEffect(() => {
        setDetailData(dummyDetail);
    }, [itemId]);

    useEffect(() => {
        if (detailData) {
            const newBreadcrumbItems = [
                // Tạo breadcrumb cho các loại sản phẩm
                ...breadcrumItem,
                {
                    label: detailData.categoryType,
                },
            ];
            setBreadcrumbItems(newBreadcrumbItems);
        }
    }, [detailData, breadcrumItem]);

    return (
        <div className={classes.product}>
            <div className={classes.product_up}>
                <div className={classes.product_left}>
                    {detailData && detailData.image && (
                        <img src={detailData.image} alt={detailData.name} />
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
                    <div className={classes.product_rating}>
                        <div>
                            <Rating value={4} readOnly cancel={false} />
                        </div>
                        |<span>5 Đánh giá</span>|<span>Nhận xét</span>
                    </div>
                    {detailData && detailData.price && detailData.salePrice && (
                        <div>
                            <span className={classes.sale_price}>
                                {detailData.salePrice.toLocaleString("vi-VN")}đ
                            </span>
                            <span className={classes.price}>
                                {detailData.price.toLocaleString("vi-VN")}đ
                            </span>
                            {detailData.price !== detailData.salePrice && (
                                <span className={classes.sale_percent}>
                                    -
                                    {(
                                        (1 - detailData.salePrice /detailData.price) *100
                                    ).toFixed(0)}
                                    %
                                </span>
                            )}
                        </div>
                    )}
                    <div className={classes.product_action}>
                        <div>
                        <Button label="Mua ngay" icon="pi pi-shopping-cart" />
                        </div>
                        <div>
                        <Button label="Thêm vào giỏ hàng" icon="pi pi-shopping-bag" />
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.product_down}></div>
        </div>
    );
}

export default ProductDetail;
