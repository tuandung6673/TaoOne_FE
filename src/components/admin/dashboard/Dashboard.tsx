import { addLocale } from "primereact/api";
import { Calendar } from "primereact/calendar";
import queryString from "query-string";
import { useCallback, useEffect, useMemo, useState } from "react";
import ApiService from "../../../services/api.service";
import "./Dashboard.scss";
import TrendPieChart, { TrendItem } from "./TrendPieChart";

addLocale("vi", {
    monthNames: [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ],
    monthNamesShort: [
        "Th1", "Th2", "Th3", "Th4", "Th5", "Th6",
        "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"
    ],
    dayNames: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
    dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    dayNamesMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    today: "Hôm nay",
    clear: "Xóa"
});

const formatDateParam = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const lastDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

// Dự án bắt đầu bán hàng thực tế từ tháng 4/2024 — không có dữ liệu trước mốc này.
const PROJECT_START_MONTH = new Date(2024, 3, 1);

interface TrendDashboardData {
    productLine: TrendItem[];
    size: TrendItem[];
    color: TrendItem[];
    material: TrendItem[];
}

const EMPTY_TREND: TrendDashboardData = {
    productLine: [],
    size: [],
    color: [],
    material: []
};

interface StatsData {
    orderCount: number;
    revenue: number;
    newsCount: number;
    adviseCount: number;
}

const EMPTY_STATS: StatsData = {
    orderCount: 0,
    revenue: 0,
    newsCount: 0,
    adviseCount: 0
};

const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

function Dashboard() {
    const [trend, setTrend] = useState<TrendDashboardData>(EMPTY_TREND);
    const [loadingTrend, setLoadingTrend] = useState(false);
    const [stats, setStats] = useState<StatsData>(EMPTY_STATS);
    const [loadingStats, setLoadingStats] = useState(false);
    const [showRevenue, setShowRevenue] = useState(false);
    const now = new Date();
    const [fromMonth, setFromMonth] = useState<Date>(PROJECT_START_MONTH);
    const [toMonth, setToMonth] = useState<Date>(now);

    const statCards = useMemo(() => [
        { key: "order", label: "Đơn hàng", value: String(stats.orderCount), icon: "pi pi-shopping-cart" },
        {
            key: "revenue",
            label: "Doanh thu",
            value: showRevenue ? formatCurrency(stats.revenue) : "••••••••",
            icon: "pi pi-wallet"
        },
        { key: "news", label: "Tin tức", value: String(stats.newsCount), icon: "pi pi-book" },
        { key: "advise", label: "Tư vấn", value: String(stats.adviseCount), icon: "pi pi-comments" }
    ], [stats, showRevenue]);

    const toggleShowRevenue = useCallback(() => {
        setShowRevenue((prev) => !prev);
    }, []);

    useEffect(() => {
        const queryParams = queryString.stringify({
            fromDate: formatDateParam(firstDayOfMonth(fromMonth)),
            toDate: formatDateParam(lastDayOfMonth(toMonth))
        });

        const fetchTrend = async () => {
            setLoadingTrend(true);
            try {
                const res = await ApiService.getTrendDashboard(queryParams);
                setTrend(res?.data ?? EMPTY_TREND);
            } catch (err) {
                setTrend(EMPTY_TREND);
            } finally {
                setLoadingTrend(false);
            }
        };

        const fetchStats = async () => {
            setLoadingStats(true);
            try {
                const res = await ApiService.getStats(queryParams);
                setStats(res?.data ?? EMPTY_STATS);
            } catch (err) {
                setStats(EMPTY_STATS);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchTrend();
        fetchStats();
    }, [fromMonth, toMonth]);

    return (
        <div className="wrapper dashboard-admin">
            <div className="header">
                {/* <BreadCrumb model={breadcrumbItems} home={home} /> */}
                {/* <div className="grid">
                    <div className="col-6 header-left flex">
                        <div className="empty"></div>
                        <div className="main-title flex align-items-center ml-2">Dashboard</div>
                    </div>
                </div> */}
            </div>

            <div className="dashboard-filter-bar flex align-items-center flex-wrap gap-4">
                <div className="dashboard-filter-heading flex align-items-center">
                    <i className="pi pi-calendar"></i>
                    <span>Khoảng thời gian</span>
                </div>
                <div className="dashboard-filter-field">
                    <label className="dashboard-filter-label">Từ tháng</label>
                    <Calendar
                        value={fromMonth}
                        onChange={(e) => e.value && setFromMonth(e.value as Date)}
                        view="month"
                        dateFormat="MM/yy"
                        locale="vi"
                        minDate={PROJECT_START_MONTH}
                        maxDate={toMonth}
                        showIcon
                    />
                </div>
                <i className="pi pi-arrow-right dashboard-filter-arrow"></i>
                <div className="dashboard-filter-field">
                    <label className="dashboard-filter-label">Đến tháng</label>
                    <Calendar
                        value={toMonth}
                        onChange={(e) => e.value && setToMonth(e.value as Date)}
                        view="month"
                        dateFormat="MM/yy"
                        locale="vi"
                        minDate={fromMonth < PROJECT_START_MONTH ? PROJECT_START_MONTH : fromMonth}
                        showIcon
                    />
                </div>
            </div>

            <div className="card">
                {loadingStats ? (
                    <div className="dashboard-loading">Đang tải dữ liệu...</div>
                ) : (
                    <div className="grid">
                        {statCards.map((stat) => (
                            <div className="col-12 md:col-3" key={stat.key}>
                                <div className="dashboard-stat-card flex align-items-center">
                                    <i className={`${stat.icon} dashboard-stat-icon`}></i>
                                    <div className="ml-3 flex-1">
                                        <div className="dashboard-stat-value flex align-items-center">
                                            <span>{stat.value}</span>
                                            {stat.key === "revenue" && (
                                                <i
                                                    className={`pi ${showRevenue ? "pi-eye-slash" : "pi-eye"} dashboard-stat-eye`}
                                                    onClick={toggleShowRevenue}
                                                ></i>
                                            )}
                                        </div>
                                        <div className="dashboard-stat-label">{stat.label}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="card">
                {loadingTrend ? (
                    <div className="dashboard-loading">Đang tải dữ liệu...</div>
                ) : (
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <TrendPieChart title="Dòng sản phẩm" data={trend.productLine} />
                        </div>
                        <div className="col-12 md:col-6">
                            <TrendPieChart title="Kích thước" data={trend.size} />
                        </div>
                        <div className="col-12 md:col-6">
                            <TrendPieChart title="Màu sắc" data={trend.color} />
                        </div>
                        <div className="col-12 md:col-6">
                            <TrendPieChart title="Chất liệu" data={trend.material} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
