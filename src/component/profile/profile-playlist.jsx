import React from "react";
import MoviePoster from '../../component/movieposter/movieposter';

function Playlist({headerName, moviename, moviepic, movieage, movielang}) {
    return (
        <div>
            <div className="profile-container-playList">
                <div>
                    <div>
                        <div>{headerName}</div>
                        <a href="#">แก้ไข</a>
                    </div>
                    <div>+</div>
                </div>
                <div>
                   <MoviePoster 
                        moviename={moviename} 
                        moviepic={moviepic}
                        movieage={movieage}
                        movielang={movielang}
                    />
                </div>
                <hr/>
            </div>
        </div>
    )
}

export default Playlist;