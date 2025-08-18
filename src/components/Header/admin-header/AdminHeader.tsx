import './AdminHeader.scss';

import { Menubar } from 'primereact/menubar';
import { AllRouteType, ROLE } from '../../../constants/constants';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function AdminHeader() {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    }

    return (
        <>
            <div className='header-admin'>
                <div className='menu-admin'>
                    <Menubar model={items} />
                </div>
                <div className='login-admin'>
                    {username && (
                        <span className='username-display'>Xin chào, {username}</span>
                    )}
                    <Button label='Đăng xuất' onClick={() => handleLogout()} />
                </div>
            </div>
        </>
    )
}

export default AdminHeader