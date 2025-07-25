import { useEffect, useState } from 'react';
import './NewsList.scss';
import { NewsDetail } from '../../constants/interface';
import ApiService from '../../services/api.service';
import queryString from 'query-string';

const NewsList = () => {
    const [newsList, setNewsList] = useState<NewsDetail[]>([]);
    const params = {
        filter: '',
        status: 1
    }
    useEffect(() => {
        fetchNews();
    }, [])

    const fetchNews = async () => {
        try {
            const queryParams = queryString.stringify(params);
            const response = await ApiService.getNewsList(queryParams);
            setNewsList(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="main news-list-container">
            {newsList.length > 0 && (
                <div className="featured-news">
                    <h2 className="featured-title">{newsList[0].title}</h2>
                    {(newsList[0].coverImageUrl || newsList[0].thumbnailUrl) && (
                        <img
                            src={newsList[0].coverImageUrl || newsList[0].thumbnailUrl}
                            alt={newsList[0].title}
                            className="featured-image"
                        />
                    )}
                    <p className="featured-summary">{newsList[0].excerpt}</p>
                </div>
            )}
            <div className="news-list">
                {newsList.slice(1).map((news) => (
                    <div className="news-item" key={news.id}>
                        <h3 className="news-title">{news.title}</h3>
                        {(news.coverImageUrl || news.thumbnailUrl) && (
                            <img
                                src={news.coverImageUrl || news.thumbnailUrl}
                                alt={news.title}
                                className="news-image"
                            />
                        )}
                        <p className="news-summary">{news.excerpt}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NewsList;