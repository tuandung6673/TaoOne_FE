
import { Menubar } from 'primereact/menubar';
import { AllRouteType, ROLE } from '../../../constants/constants';

function AdminHeader () {
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
            icon: ''
        },
        {
            label: 'Phân loại',
            icon: '',
            items: [
                {
                    label: 'Loại',
                    url: ''
                },
                {
                    label: 'Loại chi tiết',
                    url: ''
                }
            ]
        }
    ];
    // const start = <h2>Quản trị</h2>;

    return (
        <>
            <div>
                <Menubar model={items}/>
            </div>
        </>
    )
}

export default AdminHeader