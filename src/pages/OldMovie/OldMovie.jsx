import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import styles from "./OldMovie.module.scss";
import MoviePoster from "../../component/movieposter/movieposter";
import { Link } from 'react-router-dom';
import Footer from "../../component/Footer/Footer";

function OldMovie({ }) {
    const [oldMovieList, setOldMovieList] = useState([]);
    const fetchmovielist = async () => {
        try {
            const httpResponse = await axios.get("/movie");
            const allMovies = httpResponse.data;
    
            // แยกหนังใหม่ (Atcinema === 1) และหนังเก่า (Atcinema === 0)
            const oldMovies = allMovies.filter(movie => movie.Atcinema == 0);
    
            setOldMovieList(oldMovies);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลหนัง:", error);
        }
    };

    useEffect(() => {
        fetchmovielist();
    }, [])

    return (
        <div>
        <div div className={styles.container}>
             <div className={styles.coverPage_Profile}>
                <img src="/image/pngtree-movie-film-black-minimalist-image_785393.jpg"/>
            </div>
            <div>
                <div className={styles.container_header}>
                    หนังเก่านอกโรงภาพยนต์
                </div>
                <div className={styles.container_movie}>
                    {oldMovieList.map((list, index) =>{
                    let movielangArr = [];
                    try {
                        movielangArr = list.lang ? JSON.parse(list.lang) : [];
                        console.log(movielangArr);
                    } catch (error) {
                        console.error("Error parsing lang:", error);
                    } 
                        return (
                        <Link to={`/movieinfo/${list.id}`}>
                            <MoviePoster 
                                moviename={list.title} 
                                moviepic={list.posterimagePath} 
                                moviedate={list.date}
                                movieage={list.age}
                                movielang={movielangArr}
                                className={styles.movielist}
                            />
                        </Link>
                        )
                    })}
                </div>
            </div>
        </div>
            <Footer/>
        </div>
    )
}

export default OldMovie;