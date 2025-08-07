import moment from "moment";
import { BreadCrumb } from 'primereact/breadcrumb';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { NewsDetail } from '../../../constants/interface';
import ApiService from '../../../services/api.service';
import './UserNewsDetail.scss';

const UserNewsDetail = () => {
    const navigate = useNavigate();
    const [tocItems, setTocItems] = useState<any[]>([]);
    const [newsDetail, setNewsDetail] = useState<NewsDetail>();
    const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([
        { label: "Tin tức", url: "/news" }
    ]);
    const { newsSlug } = useParams();
    const home = { icon: "pi pi-home", url: "/" };
    const newsDetailParams = {
        id: null,
        slug: newsSlug || ""
    }
    const [relatedNews, setRelatedNews] = useState<NewsDetail[]>([]);
    const relatedNewsParams = {
        currentNews: newsSlug
    };

    useEffect(() => {
        if (newsSlug) {
            fetchDetailNews();
            fetchRelatedNews();
        }
    }, [newsSlug]);

    useEffect(() => {
        // Tạo một DOM tạm để parse contentHtml
        const parser = new DOMParser();
        const doc = parser.parseFromString(newsDetail?.contentHtml!, "text/html");

        const headers = doc.querySelectorAll("h2, h3");
        const items: any[] = [];

        headers.forEach((header, index) => {
            // Tạo id cho từng heading nếu chưa có
            if (!header.id) {
                header.id = `heading-${index}`;
            }

            items.push({
                id: header.id,
                text: header.textContent,
                level: header.tagName, // h2 hoặc h3
            });
        });
        setTocItems(items);
    }, [newsDetail?.contentHtml]);

    const fetchDetailNews = async () => {
        const params = queryString.stringify(newsDetailParams);
        const response = await ApiService.getNewsDetail(params);
        setNewsDetail(response.data);
        setBreadcrumbItems([
            { label: "Tin tức", url: "/news" },
            { label: response.data?.title || "" }
        ]);
    }

    const fetchRelatedNews = async () => {
        const params = queryString.stringify(relatedNewsParams);
        const response = await ApiService.getNewsRelated(params);
        setRelatedNews(response.data.data);
    }

    const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const headerHeight = 140; // Fixed header height
            const targetPosition = targetElement.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    return (
        <div className="main">
            <div className='header w-full'>
                <BreadCrumb
                    model={breadcrumbItems}
                    home={home}
                ></BreadCrumb>
            </div>
            <div className='news-detail'>
                <div className='news-left'>
                    <p className='news-title'>{newsDetail?.title}</p>
                    <div className='news-time'>
                        <span>TaoOne Team - </span><span>{moment(newsDetail?.publishedAt).format("DD/MM/YYYY")}</span>
                    </div>
                    <b className='news-excerpt' dangerouslySetInnerHTML={{ __html: newsDetail?.excerpt! }}>
                    </b>
                    {tocItems.length > 0 && <nav className="toc">
                        <div className='toc-title'>Mục lục</div>
                        <div className='toc-list'>
                            {tocItems.map((item) => (
                                <div key={item.id} className={item.level.toLowerCase() + " toc-item"}>
                                    <a href={`#${item.id}`} onClick={(e) => handleTocClick(e, item.id)}>{item.text}</a>
                                </div>
                            ))}
                        </div>
                    </nav>}
                    <div className='news-image w-full'>
                        <img src={newsDetail?.thumbnailUrl} alt={newsDetail?.title} />
                    </div>
                    <div className='news-content'>
                        <div className='news-content-body' dangerouslySetInnerHTML={{ __html: newsDetail?.contentHtml! }}>

                        </div>
                    </div>
                </div>
                <div className='news-right'>
                    <div className='news-related-title'>Bài viết liên quan</div>
                    <div className='news-related'>
                        {relatedNews.map((item) => (
                            <div className='news-related-item' key={item.id} onClick={() => navigate(`/news/${item.slug}`)}>
                                <img src={item.thumbnailUrl} alt={item.title} />
                                <p className='news-related-item-title'>{item.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserNewsDetail;