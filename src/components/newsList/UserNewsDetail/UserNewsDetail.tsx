import { BreadCrumb } from 'primereact/breadcrumb';
import './UserNewsDetail.scss';
import ApiService from '../../../services/api.service';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import queryString from 'query-string';
import { NewsDetail } from '../../../constants/interface';

const UserNewsDetail = () => {
    const navigate = useNavigate();
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
                        <span>TaoOne Team - </span><span>{newsDetail?.publishedAt}</span>
                    </div>
                    <div className='news-excerpt'>
                        <p>{newsDetail?.excerpt}</p>
                    </div>
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