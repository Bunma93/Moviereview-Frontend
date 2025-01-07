import Homepage from "../homepage";
import Movieinfo from "../movieinfo";
import Profile from "../profile";
import RegisterForm from "../RegisterForm";
import Login from "../Login";

const components = {
    homepage: {
        url: "/",
        component: Homepage
    },
    register: {
        url: "/register",
        component: RegisterForm
    },
    profile: {
        url: "/profile",
        component: Profile
    },
    movieinfo : {
        url: "/movieinfo",
        component: Movieinfo
    },
    login : {
        url: "/login",
        component: Login
    },
}

//Role ไหนเข้าหน้าไหนได้บ้าง
export default {
    guest: {
        allowedRoutes: [
          components.register, // หน้าสำหรับลงทะเบียน
          components.homepage, // หน้าหลัก
          components.login
        ],
        redirectRoutes: "/", // หากเส้นทางไม่ตรงจะ Redirect มาหน้านี้
      },
    user: {
      allowedRoutes: [
        components.homepage,
        components.profile, // หน้าโปรไฟล์
        components.movieinfo, // หน้าข้อมูลภาพยนตร์
      ],
      redirectRoutes: "/", // หากเส้นทางไม่ตรงจะ Redirect มาหน้านี้
    },
    admin: { 
      allowedRoutes: [
          components.homepage,
          components.profile,
          components.movieinfo,
          // เพิ่มหน้าเฉพาะแอดมิน เช่น จัดการข้อมูล
      ],
      redirectRoutes: "/",
  },
}