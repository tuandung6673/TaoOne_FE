import { useLocation } from 'react-router-dom';

function AllCategory() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('ord');
    console.log(queryParams)

    return (
        <div>
            {category}
        </div>
    )
}

export default AllCategory;