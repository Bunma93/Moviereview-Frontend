import React from "react";
import styles from '../About/About.module.scss';
import Logo from '../images/Logo.png'

function About() {
    return (
    <div className={styles.container}>
        <div className={styles.about}>
            <div className={styles.header}>About us</div>
            <div className={styles.year}><i>2023-2024</i></div>
            <div className={styles.text}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas ab ducimus odio laborum quia! Voluptas inventore et similique mollitia laudantium nemo eveniet quisquam nobis reprehenderit nesciunt, ex atque beatae quia.</div>
        </div>
        <div>
            <img src={Logo} className={styles.Logo}></img>
        </div>
    </div>
)};

export default About;