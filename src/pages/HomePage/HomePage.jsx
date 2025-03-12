import React, {useEffect, useState} from 'react';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import 'swiper/scss/scrollbar';
import 'swiper/scss/autoplay'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import styles from "../HomePage/HomePage.module.scss"
import { Link } from 'react-router-dom';
import axios from '../../config/axios';
import { Carousel } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import Admin from "../Admin/Admin";
import Movieposter from '../../component/movieposter';
import About from '../../component/About/About';
import Footer from '../../component/Footer/Footer';


function HomePage({isLoggedIn, setIsModalOpen}) {
    const [movielist, setmovielist] = useState([]);
    const [loading, setLoading] = useState(true);
    
    //ดึงข้อมูลหนังทั้งหมด
    const fetchmovielist = async () => {
        const httpResponse = await axios.get("/movie");
        setmovielist(httpResponse.data);
    };
    const openModal = () => setIsModalOpen(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchmovielist().then(() => setLoading(false));
        if (isLoggedIn === false) {
            openModal();
        }
    },[]);

    const contentStyle = {
        height: '500px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
      };

    return (
        <div className={styles.container}>
            {/* ปกด้านบน */}
            {/* {movielist.map((list, index) => (
                <div className='coverPage'  key={index}>
                <div><a href='#'>Today</a></div>
                <div className='movieList'>
                    <div className='movieSelect' style={{ backgroundImage: `url("image/fanday-poster.jpg")`}}>
                    <div dangerouslySetInnerHTML={{ __html: list.title }} />
                        <Link to="/movieinfo">
                            <button>อ่านรีวิว</button>
                        </Link>
                    </div>
                </div> 
            </div>
            ))} */}
            <div className={styles.coverImage}>
                <Carousel autoplay>
                    <div>
                      <div style={contentStyle}>
                        {movielist.map((list, index) => (
                            <div className={styles.coverPage} key={index}>
                                <div><a href='#'>Today</a></div>
                                <div className={styles.movieList}>
                                    <div className={styles.movieSelect} style={{ backgroundImage: `url("image/fanday-poster.jpg")`}}>
                                    <div dangerouslySetInnerHTML={{ __html: list.title }} />
                                        <Link to="/movieinfo">
                                            <button>อ่านรีวิว</button>
                                        </Link>
                                    </div>
                                </div> 
                            </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 style={contentStyle}>2</h3>
                    </div>
                    <div>
                      <h3 style={contentStyle}>3</h3>
                    </div>
                    <div>
                      <h3 style={contentStyle}>4</h3>
                    </div>
                  </Carousel>
                <img src="image/fanday.jpg" alt='fanday'/>
            </div>

            {/* หนังโรง */}
            <div className={styles.Movie}>
                <div>กำลังฉายในโรงภาพยนต์</div>
                <div>เพิ่มเติม<span>รุปลูกศร</span></div>
            </div>
            <Admin/>
            <div className={styles.Movie_Container}>
                {!loading && (
                    <Swiper
                        // install Swiper modules
                        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                        spaceBetween={26}
                        slidesPerView={4}
                        navigation
                        loop={true}
                        pagination={{ clickable: true }}
                        scrollbar={{ draggable: true }}
                        autoplay={{ 
                            delay: 3000, // หน่วงเวลา (3 วินาที)
                            disableOnInteraction: false, // ให้เลื่อนต่อ แม้มีการโต้ตอบ
                        }}
                        observer={true}         // ✅ ให้ Swiper อัปเดตเมื่อ DOM เปลี่ยนแปลง
                        observeParents={true}   // ✅ ให้ตรวจสอบ DOM ระดับพ่อแม่ด้วย
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 10 },  // หน้าจอเล็ก (มือถือ)
                            768: { slidesPerView: 2, spaceBetween: 15 },  // Tablet
                            1024: { slidesPerView: 3, spaceBetween: 20 }, 
                            1280: { slidesPerView: 4, spaceBetween: 26 }, // ค่าปกติที่ตั้งไว้
                            1900: { slidesPerView: 5, spaceBetween: 30 }, 
                        }}
                        onSwiper={(swiper) => console.log(swiper)}
                        onSlideChange={() => console.log('slide change')}
                    >
                        {movielist.map((list, index) =>{
                        let movielangArr = [];
                        try {
                            movielangArr = list.lang ? JSON.parse(list.lang) : [];
                        } catch (error) {
                            console.error("Error parsing lang:", error);
                        }
                            return (
                            <SwiperSlide key={list.id} className={styles.SwiperSlide}>
                                <Link to={`/movieinfo/${list.id}`}>
                                    <Movieposter 
                                        moviename={list.title} 
                                        moviepic={list.posterimagePath} 
                                        moviedate={list.date}
                                        movieage={list.age}
                                        movielang={movielangArr}
                                    />
                                </Link>
                            </SwiperSlide>
                            )
                        })}
                    </Swiper>
                )}
            </div>
                
            {/* หนังเก่า */}
            <div className={styles.Movie}>
                <div>หนังเก่านอกโรงภาพยนต์</div>
                <div>เพิ่มเติม<span>รุปลูกศร</span></div>
            </div>
            <div className={styles.Movie_Container}>
                <Movieposter moviename={"ตาคลีเจเนซิส"} moviepic={"image/thumb_3714.jpg"} />    
                <Movieposter moviename={"ธี่หยด"} moviepic={"image/TeeYod.jpg"} />
                <Movieposter moviename={"ธี่หยด"} moviepic={"image/TeeYod.jpg"} />
                <Movieposter moviename={"ธี่หยด"} moviepic={"image/TeeYod.jpg"} />
            </div>

            {/* ผู้คนที่ฉันติดตาม */}
            <div className={styles.followed_Header}>คนที่คุณกำลังติดตาม</div>
            <div className={styles.followed}>
                <div className={styles.followed_list}>
                    <div className={styles.followed_list_Pic}></div>
                    <div className={styles.followed_list_Name}>Jan Doe</div>
                    <div className={styles.followed_ist_movieName}>พี่มากพระขโนง</div>
                    <div className={styles.followed_Date}>23/09/67 20.11 น.</div>
                    <div className={styles.followed_Comment}>A restless king promises his lands to the local tribals in exchange of a stone (Panjurli, a deity of Keradi Village) wherein he finds solace and peace of mind.</div>
                </div>
                <div></div>
            </div>

            {/* About Us */}
            <About/>
            <Footer/>
        </div>
    )
}

export default HomePage;
