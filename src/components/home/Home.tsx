import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { dummnyCategory, dummySlider } from "../../dummyDatas/dummyData";
import classes from "./Home.module.scss";
interface Slider {
    img: string;
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

function Home() {
    const [slide, setSlide] = useState<Slider[]>([]);
    const [category, setCategory] = useState<Category[]>([]);

    useEffect(() => {
        // Chuyển đổi mỗi đối tượng từ dummySilder sang cấu trúc Slider
        const formattedSlide: Slider[] = dummySlider.map((sl, index) => ({
            img: sl.img,
            name: sl.name,
        }));
        setSlide(formattedSlide);
        setCategory(dummnyCategory);
    }, []);

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
                        <div key={index} className={classes.category_item}>
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
                            <h2 style={{textAlign: 'center'}}>{product.ctgName}</h2>
                            <div className={classes.product_list}>
                                {product.listItems.map((item, index) => (
                                    <div key={index} className={classes.product}>
                                        {/* {(item.price !== item.salePrice) && <span className={classes.discount_percent}>SALE</span>} */}
                                        <div className={classes.product_img}>
                                            <img src={item.image} alt={item.name}/>
                                        </div>
                                        <p className={classes.product_name}>{item.name}</p>
                                        <p className={classes.product_price}>{item.salePrice.toLocaleString('vi-VN')}đ</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
