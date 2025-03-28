import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Outlet,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import RegisterForm from "./pages/RegisterForm/RegisterForm"
import localStorage from "./services/localStorageService";
// import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from "react-router-dom"; // เพิ่มการนำเข้า useNavigate

function Layout({ setRole, isLoggedIn, setIsLoggedIn, isModalOpen, setIsModalOpen, isRegisterMode, setIsRegisterMode }) {

  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // ลบ token ออกจาก localStorage
    setRole("guest");
    setIsLoggedIn(false); // บอก parent ว่าล็อกเอาท์แล้ว
    navigate("/");
  };

  useEffect(() => {
    // สมมติว่า access token ถูกเก็บไว้ใน localStorage
    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    console.log("Token", accessToken);
  
    if (accessToken) {
      setIsLoggedIn(true); // ตั้งค่าเป็น true ถ้ามี access token
      setIsModalOpen(false);
    } else {
      setIsLoggedIn(false); // ตั้งค่าเป็น false ถ้าไม่มี access token
    }
  }, []);

  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      openModal();
    }
  };

  return (
    <div>
      <div className="Navbar">
        <div className="Navbar-Logo">
          <img src="/image/Logo.png" alt="ThaiReview" className="Logo"/>
        </div>
        <nav className="Navbar-link">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li onClick={handleLoginLogoutClick} className="Navbar-link user-button">
            <span className="user-text"> {isLoggedIn ? "Logout" : "Login"} </span>
            <i className="fa-regular fa-user"></i>
          </li>
        </nav>
      </div>

      {/* Renders the child route(s) */}
      <Outlet />

      {/* Login modal (only if isModalOpen == true) */}
      {isModalOpen && (isRegisterMode ? ( 
        //  <GoogleOAuthProvider clientId={clientId}>
          <Login
            closeModal={closeModal}
            setRole={setRole}
            setIsLoggedIn={(val) => {
              console.log("LAYOUT: setIsLoggedIn got called with", val);
              setIsLoggedIn(val);
            }}
            setIsRegisterMode = {setIsRegisterMode}
          />
        // </GoogleOAuthProvider>
        )
      : ( <RegisterForm  closeModal={closeModal} setIsRegisterMode={setIsRegisterMode}/> ) 
      )}
    </div>
  );
}

export default Layout;
