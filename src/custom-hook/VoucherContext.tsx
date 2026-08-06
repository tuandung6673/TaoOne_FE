import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { CheckApplyVoucherResult } from "../constants/interface";
import ApiService from "../services/api.service";
import { useCart } from "./CartContext";

interface ApplyVoucherOutcome {
    valid: boolean;
    message: string;
}

interface VoucherContextType {
    appliedCode: string;
    result: CheckApplyVoucherResult | null;
    loading: boolean;
    error: string;
    applyVoucher: (code: string, phone?: string) => Promise<ApplyVoucherOutcome>;
    clearVoucher: () => void;
    discountAmount: number;
}

const VoucherContext = createContext<VoucherContextType | undefined>(undefined);

export const VoucherProvider = ({ children }: { children: ReactNode }) => {
    const { cartItems } = useCart();
    const [appliedCode, setAppliedCode] = useState("");
    const [result, setResult] = useState<CheckApplyVoucherResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const cartItemsRef = useRef(cartItems);
    cartItemsRef.current = cartItems;

    const applyVoucher = async (code: string, phone?: string): Promise<ApplyVoucherOutcome> => {
        const trimmedCode = code.trim();
        if (!trimmedCode) {
            const message = "Vui lòng nhập mã giảm giá";
            setError(message);
            return { valid: false, message };
        }

        setLoading(true);
        setError("");
        try {
            const cart = cartItemsRef.current.map((item) => ({
                product_id: item.id,
                price: item.salePrice,
                quantity: item.quantity
            }));
            const res = await ApiService.checkApplyVoucher({
                code: trimmedCode,
                phone: phone ?? null,
                cart
            });
            const data: CheckApplyVoucherResult = res?.Data ?? res?.data ?? res;

            if (data?.valid) {
                setAppliedCode(trimmedCode);
                setResult(data);
                setError("");
                return { valid: true, message: data.message || "" };
            } else {
                setResult(null);
                setAppliedCode("");
                const message = data?.message || "Mã giảm giá không hợp lệ";
                setError(message);
                return { valid: false, message };
            }
        } catch (err: any) {
            setResult(null);
            setAppliedCode("");
            const message = err?.response?.data?.message || "Không thể áp dụng mã giảm giá. Vui lòng thử lại.";
            setError(message);
            return { valid: false, message };
        } finally {
            setLoading(false);
        }
    };

    const clearVoucher = () => {
        setAppliedCode("");
        setResult(null);
        setError("");
    };

    // Giỏ hàng thay đổi (thêm/bớt/đổi số lượng) khi đang có mã áp dụng -> re-check.
    useEffect(() => {
        if (appliedCode) {
            applyVoucher(appliedCode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartItems]);

    return (
        <VoucherContext.Provider
            value={{
                appliedCode,
                result,
                loading,
                error,
                applyVoucher,
                clearVoucher,
                discountAmount: result?.valid ? result.discount_amount || 0 : 0
            }}
        >
            {children}
        </VoucherContext.Provider>
    );
};

export const useVoucher = () => {
    const context = useContext(VoucherContext);
    if (context === undefined) {
        throw new Error("useVoucher must be used within a VoucherProvider");
    }
    return context;
};
