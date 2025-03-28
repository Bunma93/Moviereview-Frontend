import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Select, Button, Upload, message, Divider, Avatar, Modal } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import axios from '../../../config/axios';
import styles from './AdminNewsForm.module.scss';

const AdminNewsForm = () => {
    const [movieNewsList, setMovieNewsList] = useState([]);
    const [newsFileList, setNewsFileList] = useState([]);
    const [newsFile, setNewsFile] = useState([]);

    const fetchMovieNewsList = async() => {
        const httpResponse = await axios.get('/movienews');
        console.log("🔍 Response ทั้งหมด:", httpResponse);  // ดูทั้งหมด
        console.log("📌 Data ที่ได้จาก API:", httpResponse.data);  // ดูเฉพาะ data
        setMovieNewsList(httpResponse.data);
    }

    useEffect(() => {
        fetchMovieNewsList();
    },[]);

    const [form] = Form.useForm();

    const handleNewsChange = ({ fileList }) => {
        setNewsFileList(fileList);
        if (fileList.length > 0) {
          setNewsFile(fileList[0].originFileObj);
        } else {
          setNewsFile(null);
        }
    };

    const handleSubmit = async (values) => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
            message.error('กรุณาล็อกอินก่อน');
            return;
        }

        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key]);
        });

        if (newsFile) formData.append('newsimagePath', newsFile);

         try {
              await axios.post('/movienews/addNews', formData, {
                headers: { 
                  'Content-Type': 'multipart/form-data',
                },
              });
              message.success('เพิ่มข่าวสำเร็จ!');
              form.resetFields();
              setNewsFile(null);
              setNewsFileList([]);
              fetchMovieNewsList();
            } catch (error) {
            // เช็คว่า error.response มีอยู่จริงก่อน
              if (error.response) {
                console.error("Error response:", error.response);
                message.error('เกิดข้อผิดพลาด: ' + (error.response.data?.message || error.message));
              } else {
                // หากไม่มี response จากเซิร์ฟเวอร์ให้แสดงข้อความที่เหมาะสม
                console.error("Error message:", error.message);
                message.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
              }
            }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none',color:"black" }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8, color:"black" ,fontSize:"12px"}}>อัพโหลดรูป</div>
        </button>
    );

    return (
        <div>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="หัวข้อข่าว" name="title" rules={[{ required: true, message: 'กรุณากรอกหัวข้อข่าว' }]}>
                <Input placeholder="ใส่หัวข้อข่าว" />
                </Form.Item>

                <Form.Item label="เนื้อหาข่าว" name="content" rules={[{ required: true, message: 'กรุณากรอกเนื้อหาข่าว' }]}>
                <Input placeholder="เนื้อหาข่าว" />
                </Form.Item>

                <Form.Item label="อัปโหลดภาพข่าว" name="newsimagePath" rules={[{ required: true, message: 'กรุณาอัพโหลดรูปภาพ' }]}>
                    <Upload 
                        listType="picture-card" 
                        fileList={newsFileList}
                        onChange={handleNewsChange}
                        maxCount={1}
                        beforeUpload={() => false}
                        showUploadList={{ showPreviewIcon: true }}>
                        {newsFileList.length >= 1 ? null : uploadButton}
                        {/* <Button icon={<UploadOutlined />}>อัปโหลดภาพนักแสดง</Button> */}
                    </Upload>
                </Form.Item>

                <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    เพิ่มข้อมูลข่าว
                </Button>
                </Form.Item>
            </Form>
        </div>
    )
};

export default AdminNewsForm;