import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useParams } from "react-router-dom";
import { bannerDetail, dummnyCategory } from "../../dummyDatas/dummyData";
import classes from "./AllCategory.module.scss";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { BannerDetail } from "../../constants/interface";
import ProductItem from "../product-item/ProductItem";
import queryString from 'query-string';
import ApiService from "../../services/api.service";


function AllCategory() {
    const [banner, setBanner] = useState<BannerDetail[]>([]);
    const [category, setCategory] = useState<any>();
    const { categoryName } = useParams();
    const params = {
        screen: 'category',
    }


    useEffect(() => {
        fetchSlides();
        // setCategory(dummnyCategory);
    }, []);

    const fetchSlides = async () => {
        try {
            const queryParams = queryString.stringify(params)
            const slideList = await ApiService.getSlide(queryParams);
            setBanner(slideList.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={classes.main}>
            <h1>{categoryName}</h1>
            <div className={classes.carousel_custom}>
                <Carousel
                    autoPlay={true}
                    interval={10000}
                    infiniteLoop={true}
                    showIndicators={false}
                    showThumbs={false}
                    showStatus={false}
                >
                    {banner.map((sl, index) => (
                        <div key={index} className={classes.slider}>
                            <img src={sl.img} alt={sl.name} />
                        </div>
                    ))}
                </Carousel>
            </div>
            <div className={classes.filter}>Lọc theo các Series</div>
            <div className={classes.sort}>Xếp theo</div>
            {/* <div className={classes.category_wrapper}>
                {category.map(
                    (category: any) =>
                        category.ctgName === categoryName && (
                            <div key={category.ctgName}>
                                <div className={classes.category_item}>
                                    {category.listItems.map((item: any) => (
                                        <div>
                                            <ProductItem productItem={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                )}
            </div> */}
        </div>
    );
}

export default AllCategory;
