import React, { useState } from 'react';
import styles from './Admin.module.scss';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    UserOutlined,
    VideoCameraOutlined,
    FileDoneOutlined
  } from '@ant-design/icons';
import { Button, Layout, Menu} from "antd";
import AdminMovieForm from './AdminMovieForm';
import AdminActorForm from './AdminActorForm';
import AdminNewsForm from './AdminNewsForm/AdminNewsForm';

const Settings = () => <h1>ตั้งค่า</h1>;

function Admin() {
    const { Header, Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const [selectedForm, setSelectedForm] = useState("actors"); // ควบคุมว่าจะแสดงอะไร

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
              { key: "actors", icon: <UserOutlined />, label: "นักแสดง" },
              { key: "movies", icon: <VideoCameraOutlined />, label: "ข้อมูลหนัง" },
              { key: "news", icon: <FileDoneOutlined />, label: "ข่าว" },
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
            background: '#fff',  // ใช้สีที่ต้องการ
            borderRadius: '8px',     // ใช้ borderRadius ที่ต้องการ
            width: "90%"
          }}
        >
            {selectedForm === "actors" && <AdminActorForm/>}
            {selectedForm === "movies" && <AdminMovieForm/>}
            {selectedForm === "news" && <AdminNewsForm />}
        </Content>
      </Layout>
    </Layout>
        </div>
    </div>
)};

export default Admin;