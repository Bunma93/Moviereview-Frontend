import React, { useEffect, useRef } from "react";
import styles from './movieposter.module.scss'

function Movieposter({moviename, moviepic, moviedate, movieage, movielang = []}) {
    console.log("moviepic:", moviepic);
    console.log("movielang หน้าโปสเตอร์", movielang)
    const imageUrl = moviepic ? `http://localhost:8000/${moviepic}` : "";

    console.log("Image URL:", imageUrl); // ตรวจสอบ URL ของภาพ

    const date = new Date(moviedate);
    const formattedDate = isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('th-TH', {
        month: 'long',
        day: '2-digit',
    }).format(date);

    const movieLangArray = Array.isArray(movielang) ? movielang : (typeof movielang === "string" ? movielang.split(',') : []);
    return (
        <div>
            <div className={styles.Movie_List}>
            <img 
                src={imageUrl} 
                alt="Movie Poster" 
                className={styles.Movie_Background}
            />
                <div className={styles.Movie_List_Name}>{moviename}</div>
                <div className={styles.Movie_List_Date}>{formattedDate}</div>
                <div className={styles.Movie_List_Age}>{movieage}</div>
                <div className={styles.Movie_List_Lang}>
                    {movieLangArray
                        .filter(item => item !== undefined && item !== null)
                        .map((item, index) => (
                            <div key={index}>{item}</div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Movieposter;