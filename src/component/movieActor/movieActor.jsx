import React from "react";
import styles from '../movieActor/movieActor.module.scss'

function Movieactor({actorname,actorpic}) {
    let actorImage = `http://localhost:8000/${actorpic}`
    return (
        <div className={styles.container}>
            <div className={styles.actorImage}>
                <img src={actorImage}></img>
            </div>
            <div>{actorname}</div>
        </div>
    )
}

export default Movieactor;