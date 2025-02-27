import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Select, Button, Upload, message, Divider, Avatar, Modal } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import axios from '../../config/axios';
import styles from './AdminActorForm.module.scss';
import moment from 'moment';

const AdminActorForm = () => {
  const [actorList, setactorList] = useState([]);
  const [searchText, setSearchText] = useState("");

  const filteredActors = actorList.filter(actor =>
    actor.actorname.toLowerCase().includes(searchText.toLowerCase())
  );

  const fetchactorList = async () => {
    const httpResponse = await axios.get("http://localhost:8000/actor")
    console.log("🔍 Response ทั้งหมด:", httpResponse);  // ดูทั้งหมด
    console.log("📌 Data ที่ได้จาก API:", httpResponse.data);  // ดูเฉพาะ data
    setactorList(httpResponse.data);
  };

  useEffect(() => {
    fetchactorList();
  },[]);

  const [form] = Form.useForm();
  const [actorFile, setactorFile] = useState(null);
  const [actorFileList, setactorFileList] = useState([]);
  
  const handleactorChange = ({ fileList }) => {
    setactorFileList(fileList);
    if (fileList.length > 0) {
      setactorFile(fileList[0].originFileObj);
    } else {
      setactorFile(null);
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

    if (actorFile) formData.append('actorimagePath', actorFile);
   
    try {
      await axios.post('/actor/add', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('เพิ่มภาพยนตร์สำเร็จ!');
      form.resetFields();
      setactorFile(null);
      setactorFileList([]);
      fetchactorList();
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
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedActor, setSelectedActor] = useState(null);
  const [formEdit] = Form.useForm();

  const handleEdit = (id) => {
    const actor = actorList.find(actor => actor.id === id);
    if (!actor) {
      message.error("ไม่พบนักแสดงที่ต้องการแก้ไข");
      return;
    }

    setSelectedActor(actor);
    setIsEditModalOpen(true);

    formEdit.setFieldsValue({
      actorname: actor.actorname,
      birthdate: actor.birthdate ? moment(actor.birthdate) : null,
      country: actor.country,
      role: actor.role,
    });

    if (actor.actorimagePath) {
      setactorFileList([
        {
          uid: '-1', // ใช้ UID คงที่เพื่อไม่ให้ React ลบ
          name: 'actor_image.jpg',
          status: 'done',
          url: `http://localhost:8000/${actor.actorimagePath}`, // URL ของรูปเก่า
        },
      ]);
    } else {
      setactorFileList([]); // ถ้าไม่มีรูป ให้เคลียร์ค่า
    }
  };

  const handleUpdate = async (values) => {
    if (!selectedActor) {
      message.error("เกิดข้อผิดพลาด: ไม่มีนักแสดงที่ถูกเลือก");
      return;
    }

    // ตรวจสอบข้อมูลที่เลือกก่อนการอัปเดต
    console.log("ข้อมูลที่ถูกเลือกและแก้ไข:", values);
    
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "birthdate") {
        formData.append(key, values[key] ? values[key].format("YYYY-MM-DD") : "");
      } else {
        formData.append(key, values[key]);
      }
    });

    if (actorFile) {
      formData.append("actorimagePath", actorFile);
    }

    try {
      await axios.put(`http://localhost:8000/actor/${selectedActor.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      message.success("อัปเดตข้อมูลสำเร็จ!");
      fetchactorList(); // โหลดข้อมูลใหม่
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปเดต:", error);
      message.error("เกิดข้อผิดพลาดในการอัปเดต");
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'ยืนยันการลบ',
      content: 'คุณแน่ใจหรือไม่ว่าต้องการลบนักแสดงนี้?',
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      onOk: async () => {
        try {
          await axios.delete(`/actor/${id}`);
          message.success("ลบนักแสดงสำเร็จ!");
          // setactorList(actorList.filter(actor => actor.id !== id));
          fetchactorList();
        } catch (error) {
          message.error("เกิดข้อผิดพลาดในการลบ");
        }
      }
  })
} 

  return (
    <div>
      <Modal 
        title="แก้ไขข้อมูลนักแสดง"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => formEdit.submit()}
      >
        <Form 
          form={formEdit}
          // initialValues={selectedActor} 
          onFinish={handleUpdate}
          layout="vertical"
        >
          <Form.Item label="ชื่อนักแสดง" name="actorname">
            <Input />
          </Form.Item>

          <Form.Item label="วันเกิด" name="birthdate">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="สัญชาติ" name="country">
            <Input />
          </Form.Item>

          <Form.Item label="ตำแหน่ง" name="role">
            <Select>
              <Select.Option value="director">ผู้กำกับ</Select.Option>
              <Select.Option value="actor">นักแสดง</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="อัปโหลดภาพนักแสดง/ผู้กำกับ" name="actorimagePath">
            <Upload 
              listType="picture-circle" 
              fileList={actorFileList}
              onChange={handleactorChange}
              maxCount={1}
              beforeUpload={() => false}
              showUploadList={{ showPreviewIcon: true }}
            >
              {actorFileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="ชื่อนักแสดง/ผู้กำกับ" name="actorname" rules={[{ required: true, message: 'กรุณากรอกชื่อนักแสดง/ผู้กำกับ' }]}>
          <Input placeholder="ใส่ชื่อนักแสดง/ผู้กำกับ" />
        </Form.Item>

        <Form.Item label="วันเกิดนักแสดง/ผู้กำกับ" name="birthdate" rules={[{ required: true, message: 'กรุณาเลือกวันเกิดนักแสดง/ผู้กำกับ' }]}>
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD" // กำหนด format ของวันที่
          />
        </Form.Item>

        <Form.Item label="สัญชาตินักแสดง/ผู้กำกับ" name="country" rules={[{ required: true, message: 'กรุณากรอกสัญชาตินักแสดง/ผู้กำกับ' }]}>
          <Input placeholder="ใส่สัญชาตินักแสดง/ผู้กำกับ" />
        </Form.Item>
        {/* <Form.Item label="รายละเอียด" name="description" rules={[{ required: true, message: 'กรุณากรอกรายละเอียด' }]}>
          <Input.TextArea rows={4} placeholder="ใส่รายละเอียดภาพยนตร์" />
        </Form.Item> */}
        <Form.Item label="ตำแหน่ง" name="role" rules={[{ required: true, message: 'กรุณาเลือกตำแหน่ง' }]}>
            <Select>
              <Select.Option value="director">ผู้กำกับ</Select.Option>
              <Select.Option value="actor">นักแสดง</Select.Option>
            </Select>
        </Form.Item>

        <Form.Item label="อัปโหลดภาพนักแสดง/ผู้กำกับ" name="actorimagePath" rules={[{ required: true, message: 'กรุณาอัพโหลดรูปภาพ' }]}>
          <Upload 
            listType="picture-circle" 
            fileList={actorFileList}
            onChange={handleactorChange}
            maxCount={1}
            beforeUpload={() => false}
            showUploadList={{ showPreviewIcon: true }}>
            {actorFileList.length >= 1 ? null : uploadButton}
            {/* <Button icon={<UploadOutlined />}>อัปโหลดภาพนักแสดง</Button> */}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            เพิ่มข้อมูลนักแสดง
          </Button>
        </Form.Item>
      </Form>

      <Divider orientation="left" style={{ borderColor: '#00000090' }}>ข้อมูลนักแสดง</Divider>
      <Input.Search 
        placeholder="ค้นหาชื่อนักแสดง..." 
        allowClear 
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, width: "70%" }}
      />
      <div className={styles.actorContainer}>
          {filteredActors.map((list)=> {
            const imageUrl = `http://localhost:8000/${list.actorimagePath}`;
            return (
            <div key={list.id} className={styles.actorProfile}>
            <div className={styles.avatarWrapper}>
              <Avatar size={100} icon={<UserOutlined />} src={imageUrl} className={styles.actorPicture}/>
              <div className={styles.buttonOverlay}>
                <button className={styles.editButton} onClick={() => handleEdit(list.id)}>✏️</button>
                <button className={styles.deleteButton} onClick={() => handleDelete(list.id)}>🗑️</button>
              </div>
            </div>
          <p>{list.actorname}</p>
            </div>
            );
          })}
        </div>
    </div>
  );
};

export default AdminActorForm;