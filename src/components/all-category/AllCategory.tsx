import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { bannerDetail, dummnyCategory } from "../../dummyDatas/dummyData";
import classes from "./AllCategory.module.scss";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import ProductItem from "../product-item/ProductItem";

interface BannerDetail {
    image: string;
    name: string;
}

interface CategoryItem {
    name: string;
    image: string;
    price: number;
    salePrice: number;
}
interface Category {
    ctgName: string;
    ctgImage: string;
    listItems: CategoryItem[];
}

function AllCategory() {
    const [banner, setBanner] = useState<BannerDetail[]>([]);
    const [category, setCategory] = useState<Category[]>([]);
    const {categoryName} = useParams();
    
    useEffect(() => {
        setBanner(bannerDetail);
        setCategory(dummnyCategory);
    }, []);
    
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
                            <img src={sl.image} alt={sl.name} />
                        </div>
                    ))}
                </Carousel>
            </div>
            <div className={classes.filter}>Lọc theo các Series</div>
            <div className={classes.sort}>Xếp theo</div>
            <div className={classes.category_wrapper}>
                {category.map((category) => (
                    category.ctgName === categoryName && <div key={category.ctgName}>
                        <div className={classes.category_item}>
                            {category.listItems.map((item) => (
                                <div>
                                    <ProductItem productItem={item} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllCategory;
