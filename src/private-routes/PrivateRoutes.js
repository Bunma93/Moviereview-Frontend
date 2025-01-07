import {React, useState, useEffect} from "react";
import ConfigRoutes from "../config/routes"
import {Navigate , Routes, Outlet, Route, Link} from "react-router-dom";
import Layout from "../Layout"
import Login from "../Login";



function PrivateRoutes({ role = "guest", setRole ,isLoggedIn, setIsLoggedIn}) {
    const [isModalOpen, setIsModalOpen] = useState(false); // สถานะการเปิดโมดอล
    const allowedRoutes = ConfigRoutes[role]?.allowedRoutes || [];
    const redirectRoutes = ConfigRoutes[role]?.redirectRoutes || "/register"; // ค่า default ให้ redirect ไปยัง register
  
    const openLoginModal = () => {
        setIsModalOpen(true); // เปิดโมดอล
    };

    const closeLoginModal = () => {
        setIsModalOpen(false); // ปิดโมดอล
    };

    useEffect(() => {
        if (role === "guest") {
            openLoginModal();
        }
    }, [role]);
    return (
        <>
        <Routes>
            {/* Layout ครอบทุกหน้า */}
            <Route element={<Layout setRole={setRole} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}>
                {/* Render หน้าเฉพาะที่ได้รับอนุญาต */}
                {allowedRoutes.map(({ url, component: Component }) => (
                    <Route 
                        key={url} 
                        path={url} 
                        element={
                            <Component setRole={setRole} isLoggedIn={isLoggedIn} />
                        }
                    />
                ))}

                {/* หากไม่มีหน้าใดตรงกับที่กำหนด ให้ Redirect */}
                <Route path="*" element={<Navigate to={redirectRoutes} />} />
            </Route>
        </Routes>

        {/* แสดงโมดอล Login หาก isModalOpen เป็น true */}
        {isModalOpen && <Login closeModal={closeLoginModal} setRole={setRole}/>}
    </>
    )
}

export default PrivateRoutes;