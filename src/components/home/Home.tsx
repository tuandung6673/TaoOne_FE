/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { json, useNavigate } from "react-router-dom";
import "swiper/css";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss/navigation";
import { Category } from "../../constants/interface";
import ApiService from "../../services/api.service";
import ProductItem from "../product-item/ProductItem";
import classes from "./Home.module.scss";
import { dummnyCategory } from "../../dummyDatas/dummyData";

function Home() {
    const [slides, setSlides] = useState<any>();
    const [category, setCategory] = useState<Category[]>([]);
    const navigate = useNavigate();

    const fetchSlides = async () => {
        try {
            const slideList = await ApiService.getSlide();
            setSlides(slideList.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        setCategory(dummnyCategory);
        fetchSlides();
    }, []);

    const handleAllCategory = (ctgName: string) => {
        navigate("/" + ctgName);
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.carousel}>
                <Carousel
                    autoPlay={true}
                    interval={10000}
                    infiniteLoop={true}
                    showIndicators={false}
                    showThumbs={false}
                    showStatus={false}
                >
                    {slides?.map((sl: any, index: any) => (
                        <div key={index} className={classes.slider}>
                            <img src={sl.img} alt={sl.name} />
                        </div>
                    ))}
                </Carousel>
            </div>
            <div className={classes.main}>
                <div className={classes.category}>
                    {category.map((ctg, index) => (
                        <div
                            key={index}
                            className={classes.category_item}
                            onClick={() => handleAllCategory(ctg.ctgName)}
                        >
                            <div className={classes.item_img}>
                                <img src={ctg.ctgImage} alt={ctg.ctgImage} />
                            </div>
                            <p className={classes.item_name}>{ctg.ctgName}</p>
                        </div>
                    ))}
                </div>
                <div>
                    {category.map((product, index) => (
                        <div key={index} className={classes.product_wrapper}>
                            <h2 style={{ textAlign: "center" }}>
                                {product.ctgName}
                            </h2>
                            <Swiper
                                spaceBetween={25}
                                slidesPerView={4}
                                modules={[
                                    Navigation,
                                    Pagination,
                                    Scrollbar,
                                    A11y,
                                ]}
                                // navigation
                            >
                                {product.listItems.map((item, index) => (
                                    <SwiperSlide
                                        key={index}
                                        className={classes.product}
                                    >
                                        <ProductItem productItem={item} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
