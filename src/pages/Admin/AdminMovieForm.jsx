import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Switch, Button, Upload, message , Divider, Avatar, Space, Modal} from 'antd';
import { PlusOutlined, UserOutlined, MinusCircleOutlined } from '@ant-design/icons';
import axios from '../../config/axios';
import styles from './AdminMovieForm.module.scss';
import moment from 'moment';

const AdminMovieForm = () => {
  const [form] = Form.useForm();
  const [posterFile, setPosterFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState([]);// รองรับหลายไฟล์
  const [posterFileList, setPosterFileList] = useState([]);
  const [backgroundFileList, setBackgroundFileList] = useState([]);

  const [movieList, setmovieList] = useState([])
  const [searchText, setSearchText] = useState("");

  const filteredMovies = movieList.filter(movie =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const fetchmovieList = async () => {
    const httpResponse = await axios.get("/movie")
    console.log("🔍 Response ทั้งหมด:", httpResponse);  // ดูทั้งหมด
    console.log("📌 Data ที่ได้จาก API:", httpResponse.data);  // ดูเฉพาะ data
    setmovieList(httpResponse.data);
  };

  useEffect(() => {
      fetchmovieList();
    },[]);
  
  const handlePosterChange = ({ fileList }) => {
    setPosterFileList(fileList);
    if (fileList.length > 0) {
      setPosterFile(fileList[0].originFileObj);
    } else {
      setPosterFile(null);
    }
  };
    
  const handleBackgroundChange = ({ fileList }) => {
    setBackgroundFileList(fileList);
    if (fileList.length > 0) {
      setBackgroundFile(fileList.map(file => file.originFileObj)); // เก็บหลายไฟล์
    } else {
      setBackgroundFile(null);
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

    if (posterFile) formData.append('posterimagePath', posterFile);
    if (backgroundFile) backgroundFile.forEach((file) => {
      formData.append(`backgroundimagePath`, file); // ส่งเป็น array
    });
    
    try {
      await axios.post('/movie/add', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('เพิ่มภาพยนตร์สำเร็จ!');
      form.resetFields();
      setPosterFile(null);
      setBackgroundFile(null);
      setPosterFileList([]);
      setBackgroundFileList([]);
      fetchmovieList();
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formEdit] = Form.useForm();

  const handleEdit = (id) => {
    const movie = movieList.find(movie => movie.id === id);
    if (!movie) {
      message.error("ไม่พบภาพยนต์ที่ต้องการแก้ไข");
      return;
    }

    setSelectedMovie(movie);
    setIsEditModalOpen(true);

    const langs = Array.isArray(movie.lang) ? movie.lang : JSON.parse(movie.lang || "[]");

    formEdit.setFieldsValue({
      title: movie.title,
      engTitle: movie.engTitle,
      date: movie.date ? moment(movie.date) : null,
      description: movie.description,
      Atcinema: movie.Atcinema,
      age: movie.age,
      lang: langs,
      trailerUrl:movie.trailerUrl
    })

    if (movie.posterimagePath) {
      setPosterFileList([
        {
          uid: '-1', // ใช้ UID คงที่เพื่อไม่ให้ React ลบ
          name: 'poster_image.jpg',
          status: 'done',
          url: `http://localhost:8000/${movie.posterimagePath}`, // URL ของรูปเก่า
        }
      ])
    } else {
      setPosterFileList([])
    }

    if (movie.backgroundimagePath) {
      let backgroundPaths = Array.isArray(movie.backgroundimagePath) 
        ? movie.backgroundimagePath 
        : JSON.parse(movie.backgroundimagePath || "[]");

        setBackgroundFileList(
          backgroundPaths.map((path, index) => ({
            uid: `-${index}`, // ใช้ UID ไม่ซ้ำกัน
            name: `background_image_${index + 1}.jpg`,
            status: 'done',
            url: `http://localhost:8000/${path}` // สร้าง URL ให้ถูกต้อง
        }))
  );
} else {
  setBackgroundFileList([]);
}

  }
  const handleUpdate = async (values) => {
    if (!selectedMovie) {
      message.error("เกิดข้อผิดพลาด: ไม่มีภาพยนต์ที่ถูกเลือก");
      return;
    }

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "date") {
        formData.append(key, values[key] ? values[key].format("YYYY-MM-DD") : "");
      } else {
        formData.append(key, values[key]);
      }
    });

    if (posterFile) {
      formData.append("posterimagePath", posterFile);
    }

    if (backgroundFile) backgroundFile.forEach((file) => {
      formData.append(`backgroundimagePath`, file); // ส่งเป็น array
    });

    try {
      await axios.put(`http://localhost:8000/movie/${selectedMovie.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      message.success("อัปเดตข้อมูลสำเร็จ!");
      fetchmovieList(); // โหลดข้อมูลใหม่
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปเดต:", error);
      message.error("เกิดข้อผิดพลาดในการอัปเดต");
    }
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none',color:"black" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8, color:"black" ,fontSize:"12px"}}>อัพโหลดรูป</div>
    </button>
  );

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'ยืนยันการลบ',
      content: 'คุณแน่ใจหรือไม่ว่าต้องการลบภาพยนต์นี้?',
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      onOk: async () => {
        try {
          await axios.delete(`/movie/${id}`);
          message.success("ลบภาพยนต์สำเร็จ!");
          // setactorList(actorList.filter(actor => actor.id !== id));
          fetchmovieList();
        } catch (error) {
          message.error("เกิดข้อผิดพลาดในการลบ");
        }
      }
    })
  } 

  return (
    <div>
      <Modal 
        title="แก้ไขข้อมูลภาพยนต์"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => formEdit.submit()}
      >
        <Form 
          form={formEdit}
          onFinish={handleUpdate}
          layout="vertical"
        >
         <Form.Item label="ชื่อภาพยนตร์(ภาษาไทย)" name="title" rules={[{ required: true, message: 'กรุณากรอกชื่อภาพยนตร์' }]}>
          <Input placeholder="ใส่ชื่อภาพยนตร์" />
        </Form.Item>

        <Form.Item label="ชื่อภาพยนตร์ (ภาษาอังกฤษ)" name="engTitle" rules={[{ required: true, message: 'กรุณากรอกชื่อภาพยนตร์' }]}>
          <Input placeholder="ใส่ชื่อภาพยนตร์" />
        </Form.Item>

        <Form.Item label="วันที่ฉาย" name="date" rules={[{ required: true, message: 'กรุณาเลือกวันที่ฉาย' }]}>
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD" // กำหนด format ของวันที่
          />
        </Form.Item>

        <Form.Item label="รายละเอียด" name="description" rules={[{ required: true, message: 'กรุณากรอกรายละเอียด' }]}>
          <Input.TextArea rows={4} placeholder="ใส่รายละเอียดภาพยนตร์" />
        </Form.Item>

        <Form.Item label="ฉายในโรงภาพยนตร์" name="Atcinema" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="ลิงค์ตัวอย่างภาพยนต์(youtube)" name="trailerUrl" rules={[{ required: true, message: 'กรุณาใส่ลิงค์' }]}>
        <Input placeholder="ใส่ลิงค์" />
        </Form.Item>

        <Form.Item label="เรตอายุผู้ชม" name="age" rules={[{ required: true, message: 'กรุณากรอกเรคอายุ' }]}>
          <Input placeholder="ใส่เรตอายุผู้ชม" />
        </Form.Item>

        <Form.Item label="ภาษาพากย์">
        <Form.List name="lang">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[{ required: true, message: "กรุณากรอกภาษาพากย์" }]}
                  >
                    <Input placeholder="ใส่ภาษาที่พากย์" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} style={{ color: "red" }} />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                เพิ่มภาษา
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item label="อัปโหลดภาพโปสเตอร์" name="posterimagePath">
          <Upload 
            listType="picture-card" 
            fileList={posterFileList}
            onChange={handlePosterChange}
            maxCount={1}
            beforeUpload={() => false}
            showUploadList={{ showPreviewIcon: true }}>
            {posterFileList.length >= 1 ? null : uploadButton}
            {/* <Button icon={<UploadOutlined />}>อัปโหลดโปสเตอร์</Button> */}
          </Upload>
        </Form.Item>

        <Form.Item label="อัปโหลดภาพพื้นหลัง (สูงสุด 3 รูป)" name="backgroundimagePath">
          <Upload 
          listType="picture-card"
          fileList={backgroundFileList}
          onChange={handleBackgroundChange}
          maxCount={3}
          beforeUpload={() => false}
          showUploadList={{ showPreviewIcon: true }}>
          {backgroundFileList.length >= 3 ? null : uploadButton}
            {/* <Button icon={<UploadOutlined />}>อัปโหลดพื้นหลัง</Button> */}
          </Upload>
        </Form.Item>
        </Form>
      </Modal>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="ชื่อภาพยนตร์" name="title" rules={[{ required: true, message: 'กรุณากรอกชื่อภาพยนตร์' }]}>
          <Input placeholder="ใส่ชื่อภาพยนตร์" />
        </Form.Item>

        <Form.Item label="ชื่อภาพยนตร์ (ภาษาอังกฤษ)" name="engTitle" rules={[{ required: true, message: 'กรุณากรอกชื่อภาพยนตร์' }]}>
          <Input placeholder="ใส่ชื่อภาพยนตร์" />
        </Form.Item>

        <Form.Item label="วันที่ฉาย" name="date" rules={[{ required: true, message: 'กรุณาเลือกวันที่ฉาย' }]}>
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD" // กำหนด format ของวันที่
          />
        </Form.Item>

        <Form.Item label="รายละเอียด" name="description" rules={[{ required: true, message: 'กรุณากรอกรายละเอียด' }]}>
          <Input.TextArea rows={4} placeholder="ใส่รายละเอียดภาพยนตร์" />
        </Form.Item>

        <Form.Item label="ฉายในโรงภาพยนตร์" name="Atcinema" valuePropName="checked">
          <Switch />
        </Form.Item>
        
        <Form.Item label="ลิงค์ตัวอย่างภาพยนต์(youtube)" name="trailerUrl" rules={[{ required: true, message: 'กรุณาใส่ลิงค์' }]}>
        <Input placeholder="ใส่ลิงค์" />
        </Form.Item>

        <Form.Item label="เรตอายุผู้ชม" name="age" rules={[{ required: true, message: 'กรุณากรอกเรคอายุ' }]}>
          <Input placeholder="ใส่เรตอายุผู้ชม" />
        </Form.Item>

        <Form.Item label="ภาษาพากย์">
        <Form.List name="lang">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[{ required: true, message: "กรุณากรอกภาษาพากย์" }]}
                  >
                    <Input placeholder="ใส่ภาษาที่พากย์" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} style={{ color: "red" }} />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                เพิ่มภาษา
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>

        <Form.Item label="อัปโหลดภาพโปสเตอร์" name="posterimagePath" rules={[{ required: true, message: 'กรุณาอัพโหลดรูปภาพ' }]}>
          <Upload 
            listType="picture-card" 
            fileList={posterFileList}
            onChange={handlePosterChange}
            maxCount={1}
            beforeUpload={() => false}
            showUploadList={{ showPreviewIcon: true }}>
            {posterFileList.length >= 1 ? null : uploadButton}
            {/* <Button icon={<UploadOutlined />}>อัปโหลดโปสเตอร์</Button> */}
          </Upload>
        </Form.Item>

        <Form.Item label="อัปโหลดภาพพื้นหลัง (สูงสุด 3 รูป)" name="backgroundimagePath" rules={[{ required: true, message: 'กรุณาอัพโหลดรูปภาพ' }]}>
          <Upload 
          listType="picture-card"
          fileList={backgroundFileList}
          onChange={handleBackgroundChange}
          maxCount={3}
          beforeUpload={() => false}
          showUploadList={{ showPreviewIcon: true }}>
          {backgroundFileList.length >= 3 ? null : uploadButton}
            {/* <Button icon={<UploadOutlined />}>อัปโหลดพื้นหลัง</Button> */}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            เพิ่มภาพยนตร์
          </Button>
        </Form.Item>
      </Form>

      <Divider orientation="left" style={{ borderColor: '#00000090' }}>ข้อมูลภาพยนต์</Divider>
      <Input.Search 
        placeholder="ค้นหาชื่อภาพยนต์..." 
        allowClear 
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, width: "70%" }}
      />
      <div className={styles.actorContainer}>
        {filteredMovies.map((list) => {
          const imageUrl = `http://localhost:8000/${list.posterimagePath}`
          return (
          <div key={list.id} className={styles.actorProfile}>
            <div className={styles.avatarWrapper}>
              <Avatar size={100} icon={<UserOutlined />} src={imageUrl} className={styles.actorPicture}/>
              <div className={styles.buttonOverlay}>
                <button className={styles.editButton} onClick={() => handleEdit(list.id)}>✏️</button>
                <button className={styles.deleteButton} onClick={() => handleDelete(list.id)}>🗑️</button>
              </div>
            </div>
          <p>{list.title}</p>
          </div>
          )
        })}
      </div>
    </div>
  );
};

export default AdminMovieForm;