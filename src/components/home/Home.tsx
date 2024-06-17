/* eslint-disable @typescript-eslint/no-unused-vars */
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
import queryString from 'query-string';

function Home() {
    const [slides, setSlides] = useState<any>();
    const [category, setCategory] = useState<HomeInterface>();
    const navigate = useNavigate();
    const params = {
        screen: 'home',
    }

    useEffect(() => {
        fetchSlides();
        fetchHome();
    }, []);

    const fetchSlides = async () => {
        try {
            const queryParams = queryString.stringify(params)
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
                </div>
                <div>
                    {category?.categories.map((product : any, index : any) => (
                        <div key={index} className={classes.product_wrapper}>
                            <h2 style={{ textAlign: "center" }}>
                                {product.name}
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
                                {product.products.map((item : any, index : any) => (
                                    <SwiperSlide
                                        key={index}
                                        className={classes.product}
                                    >
                                        <ProductItem productItem={item} categoryCode={product.code}/>
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
