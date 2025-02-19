import React, {useEffect, useState} from 'react';
import "./HomePage.scss"
import { Link } from 'react-router-dom';
import Movieposter from '../../component/movieposter';
import axios from 'axios';
import { Carousel } from 'antd';
import Admin from "../Admin/Admin";
import About from '../../component/About/About';
import Footer from '../../component/Footer/Footer';

function HomePage({isLoggedIn, setIsModalOpen}) {
    const [movielist, setmovielist] = useState([]);
    
    //ดึงข้อมูลหนังทั้งหมด
    const fetchmovielist = async () => {
        const httpResponse = await axios.get("http://localhost:8000/movie");
        setmovielist(httpResponse.data);
    };

    const openModal = () => setIsModalOpen(true);

    useEffect(() => {
        fetchmovielist();
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
        <div className='container'>
            {/* ปกด้านบน */}
            {movielist.map((list, index) => (<div className='coverPage'  key={index}>
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
            ))}
            <div className='coverImage'>
                <Carousel autoplay>
                    <div>
                      <div style={contentStyle}>
                        {movielist.map((list, index) => (
                            <div className='coverPage' key={index}>
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
            <div className='Movie'>
                <div>กำลังฉายในโรงภาพยนต์</div>
                <div>เพิ่มเติม<span>รุปลูกศร</span></div>
            </div>
            <Admin/>
            <div className='Movie-Container'>
                <Movieposter moviename={"ตาคลีเจเนซิส"} moviepic={"image/thumb_3714.jpg"} />    
                <Movieposter moviename={"ธี่หยด"} moviepic={"image/TeeYod.jpg"} />
                <Movieposter moviename={"ธี่หยด"} moviepic={"image/TeeYod.jpg"} />
                <Movieposter moviename={"ธี่หยด"} moviepic={"image/TeeYod.jpg"} />
            </div>

            {/* หนังเก่า */}
            <div className='Movie'>
                <div>หนังเก่านอกโรงภาพยนต์</div>
                <div>เพิ่มเติม<span>รุปลูกศร</span></div>
            </div>
            <div className='Movie-Container'>
                <Movieposter moviename={"ตาคลีเจเนซิส"} moviepic={"image/thumb_3714.jpg"} />    
                <Movieposter moviename={"ธี่หยด"} moviepic={"image/TeeYod.jpg"} />
                <Movieposter moviename={"ธี่หยด"} moviepic={"image/TeeYod.jpg"} />
                <Movieposter moviename={"ธี่หยด"} moviepic={"image/TeeYod.jpg"} />
            </div>

            {/* ผู้คนที่ฉันติดตาม */}
            <div className='followed-Header'>คนที่คุณกำลังติดตาม</div>
            <div className='followed'>
                <div className='followed-list'>
                    <div className='followed-list-Pic'></div>
                    <div className='followed-list-Name'>Jan Doe</div>
                    <div className='followed-list-movieName'>พี่มากพระขโนง</div>
                    <div className='followed-Date'>23/09/67 20.11 น.</div>
                    <div className='followed-Comment'>A restless king promises his lands to the local tribals in exchange of a stone (Panjurli, a deity of Keradi Village) wherein he finds solace and peace of mind.</div>
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
