/* eslint-disable @typescript-eslint/no-unused-vars */
import { Address, AdviseForm, ChangePasswordForm, CheckApplyVoucherRequest, Login, PaymentForm, ProductCommentForm, Register } from "../constants/interface";
import axiosInstance from "./api.interceptor";

const ApiService = {
    // Home
    getHome: async () => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/Home/GetHome`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    // Slide
    getSlideList: async (queryParams: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/Slide/GetSlideList?` + queryParams
            );
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    getSlideDetail: async (id: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/Slide/GetSlideDetail?id=` + id
            );
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    postSlide: async (data: any) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/Slide/PostSlide`,
                data
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    deleteSlide: async (id: string) => {
        try {
            const response = await axiosInstance.delete(
                `${process.env.REACT_APP_BASE_URL}/Slide/DeteleSlide?id=` + id
            );
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    // Product
    getProductSearch: async (queryParams: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/Product/GetProductSearch?` + queryParams
            );
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    getProductList: async (queryParams: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/Product/GetProductList?` + queryParams
            );
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    getProductDetail: async (id: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/Product/GetProductDetail?id=` + id
            );
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    postProduct: async (data: any) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/Product/PostProduct`,
                data
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    deleteProduct: async (id: string) => {
        try {
            const response = await axiosInstance.delete(
                `${process.env.REACT_APP_BASE_URL}/Product/DeleteProduct?id=` + id
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    // Category
    getCategoryList: async (queryParams: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/Category/GetCategoryList?` + queryParams
            );
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    getCategoryDetail: async (id: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/Category/GetCategoryDetail?id=` + id
            );
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    postCategory: async (data: any) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/Category/PostCategory`,
                data
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    deleteCategory: async (id: string) => {
        try {
            const response = await axiosInstance.delete(
                `${process.env.REACT_APP_BASE_URL}/Category/DeleteCategory?id=` + id
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    // Category-detail
    getCategoryDetailList: async (queryParams: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/CategoryDetail/GetCategoryDetailList?` +
                queryParams
            );
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    getCategoryDetailDetail: async (id: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/CategoryDetail/GetCategoryDetailDetail?id=` +
                id
            );
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    postCategoryDetail: async (data: any) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/CategoryDetail/PostCategoryDetail`,
                data
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    deleteCategoryDetail: async (id: string) => {
        try {
            const response = await axiosInstance.delete(
                `${process.env.REACT_APP_BASE_URL}/CategoryDetail/DeleteCategoryDetail?id=` +
                id
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    // Payment
    getPaymentList: async (queryParams: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/Payment/GetPaymentList?` + queryParams
            );
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    postPayment: async (data: PaymentForm) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/Payment/PostPayment`,
                data
            );
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    updatePaymentStatus: async (data: any) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/Payment/UpdatePaymentStatus`,
                data
            );
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    deletePayment: async (id: string) => {
        try {
            const response = await axiosInstance.delete(
                `${process.env.REACT_APP_BASE_URL}/Payment/DeletePayment?id=` + id
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    // Advise
    getAdviseList: async (queryParams: string = "") => {
        try {
            const url = queryParams
                ? `${process.env.REACT_APP_BASE_URL}/Advise/GetAdviseList?${queryParams}`
                : `${process.env.REACT_APP_BASE_URL}/Advise/GetAdviseList`;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching advise list:", error);
            throw error;
        }
    },

    postAdvise: async (data: AdviseForm) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/Advise/PostAdvise`,
                data
            );
            return response.data;
        } catch (error) {
            console.error("Error posting advise:", error);
            throw error;
        }
    },

    // login
    postLogin: async (data: Login) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/Login/PostLogin`,
                data
            );
            return response.data;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    },

    postRegister: async (data: Register) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/Login/PostRegister`,
                data
            );
            return response.data;
        } catch (error) {
            console.error("Error registering:", error);
            throw error;
        }
    },

    // Account
    getAddressList: async () => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/Account/GetAddressList`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching address list:", error);
            throw error;
        }
    },

    postAddress: async (data: Address) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/Account/PostAddress`,
                data
            );
            return response.data;
        } catch (error) {
            console.error("Error saving address:", error);
            throw error;
        }
    },

    deleteAddress: async (id: string) => {
        try {
            const response = await axiosInstance.delete(
                `${process.env.REACT_APP_BASE_URL}/Account/DeleteAddress?id=` + id
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting address:", error);
            throw error;
        }
    },

    setDefaultAddress: async (id: string) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/Account/SetDefaultAddress?id=` + id
            );
            return response.data;
        } catch (error) {
            console.error("Error setting default address:", error);
            throw error;
        }
    },

    postChangePassword: async (data: ChangePasswordForm) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/Account/PostChangePassword`,
                data
            );
            return response.data;
        } catch (error) {
            console.error("Error changing password:", error);
            throw error;
        }
    },

    getOrderHistory: async (queryParams: string = "") => {
        try {
            const url = queryParams
                ? `${process.env.REACT_APP_BASE_URL}/Account/GetOrderHistory?${queryParams}`
                : `${process.env.REACT_APP_BASE_URL}/Account/GetOrderHistory`;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching order history:", error);
            throw error;
        }
    },

    // News
    getNewsList: async (queryParams: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/News/GetNewsList?` + queryParams
            );
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    getNewsDetail: async (queryParams: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/News/GetNewsDetail?` + queryParams
            );
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    postNews: async (data: any) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/News/PostNews`,
                data
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    deleteNews: async (id: string) => {
        try {
            const response = await axiosInstance.delete(
                `${process.env.REACT_APP_BASE_URL}/News/DeleteNews?id=` + id
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    getNewsRelated: async (queryParams: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/News/GetNewsRelate?` + queryParams
            );
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    getRelatedProducts: async (productId: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/Product/GetRelateProduct?productId=` + productId
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    // Template
    downloadProductSample: async () => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/SaleRecord/FileDownloadProduct`,
                { responseType: "blob" }
            );
            return response.data;
        } catch (error) {
            console.error("Error downloading product sample template:", error);
            throw error;
        }
    },

    // SaleRecord
    uploadSaleRecordFile: async (file: File, month: number, year: number) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("month", String(month));
            formData.append("year", String(year));
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/SaleRecord/UploadFile`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return response.data;
        } catch (error) {
            console.error("Error uploading sale record file:", error);
            throw error;
        }
    },

    getTrendDashboard: async (queryParams: string = "") => {
        try {
            const url = queryParams
                ? `${process.env.REACT_APP_BASE_URL}/SaleRecord/GetTrendDashboard?${queryParams}`
                : `${process.env.REACT_APP_BASE_URL}/SaleRecord/GetTrendDashboard`;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching trend dashboard:", error);
            throw error;
        }
    },

    getStats: async (queryParams: string = "") => {
        try {
            const url = queryParams
                ? `${process.env.REACT_APP_BASE_URL}/SaleRecord/GetStats?${queryParams}`
                : `${process.env.REACT_APP_BASE_URL}/SaleRecord/GetStats`;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching stats:", error);
            throw error;
        }
    },

    getImportHistory: async () => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/SaleRecord/GetImportHistory`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching import history:", error);
            throw error;
        }
    },

    deleteImportHistory: async (importBatchId: string) => {
        try {
            const response = await axiosInstance.delete(
                `${process.env.REACT_APP_BASE_URL}/SaleRecord/DeleteImportHistory?importBatchId=` + importBatchId
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting import history:", error);
            throw error;
        }
    },

    getSaleRecordList: async (queryParams: string = "") => {
        try {
            const url = queryParams
                ? `${process.env.REACT_APP_BASE_URL}/SaleRecord/GetSaleRecordList?${queryParams}`
                : `${process.env.REACT_APP_BASE_URL}/SaleRecord/GetSaleRecordList`;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching sale record list:", error);
            throw error;
        }
    },

    // Voucher
    getVoucherList: async (queryParams: string = "") => {
        try {
            const url = queryParams
                ? `${process.env.REACT_APP_BASE_URL}/Voucher/GetVoucherList?${queryParams}`
                : `${process.env.REACT_APP_BASE_URL}/Voucher/GetVoucherList`;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching voucher list:", error);
            throw error;
        }
    },

    getVoucherDetail: async (id: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/Voucher/GetVoucherById?id=` + id
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching voucher detail:", error);
            throw error;
        }
    },

    postVoucher: async (data: any) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/Voucher/PostVoucher`,
                data
            );
            return response.data;
        } catch (error) {
            console.error("Error saving voucher:", error);
            throw error;
        }
    },

    deleteVoucher: async (id: string) => {
        try {
            const response = await axiosInstance.delete(
                `${process.env.REACT_APP_BASE_URL}/Voucher/DeleteVoucher?id=` + id
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting voucher:", error);
            throw error;
        }
    },

    checkApplyVoucher: async (data: CheckApplyVoucherRequest) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/Voucher/CheckApplyVoucher`,
                data
            );
            return response.data;
        } catch (error) {
            console.error("Error checking voucher:", error);
            throw error;
        }
    },

    // Product Comment
    postProductComment: async (data: ProductCommentForm) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/ProductComment/PostComment`,
                data
            );
            return response.data;
        } catch (error) {
            console.error("Error posting product comment:", error);
            throw error;
        }
    },

    getProductCommentsByProduct: async (productId: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/ProductComment/GetByProduct?productId=` + productId
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching product comments:", error);
            throw error;
        }
    },

    getCommentList: async (queryParams: string) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BASE_URL}/ProductComment/GetCommentList?` + queryParams
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching comment list:", error);
            throw error;
        }
    },

    updateCommentStatus: async (data: { id: string; status: number }) => {
        try {
            const response = await axiosInstance.put(
                `${process.env.REACT_APP_BASE_URL}/ProductComment/UpdateCommentStatus`,
                data
            );
            return response.data;
        } catch (error) {
            console.error("Error updating comment status:", error);
            throw error;
        }
    },

    deleteComment: async (id: string) => {
        try {
            const response = await axiosInstance.delete(
                `${process.env.REACT_APP_BASE_URL}/ProductComment/DeleteComment?id=` + id
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw error;
        }
    }
};

export default ApiService;
