import { Outlet } from "react-router"
import AdminHeader from "../../components/Header/admin-header/AdminHeader"

function AdminLayout() {
    return (
        <div>
            <AdminHeader></AdminHeader>
            <Outlet></Outlet>
        </div>
    )
}

export default AdminLayout