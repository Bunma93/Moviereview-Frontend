## 🎬 ThaiReview - ระบบรีวิวภาพยนตร์ (Fullstack)
เว็บแอปสำหรับรีวิวหนัง ดูคะแนนผู้ชม ข่าวหนัง และให้ผู้ใช้แสดงความเห็น

## 📦 โครงสร้างระบบ

- **Frontend**: React (Vite/CRA) - [👉 GitHub Link](https://github.com/Bunma93/Moviereview-Frontend)
- **Backend**: Node.js + Express + Sequelize - [👉 GitHub Link](https://github.com/Bunma93/Moviereview-Backend)
- **Database**: MySQL
- **ภาพรวม**: เชื่อมต่อผ่าน REST API และใช้งานแบบแยกฝั่ง
  
### 🔐 ระบบแอดมิน

เว็บไซต์มีฟอร์มสำหรับ **แอดมิน** เพื่อแก้ไขข้อมูล:
- แก้ไขข้อมูลหนัง / นักแสดง / ข่าว
- ลบความคิดเห็นใดๆ ก็ได้

**เข้าสู่ระบบแอดมิน:**
- Username: `Admin`
- Password: `Jamesbunma722544`

---

### 🚀 การรัน Back-End

1. Clone โปรเจกต์:
```bash
git clone https://github.com/Bunma93/Moviereview-Backend.git
cd Moviereview-Backend
```

2. ติดตั้ง dependencies:
```bash
npm install
```

3.รันเซิร์ฟเวอร์:
```bash
nodemon index.js
```

Server จะรันที่ http://localhost:8000

### 📥 ติดตั้งฐานข้อมูล
1. ติดตั้ง **MySQL** และเปิดใช้งาน

2. สร้างฐานข้อมูล `movie_review` ด้วยคำสั่ง:
```sql
CREATE DATABASE movie_review;
```

3. นำเข้าไฟล์ SQL (movie_review.sql) ด้วย MySQL Workbench:
ไปที่ File > Open SQL Script
เลือกไฟล์ movie_review.sql
เลือกฐานข้อมูล movie_review ที่ด้านซ้าย (คลิกขวา > Set as Default Schema)

กดปุ่ม ⚡️ Execute All (หรือ Ctrl + Shift + Enter)

### 🚀 การรัน Front-end
1. Clone โปรเจกต์:
```bash
git clone https://github.com/Bunma93/Moviereview-Frontend.git
cd Moviereview-Frontend
```

2. ติดตั้ง dependencies:
```bash
npm install
```

3.รันแอป:
```bash
npm start
```

Frontend จะรันที่ http://localhost:3000
และเชื่อมต่อกับ API ที่ http://localhost:8000

🙌 ติดต่อผู้พัฒนา
Bpatipongsakorn Bunma
📧 bpatipongsakorn.bun@gmail.com
