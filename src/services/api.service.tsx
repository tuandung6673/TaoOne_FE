/* eslint-disable @typescript-eslint/no-unused-vars */
import { Login, PaymentForm } from "../constants/interface";
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

    // login
    postLogin: async (data: Login) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/Login/PostLogin`,
                data
            );
            return response.data;
        } catch (error) {
            console.log(error);
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
    }
};

export default ApiService;
