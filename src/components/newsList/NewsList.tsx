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
        <div className="main">

        </div>
    )
}

export default NewsList;