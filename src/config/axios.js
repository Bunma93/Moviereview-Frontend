import axios from "axios";
import localStorage from "../services/localStorageService";
import { notification } from "antd";

// สร้าง instance ของ axios
const apiClient = axios.create({
    baseURL: "http://localhost:8000", // URL เริ่มต้น
    timeout: 3600, // Timeout
});

// Interceptor สำหรับ Request
apiClient.interceptors.request.use(
    (config) => {
        if (config.url.includes("/login") || config.url.includes("/register")) {
        console.log("Request Sent:", config);
        return config;
        }
        const token = localStorage.getItem("token");

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
    },
    (error) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
    }
);

// Interceptor สำหรับ Response
apiClient.interceptors.response.use(
    (response) => {
        console.log("Response Received:", response);
        return response // คืนค่าเฉพาะข้อมูลใน response.data
    },
    (error) => {
        if (error.response || error.response.status === 401) {
            localStorage.removeItem();
            window.location.reload();//ให้หน้าเว็บรีโหลดตัวเอง
            notification.error({
                message: "กรุณาเข้าสู่ระบบใหม่"
            });
            console.error("Response Error:", error.response || error.message);
            return Promise.reject(error); //ถ่าไม่ return Promise จะเกิด error
        }

        return Promise.reject(error);
    }
);

export default apiClient;