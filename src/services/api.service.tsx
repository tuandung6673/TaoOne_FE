/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { environment } from "../environments/environment";
import axiosInstance from "./api.interceptor";

const ApiService = {
    getSlide: async () => {
      try {
        const response = await axiosInstance.get(`${environment.baseUrl}/Slide/GetSlideList`);
        return response.data; // Trả về dữ liệu từ API
      } catch (error) {
        console.error('Error fetching slide list:', error);
        throw error; // Ném lỗi ra để xử lý sau
      }
    },
  };
  
  export default ApiService;