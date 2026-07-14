import { BreadCrumb } from "primereact/breadcrumb";
import "./Dashboard.scss";

function Dashboard() {
    const home = { icon: "pi pi-home", url: "" };
    const breadcrumbItems = [{ label: "Dashboard" }];

    const stats = [
        { label: "Đơn hàng", value: "0", icon: "pi pi-shopping-cart" },
        { label: "Sản phẩm", value: "0", icon: "pi pi-box" },
        { label: "Tin tức", value: "0", icon: "pi pi-book" },
        { label: "Tư vấn", value: "0", icon: "pi pi-comments" }
    ];

    return (
        <div className="wrapper dashboard-admin">
            <div className="header">
                <BreadCrumb model={breadcrumbItems} home={home} />
                <div className="grid">
                    <div className="col-6 header-left flex">
                        <div className="empty"></div>
                        <div className="main-title flex align-items-center ml-2">Dashboard</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="grid">
                    {stats.map((stat) => (
                        <div className="col-12 md:col-3" key={stat.label}>
                            <div className="dashboard-stat-card flex align-items-center">
                                <i className={`${stat.icon} dashboard-stat-icon`}></i>
                                <div className="ml-3">
                                    <div className="dashboard-stat-value">{stat.value}</div>
                                    <div className="dashboard-stat-label">{stat.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
