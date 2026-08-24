import moment from "moment";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { useCallback, useEffect, useState } from "react";
import { OrderProductItem, PaymentForm } from "../../constants/interface";
import ApiService from "../../services/api.service";
import "./PurchaseHistory.scss";

const ORDER_STATUS_LABELS: Record<number, string> = {
    0: "Khởi tạo",
    1: "Đã xác nhận",
    2: "Hoàn thành",
    3: "Trả lại",
    4: "Hủy",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
    "0": "Chuyển khoản ngân hàng",
    "1": "Kiểm tra thanh toán",
    "2": "Trả tiền mặt khi nhận hàng",
    bankTransfer: "Chuyển khoản ngân hàng",
    checkPayment: "Kiểm tra thanh toán",
    cashPayment: "Trả tiền mặt khi nhận hàng",
};

const PAGE_SIZE = 10;

const formatNumber = (number: number) => new Intl.NumberFormat("vi-VN").format(number);

function PurchaseHistory() {
    const [orders, setOrders] = useState<PaymentForm[]>([]);
    const [recordsTotal, setRecordsTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [first, setFirst] = useState(0);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await ApiService.getOrderHistory(`offSet=${first}&pageSize=${PAGE_SIZE}`);
            const data = res?.data?.data ?? res?.data ?? res ?? [];
            setOrders(Array.isArray(data) ? data : []);
            setRecordsTotal(res?.data?.recordsTotal ?? 0);
        } catch (error) {
            console.error(error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [first]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
    };

    if (!loading && orders.length === 0) {
        return (
            <div className="account-placeholder">
                <i className="pi pi-shopping-bag"></i>
                <h2>Chưa có đơn hàng nào</h2>
                <p>Đơn hàng bạn đặt khi đã đăng nhập sẽ hiển thị tại đây.</p>
            </div>
        );
    }

    return (
        <div className="purchase-history">
            <h2>Lịch sử mua hàng</h2>

            {loading ? (
                <p className="purchase-history-loading">Đang tải...</p>
            ) : (
                <div className="purchase-history-list">
                    {orders.map((order) => (
                        <div className="purchase-history-item" key={order.id}>
                            <div className="purchase-history-item-header">
                                <span className="purchase-history-item-id">Đơn #{order.id}</span>
                                <span
                                    className={`purchase-history-status purchase-history-status-${order.status ?? 0}`}
                                >
                                    {ORDER_STATUS_LABELS[order.status ?? 0] || "Không xác định"}
                                </span>
                            </div>
                            <div className="purchase-history-item-body">
                                {(order.products || []).map((item: OrderProductItem, index) => (
                                    <div className="purchase-history-product" key={item.product_id + (item.size || "") + index}>
                                        <span>
                                            {item.product_name}
                                            {item.size ? ` - ${item.size}` : ""} x{item.quantity}
                                        </span>
                                        <span>{formatNumber(item.salePrice * item.quantity)}đ</span>
                                    </div>
                                ))}
                            </div>
                            <div className="purchase-history-item-footer">
                                <span>{order.date ? moment(order.date).format("DD/MM/YYYY HH:mm") : ""}</span>
                                <span>
                                    {PAYMENT_METHOD_LABELS[String(order.payment_method)] || order.payment_method}
                                </span>
                                <span className="purchase-history-total">
                                    {formatNumber(order.total_bill || 0)}đ
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {recordsTotal > PAGE_SIZE && (
                <Paginator
                    first={first}
                    rows={PAGE_SIZE}
                    totalRecords={recordsTotal}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}

export default PurchaseHistory;
