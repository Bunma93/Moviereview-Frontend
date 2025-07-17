import HomePage from "../pages/HomePage/HomePage";
import MovieInfoPage from "../pages/MovieInfoPage/MovieInfoPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import RegisterForm from "../pages/RegisterForm/RegisterForm";
import Login from "../pages/Login/Login";
import NewMovie from "../pages/NewMovie/NewMovie";
import OldMovie from "../pages/OldMovie/OldMovie";

const components = {
    homepage: {
        url: "/",
        component: HomePage
    },
    register: {
        url: "/register",
        component: RegisterForm
    },
    profile: {
        url: "/profile",
        component: ProfilePage
    },
    movieinfo : {
        url: "/movieinfo/:id",
        component:  MovieInfoPage
    },
    login : {
        url: "/login",
        component: Login
    },
    newmovie : {
        url: "/newmovie",
        component: NewMovie
    },
    oldmovie : {
        url: "/oldmovie",
        component: OldMovie
    }
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
        components.newmovie,
        components.oldmovie
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