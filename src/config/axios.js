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
        
        //ถ้ามี token จะ Authorized ให้
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
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
        if (error.response && error.response.status === 401) {
            const errorMessage = error.response.data || ""; // อ่านค่า `data` โดยตรง

            if (errorMessage.toLowerCase().includes("unauthorized")) {  
                console.error("Unauthorized Access:", errorMessage);

                // ลบ Token ออกจาก localStorage
                localStorage.removeItem("token");

                // แจ้งเตือนผู้ใช้ให้ล็อกอินใหม่
                notification.error({
                    message: "Session Expired",
                    description: "กรุณาเข้าสู่ระบบใหม่",
                });
            }

             // รีเฟรชหน้าจอ
             setTimeout(() => {
                window.location.reload();
            }, 1000); // รีเฟรชหลังจาก 1 วินาที
            
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default apiClient;