/* eslint-disable @typescript-eslint/no-unused-vars */
import queryString from "query-string";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss/navigation";
import { HomeInterface } from "../../constants/interface";
import ApiService from "../../services/api.service";
import ProductItem from "../product-item/ProductItem";
import classes from "./Home.module.scss";

function Home() {
    const [slides, setSlides] = useState<any>();
    const [category, setCategory] = useState<HomeInterface>();
    const navigate = useNavigate();
    const params = {
        screen: "home",
    };

    useEffect(() => {
        fetchSlides();
        fetchHome();
    }, []);

    const fetchSlides = async () => {
        try {
            const queryParams = queryString.stringify(params);
            const slideList = await ApiService.getSlideList(queryParams);
            setSlides(slideList.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchHome = async () => {
        try {
            const slideList = await ApiService.getHome();
            setCategory(slideList.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAllCategory = (ctgName: string) => {
        navigate("/" + ctgName);
    };

    return (
        <div className={classes.homeWrapper}>
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
                    {category?.categories.map((ctg : any, index : any) => (
                        <div
                            key={index}
                            className={classes.category_item}
                            onClick={() => handleAllCategory(ctg.code)}
                        >
                            <div className={classes.item_img}>
                                <img src={ctg.img} alt={ctg.name} />
                            </div>
                            <p className={classes.item_name}>{ctg.name}</p>
                        </div>
                    ))}
                    {/* <Swiper
                        spaceBetween={25}
                        breakpoints={{
                            1200: { slidesPerView: 4 }, // Từ 1200px trở lên, hiển thị 4 slides
                            768: { slidesPerView: 3 }, // Từ 768px trở lên, hiển thị 3 slides
                            576: { slidesPerView: 2 }, // Từ 576px trở lên, hiển thị 2 slides
                            0: { slidesPerView: 1 }, // Dưới 576px, hiển thị 1 slide
                        }}
                        modules={[Navigation, Pagination, Scrollbar, A11y]}
                    >
                        {category?.categories.map((ctg: any, index: any) => (
                            <SwiperSlide key={index}>
                                <div
                                    key={index}
                                    className={classes.category_item}
                                    onClick={() => handleAllCategory(ctg.code)}
                                >
                                    <div className={classes.item_img}>
                                        <img src={ctg.img} alt={ctg.name} />
                                    </div>
                                    <p className={classes.item_name}>{ctg.name}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper> */}
                </div>
                <div className={classes.categories}>
                    {category?.categories.map((product: any, index: any) => (
                        <div key={index} className={classes.product_wrapper}>
                            <h2 style={{ textAlign: "center" }}>
                                {product.name}
                            </h2>
                            <Swiper
                                breakpoints={{
                                    1200: { slidesPerView: 4, spaceBetween: 25 }, // Từ 1200px trở lên, hiển thị 4 slides
                                    768: { slidesPerView: 3, spaceBetween: 20 }, // Từ 768px trở lên, hiển thị 3 slides
                                    0: { slidesPerView: 2, spaceBetween: 15 }, // Dưới 576px, hiển thị 1 slide
                                }}
                                modules={[
                                    Navigation,
                                    Pagination,
                                    Scrollbar,
                                    A11y,
                                ]}
                                // navigation
                            >
                                {product.products.map(
                                    (item: any, index: any) => (
                                        <SwiperSlide
                                            key={index}
                                            className={classes.product}
                                        >
                                            <ProductItem
                                                productItem={item}
                                                categoryCode={product.code}
                                            />
                                        </SwiperSlide>
                                    )
                                )}
                            </Swiper>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
