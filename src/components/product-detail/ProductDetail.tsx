import { BreadCrumb } from 'primereact/breadcrumb';
import classes from './ProductDetail.module.scss'
import { AllRouteType } from '../../constants/constants';
import { useEffect } from 'react';
import { useParams } from "react-router-dom"
function ProductDetail() {
    const {categoryName, itemId} = useParams();
    let items = [
        {label: 'Apple Watch', name: AllRouteType.watch, visible: false, url: '/' + AllRouteType.watch},
        {label: 'iPad', name: AllRouteType.ipad, visible: false, url: '/' + AllRouteType.ipad,},
        {label: 'Macbook', name: AllRouteType.macbook, visible: false, url: '/' + AllRouteType.macbook},
        {label: 'Airpod', name: AllRouteType.airpod, visible: false, url: '/' + AllRouteType.airpod},
        {label: 'Phụ kiện', name: AllRouteType.accessories, visible: false, url: '/' + AllRouteType.accessories},
    ]
    const home = { icon: 'pi pi-home', url: '/'}

    useEffect(() => {
        breadcrumbHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const breadcrumbHandler = () => {
        items.forEach((item) => {
            if(item.name === categoryName) {
                item.visible = true;
            }
        })
    }

    return (
        <div className={classes.main}>
            <BreadCrumb model={items} home={home} />
        </div>
    )
}

export default ProductDetail