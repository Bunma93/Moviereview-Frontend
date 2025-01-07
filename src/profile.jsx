import {React, useState, useEffect} from "react";
import "./profile.scss"
import Playlist from "./component/profile/profile-playlist";
import Review from "./component/profile/profile-review";
import axios from "./config/axios";
import { Link } from 'react-router-dom';
import { Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function Profile() {
    const [userProfile, setUserProfile] = useState([]);
    
    //ดึงข้อมูลหนังทั้งหมด
    const fetchUserProfile = async () => {
        const httpResponse = await axios.get("/user/profile");
        setUserProfile(httpResponse.data);
    };

    useEffect(() => {
        fetchUserProfile();
    },[]);
    return (
        <div>
            <div className="coverPage-Profile">
                <img src="userProfile.posterimagePath" />

            </div>
            <div>
                <Avatar size={200} icon={<UserOutlined />}/>
                <div>dd{userProfile.name}</div>
            </div>
            <div>
                <div>followed 1700</div>
                <button>ติดตาม</button>
            </div>
            <div className="profile-container">
                <div className="profile-container-myPlaylist">
                    <div>เพลลิสหนังของฉัน</div>
                    <Link to="/playlist">
                        <button>สร้างเพลลิส</button>
                    </Link>

                </div>
                {/* เพลลิส */}
                <Playlist headerName={"หนังผีไทย"} movieImage={"#"}/>
                <Playlist headerName={"หนังตลก"}/>
                <Playlist headerName={"หนังดราม่า"}/>
            </div>
            <div className="profile-review">
                <h1>รีวิวของฉัน</h1>
                {/* รีวิว */}
                <div className="profile-review-container">
                    <Review name={"พี่มาก..พระขโนง"}/>
                    <Review  name={"หลานม่า"}/>
                    <Review  name={"หลวงพี่เท่ง"}/>
                </div>
            </div>
        </div>
    )
}

export default Profile;