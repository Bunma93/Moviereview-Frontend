import React, { useState } from 'react';
import styles from './Admin.module.scss';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
import { Form ,Button, Layout, Menu, theme} from "antd";

const Home = () => <h1>หน้าหลัก</h1>;
const Movies = () => <h1>หนังทั้งหมด</h1>;
const Settings = () => <h1>ตั้งค่า</h1>;

function Admin() {
    const { Header, Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const [selectedForm, setSelectedForm] = useState("home"); // ควบคุมว่าจะแสดงอะไร

    return (<div>
        <div className={styles.test}>
        <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['home']}
          onClick={({ key }) => setSelectedForm(key)}// ✅ เปลี่ยนเฉพาะฟอร์ม ไม่เปลี่ยนหน้า
          items={[
              { key: "home", icon: <UserOutlined />, label: "นักแสดง" },
              { key: "movies", icon: <VideoCameraOutlined />, label: "ข้อมูลหนัง" },
              { key: "settings", icon: <SettingOutlined />, label: "ตั้งค่า" },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: '#ffffff', // ใช้สีที่ต้องการ
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#ffffff',  // ใช้สีที่ต้องการ
            borderRadius: '8px',     // ใช้ borderRadius ที่ต้องการ
          }}
        >
            {selectedForm === "home" && <Home />}
            {selectedForm === "movies" && <Movies />}
            {selectedForm === "settings" && <Settings />}
        </Content>
      </Layout>
    </Layout>
        </div>
    </div>
)};

export default Admin;