import './AdminHeader.scss';

import { Menubar } from 'primereact/menubar';
import { AllRouteType, ROLE } from '../../../constants/constants';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
function AdminHeader() {
    const navigate = useNavigate();
    const items = [
        {
            label: 'Sản phẩm',
            icon: '',
            items: [
                {
                    label: 'Apple Watch',
                    url: ROLE.admin + '/' + AllRouteType.watch
                },
                {
                    label: 'iPad',
                    url: ROLE.admin + '/' + AllRouteType.ipad
                },
                {
                    label: 'Macbook',
                    url: ROLE.admin + '/' + AllRouteType.macbook
                },
                {
                    label: 'Airpods',
                    url: ROLE.admin + '/' + AllRouteType.airpods
                },
                {
                    label: 'Phụ kiện',
                    url: ROLE.admin + '/' + AllRouteType.accessories
                }
            ]
        },
        {
            label: 'Banner',
            icon: '',
            url: ROLE.admin + '/' + AllRouteType.banner
        },
        {
            label: 'Phân loại',
            icon: '',
            items: [
                {
                    label: 'Loại',
                    url: ROLE.admin + '/category'
                },
                // {
                //     label: 'Loại chi tiết',
                //     // url: ROLE.admin + '/category-detail'
                // }
            ]
        },
        {
            label: 'Đơn hàng',
            icon: '',
            url: ROLE.admin + '/order'
        },
        {
            label: 'Tin tức',
            icon: '',
            url: ROLE.admin + '/' + AllRouteType.news
        }
    ];

    const handleLogin = () => {
        navigate('/login');
        localStorage.removeItem('token');
    }

    return (
        <>
            <div className='header-admin'>
                <div className='menu-admin'>
                    <Menubar model={items} />
                </div>
                <div className='login-admin'>
                    <Button label='Đăng nhập' onClick={() => handleLogin()} />
                </div>
            </div>
        </>
    )
}

export default AdminHeader