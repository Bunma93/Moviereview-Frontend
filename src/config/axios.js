import axios from "axios";
import localStorage from "../services/localStorageService";

// สร้าง instance ของ axios
const apiClient = axios.create({
    baseURL: "http://localhost:8000", // URL เริ่มต้น
    timeout: 5000, // Timeout
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
        console.error("Response Error:", error.response || error.message);
        return Promise.reject(error);
    }
);

export default apiClient;