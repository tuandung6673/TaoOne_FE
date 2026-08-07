import he from 'he';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import queryString from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewsDetail } from '../../constants/interface';
import ApiService from '../../services/api.service';
import './NewsList.scss';

const stripHtmlAndDecode = (html: string) => {
    // Bỏ thẻ HTML
    const stripped = html.replace(/<\/?[^>]+(>|$)/g, '');
    // Decode HTML entities
    return he.decode(stripped);
};

const NewsList = () => {
    const navigate = useNavigate();
    const [newsList, setNewsList] = useState<NewsDetail[]>([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [recordsTotal, setRecordsTotal] = useState(0);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const queryParams = queryString.stringify({
                    filter: '',
                    status: 1,
                    offSet: first,
                    pageSize: rows,
                });
                const response = await ApiService.getNewsList(queryParams);
                setRecordsTotal(response.data.recordsTotal);
                setNewsList(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchNews();
    }, [first, rows]);

    const onPageChange = useCallback((event: PaginatorPageChangeEvent) => {
        setRows(event.rows);
        setFirst(event.first);

        // Scroll to top of page when page changes
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const handleNewsClick = useCallback((slug: string) => {
        navigate(`/news/${slug}`);
    }, [navigate]);

    return (
        <div className="main news-list-container">
            {newsList.length > 0 && (
                <div className="featured-news" onClick={() => handleNewsClick(newsList[0].slug)}>
                    <h2 className="featured-title">{newsList[0].title}</h2>
                    {(newsList[0].coverImageUrl || newsList[0].thumbnailUrl) && (
                        <img
                            src={newsList[0].coverImageUrl || newsList[0].thumbnailUrl}
                            alt={newsList[0].title}
                            className="featured-image"
                        />
                    )}
                    <p className="featured-summary">{stripHtmlAndDecode(newsList[0].excerpt)}</p>
                </div>
            )}
            <div className="news-list">
                {newsList.slice(1).map((news) => (
                    <div className="news-item" key={news.id} onClick={() => handleNewsClick(news.slug)}>
                        <h3 className="news-title">{news.title}</h3>
                        {(news.coverImageUrl || news.thumbnailUrl) && (
                            <img
                                src={news.coverImageUrl || news.thumbnailUrl}
                                alt={news.title}
                                className="news-image"
                            />
                        )}
                        <p className="news-summary">{stripHtmlAndDecode(news.excerpt)}</p>
                    </div>
                ))}
            </div>
            <div className='paginator-container'>
                <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={recordsTotal}
                    rowsPerPageOptions={[10, 20, 30]}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    )
}

export default NewsList;
