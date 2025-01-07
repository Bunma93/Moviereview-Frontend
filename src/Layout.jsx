import React, { useState, useEffect } from "react";
import {BrowserRouter as Router, Routes, Outlet, Route, Link, useLocation} from "react-router-dom";
import RegisterForm from './RegisterForm';
import Login from './Login';
import localStorage from "./services/localStorageService";
import { useNavigate } from 'react-router-dom'; // เพิ่มการนำเข้า useNavigate

function Layout({setRole, isLoggedIn, setIsLoggedIn}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate(); // ประกาศ useNavigate เพื่อใช้งาน

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // เช็คว่า token มีหรือไม่
    }, []);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // ลบ token ออกจาก localStorage
        setRole("guest");
        setIsLoggedIn(false); // เปลี่ยนสถานะการล็อกอินเป็น false
        navigate('/');
    };

    const handleLoginLogoutClick = () => {
        if (isLoggedIn) {
            handleLogout(); // ถ้า logged in แล้ว, ให้ logout
        } else {
            openModal(); // ถ้าไม่ได้ล็อกอิน, ให้เปิดโมดอล
        }
    };
  
    return (
    <div>
        <div className='Navbar'>
            <div className="Navbar-Logo">
              <img src="/image/Logo.png" alt="ThaiReview" width="100" height="67"/>
            </div>
            <nav className='Navbar-link'>
                  <li>
                      <Link to ="/">Home</Link>
                  </li>
                  <li>
                      <Link to ="/about">About</Link>
                  </li>
                  <li>
                      <Link to ="/profile">Profile</Link>
                  </li>
                  <li onClick={handleLoginLogoutClick}>
                        <span style={{ cursor: 'pointer' }} >
                            {isLoggedIn ? 'Logout' : 'Login'}
                        </span>
                      <i className="fa-regular fa-user"></i>
                  </li>
            </nav>
          </div>
          <Outlet />
  
           {/* แสดงโมดอลหาก isModalOpen เป็น true */}
           {isModalOpen && (
                <>
                    <Login 
                        closeModal={closeModal} 
                        setRole={setRole} 
                        setIsLoggedIn={setIsLoggedIn}/>
                </>
)}
    </div>
    )
  }

export default Layout;