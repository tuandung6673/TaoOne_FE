import { BreadCrumb } from 'primereact/breadcrumb';
import './UserNewsDetail.scss';
import ApiService from '../../../services/api.service';
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import queryString from 'query-string';
import { NewsDetail } from '../../../constants/interface';

const UserNewsDetail = () => {
    const [newsDetail, setNewsDetail] = useState<NewsDetail>();
    const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([
        { label: "Tin tức", url: "/news" }
    ]);
    const {newsSlug} = useParams();
    const home = { icon: "pi pi-home", url: "/" };
    const newsDetailParams = {
        id: null,
        slug: newsSlug || ""
    }

    useEffect(() => {
        if (newsSlug) {
            fetchDetailNews();
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

    return (
        <div className="main">
            <div className='header mb-3 w-full'>
                <BreadCrumb
                    model={breadcrumbItems}
                    home={home}
                ></BreadCrumb>
            </div>
            <div className='news-detail'>
                <div className='news-left'>
                    <h2>{newsDetail?.title}</h2>
                    <div className='news-time'>
                        <span>TaoOne Team - </span><span>{newsDetail?.publishedAt}</span>
                    </div>
                    <div className='news-image w-full'>
                        <img src={newsDetail?.thumbnailUrl} alt={newsDetail?.title} />
                    </div>
                    <div className='news-excerpt'>
                        <p>{newsDetail?.excerpt}</p>
                    </div>
                    <div className='news-content'>
                        <div className='news-content-body' dangerouslySetInnerHTML={{ __html: newsDetail?.contentHtml! }}>
                            
                        </div>
                    </div>
                </div>
                <div className='news-right'>B</div>
            </div>
        </div>
    );
}

export default UserNewsDetail;