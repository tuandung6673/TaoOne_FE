import axios from "axios";
import { environment } from "../environments/environment";

const TelebotService = {
    postMessage: async (data: any) => {
        const botToken = environment.tele_bot_token; // Thay bằng Bot Token của bạn
        const chatId = environment.tele_chat_id; // Thay bằng Chat ID hoặc Group ID
        const message = data;

        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        try {
            const response = await axios.post(telegramApiUrl, {
                chat_id: chatId,
                text: message,
            });
            return response;
        } catch (error) {
            console.error("Error fetching slide list:", error);
        }
    },

    postPhoto: async (photoUrl: any, caption: any) => {
        const botToken = environment.tele_bot_token; // Thay bằng Bot Token của bạn
        const chatId = environment.tele_chat_id; // Thay bằng Chat ID hoặc Group ID

        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
        const formData = new FormData();
        formData.append("chat_id", chatId); // ID của chat
        formData.append("photo", photoUrl); // URL của ảnh hoặc file ảnh
        formData.append("caption", caption); // Văn bản gửi kèm ảnh

        try {
            const response = await axios.post(telegramApiUrl, formData);
            return response;
        } catch (error) {
            console.error("Error fetching slide list:", error);
        }
    },
};

export default TelebotService;
