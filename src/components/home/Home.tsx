/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { dummnyCategory, dummySlider } from "../../dummyDatas/dummyData";
import classes from "./Home.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/scss/navigation";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import ProductItem from "../product-item/ProductItem";
import { Category, Image } from "../../constants/interface";

function Home() {
    const [slide, setSlide] = useState<Image[]>([]);
    const [category, setCategory] = useState<Category[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Chuyển đổi mỗi đối tượng từ dummySilder sang cấu trúc Image
        const formattedSlide: Image[] = dummySlider.map((sl, index) => ({
            img: sl.img,
            name: sl.name,
        }));
        setSlide(formattedSlide);
        setCategory(dummnyCategory);
    }, []);

    const handleAllCategory = (ctgName : string) => {
        navigate('/' + ctgName)
    }

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
                    {slide.map((sl, index) => (
                        <div key={index} className={classes.slider}>
                            <img src={sl.img} alt={sl.name} />
                        </div>
                    ))}
                </Carousel>
            </div>
            <div className={classes.main}>
                <div className={classes.category}>
                    {category.map((ctg, index) => (
                        <div key={index} className={classes.category_item} onClick={() => handleAllCategory(ctg.ctgName)}>
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
