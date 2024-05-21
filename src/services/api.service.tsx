/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { environment } from "../environments/environment";
import axiosInstance from "./api.interceptor";

const ApiService = {
    getSlide: async (queryParams : string) => {
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

    getProductList: async (queryParams : string) => {
        try {
            const response = await axiosInstance.get(
                `${environment.baseUrl}/Product/GetProductList?` + queryParams
            )
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    GetCategoryDetailList: async (queryParams : string) => {
        try {
            const response = await axiosInstance.get(
                `${environment.baseUrl}/CategoryDetail/GetCategoryDetailList?` + queryParams
            )
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error fetching slide list:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    }
};

export default ApiService;
