/* eslint-disable @typescript-eslint/no-unused-vars */
import { environment } from "../environments/environment";
import axiosInstance from "./api.interceptor";

const ApiService = {
    // Home
    getHome: async () => {
        try {
            const response = await axiosInstance.get(
                `${environment.baseUrl}/Home/GetHome`
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
                `${environment.baseUrl}/Slide/GetSlideList?` + queryParams
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
                `${environment.baseUrl}/Slide/GetSlideDetail?id=` + id
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
                `${environment.baseUrl}/Slide/PostSlide`,
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
            const response = await axiosInstance.get(
                `${environment.baseUrl}/Slide/DeteleSlide?id=` + id
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
                `${environment.baseUrl}/Product/GetProductList?` + queryParams
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
                `${environment.baseUrl}/Product/GetProductDetail?id=` + id
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
                `${environment.baseUrl}/Product/PostProduct`,
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
                `${environment.baseUrl}/Product/DeleteProduct?id=` + id
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
                `${environment.baseUrl}/Category/GetCategoryList?` + queryParams
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
                `${environment.baseUrl}/Category/GetCategoryDetail?id=` + id
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
                `${environment.baseUrl}/Category/PostCategory`,
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
                `${environment.baseUrl}/Category/DeleteCategory?id=` + id
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
                `${environment.baseUrl}/CategoryDetail/GetCategoryDetailList?` +
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
                `${environment.baseUrl}/CategoryDetail/GetCategoryDetailDetail?id=` +
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
                `${environment.baseUrl}/CategoryDetail/PostCategoryDetail`,
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
                `${environment.baseUrl}/CategoryDetail/DeleteCategoryDetail?id=` +
                    id
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },
};

export default ApiService;
