import { React, useState } from "react";
import ConfigRoutes from "../config/routes";
import { Navigate, Routes, Outlet, Route, Link } from "react-router-dom";
import Layout from "../Layout";
import Login from "../Login";

function PrivateRoutes({ role = "guest", setRole }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // สถานะการเปิดโมดอล
  const allowedRoutes = ConfigRoutes[role]?.allowedRoutes || [];
  const redirectRoutes = ConfigRoutes[role]?.redirectRoutes || "/register"; // ค่า default ให้ redirect ไปยัง register

  const openLoginModal = () => {
    setIsModalOpen(true); // เปิดโมดอล
  };

  const closeLoginModal = () => {
    setIsModalOpen(false); // ปิดโมดอล
  };
  return (
    <>
      <Routes>
        {/* Layout ครอบทุกหน้า */}
        <Route
          element={
            <Layout
              setRole={setRole}
              isLoggedIn={isLoggedIn} // <-- Pass it here
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        >
          {allowedRoutes.map(({ url, component: Component }) => (
            <Route
              key={url}
              path={url}
              element={
                <Component
                  setRole={setRole}
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
              }
            />
          ))}
          <Route path="*" element={<Navigate to={redirectRoutes} />} />
        </Route>
      </Routes>

      {/* แสดงโมดอล Login หาก isModalOpen เป็น true */}
      {isModalOpen && (
        <Login
          closeModal={closeLoginModal}
          setRole={setRole}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </>
  );
}

export default PrivateRoutes;
