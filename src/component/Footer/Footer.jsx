import React from "react";
import styles from '../Footer/Footer.module.scss'

function Footer() {
    return (
        <div className={styles.container}>
            <div className={styles.containerInfo}>
                <div  className={styles.containerInfo_box}>
                    <div className={styles.followHeader}>
                        <div>Follow Me on social</div>
                        <div className={styles.container_SocialMedia}>
                            <a href="https://www.facebook.com/bpatipongsakorn.bunma?locale=th_TH">
                                <span className={styles.container_Logo}>
                                    <img className={styles.Logo} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFVUlEQVR4nO2dXYxfQxTAr7aU4GFDfZX4qDS0VcSjSESEICgtfVGCVEJMiK82Flk80NiXDSEiikSECoJG4iu7pV1tNNHWppLqrvp80G4REluqP5n0SDYbanfu3JkzM/eX3DTZ7G7Oub/t/945M3OmqlpaWlpaWlpaWgoEmAzMAq4ElgLPAWuATcAgsBPYJddO+dom+Z7l8jP2Z0+1vyt2PkkCnATcBKwAhvHHr8D7wBLgLGBS7FzVAhwvN2or4fgGeBSYGTt/FQD7A9cC/cRnDbAImFKVBnCAiNiCPr4CbgMOqnIH2A+4AfgB/XwHXGdjrnIEmAusJj0+Bk6rcgGYCnQDf5IufwDL7EdtlcGb0yfkw3pgRpUiwDwZqOXGL8DCKiWALvLn/iqRMseTlMMTakf78vB+lfJ4Rd3D3v6VSN2pVN5QVbgEemLfEQU8VWkAeDD2nVDEfbFlLIh9B5Sxx869xJIxA/g59h1QyE/AiTHeqOyoVSsjwLvycXo1cK7U0o4DOuRfOwl2ukxUnQdcBtwKPOKh+Lku6JuX1KY0sgG4ETikZn59HmJZ5u+O7zvYuQoLhTtkcsnLIM2TEFuQnOMjnv+bz9BWQv8UmO45Tx9CLKsanU+RySVN9AOHNpCnLyGWRb7j+yfIA4Hv0cPXwLSGcu3zvJDC/wMeuBld7/sXek+yGSGWxU2sDhlCD697TbB5IYNeV7PIChFNnOktuTBCLNf4DFDTNOx6b4mFFbLaV3Az0cWSmvlMA84Gzt/HtbGh5179+XjgYXRxhmMe02XeYnfE2Lt8DATtSj4t/OYyGgeOUfLKvrXWQFGKb5pY65jHSvQwu46Q29HFS461N02YOkLeRBfdGcxovlZnSY+dbNFEp0Mevehi2KkqLdvItHGXQx4aHuZjOcVFyBXowzjkEfM197+43EWI3SyZtBD2Vqg1co+LkOdJX8jB6ORZFyF2o4o2TCZCVrkIGUAfJhMhG12EbEMfJhMhQy5CfG7Y94XJRMh2FyG2VYU2TCZCRjQL6ZHVhB3juKY6VKs7HK6mKxS7XISE2h8YZoXfOAGOCJDzDpfAvqVMIecEyHmbS2BfUKaQxQFyHnAJzC6DLFFId4Cce10Cs82/ShSyMkDOz7gE1kmZQr4MkPNSl8AWUpgQ9raNCrHVYoFLcLZHYWlCZmueoLKDqh8LEzI/QL7bnZcCBVrkoEnIvaoXigN3BwjQSr9qnNfJE4x/ygR+t70+CJDvHSl8ppZUXJzlLESS2oweTOJCPq8lQ5J6CD2YxIU84EPIHPRgEhdS7+NqVGIfoQOTsJA+LzKUNZkxCQuZ51PIZCWbPk2iQoa8NzizNyN2VqQr5BavMkZtjQ5RCc1NyGBjnYECVoBzEjK/ERmjCo5rIyZnEhPS33gzfynL/x4pQZOQkJFgTfxts8dISZqEhEx8VtAVqaLGaPFnEhGyLvhJPcAJMtkSEpOAkOFoJyhIG4qQW8aMciH2XlzU3B0fX9L2ZLVQGOVCJrwptRGAxwIlbBQLebzSgoxPni5YyHJ1x1ZIAfLFAoW8oE7GmP8pXQUJ6VEr418qw39lLGS3bUtepQRwcQPjFKNAiO2ifUmVIsCRwHsZCekFjq1SRh72nZ4KkiaSkBHJQc+xRnWR4yHeSVDIh7bCXeWKLJjYnICQLbYjUlUCcqrbpcBnCoUMSOPoIs9VnyQn27w1ziKlaUiI3aTztsSS53Hdjn11O2WeZU8gIRukOHp0c5llAHCUnFWyYkwTnLpCbLu/l4HrbS/f5jLIHOAw4IKJzlHLnsE7Zd7m8OYibGlpaWlpaWlpqVTzN2F2x39rAiE5AAAAAElFTkSuQmCC" alt="facebook-new">
                                    </img>
                                </span>
                            </a>
                            <a href="https://www.instagram.com/james_myj/">
                                <span className={styles.container_Logo}>
                                    <img className={styles.Logo} src="data:image/png;base64,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" alt="instagram-new--v1">
                                    </img>
                                </span>
                            </a>
                            <span className={styles.container_Logo}>
                                <img className={styles.Logo} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADjElEQVR4nO2cy4tOcRjHj1HCygKlJte1lRUG/8HIrWRhgZlk61JGGuUSe4qtwcZlQWxckluUW6HcL9MkScykRjF8dPIsTq/B+x7P+z7nvPP91Lt7O7/v83zP+Z3zuz1JIoQQQgghhBBCCCGEEEIIkQNgHDADmAcsBlYBncBmoBvYBxwCjgCngPPALeC2/R4DLzK/PuBj5tfP7/RX/Kev4hqPM9e/ZW2eMg2HTFO3aew0zYsthjSWcYW7GYAWYAGwBegB7gEDNC8DFmOPxZzG3hKV+PXAm+iMFIA39sQ0xghgMnAlOuoCchmY1IjkP42OtMA8qZsJ1u1cjY6wJE+Cf3dkfb6ojo563P164VbPK9enAFhYQ+PiFws8DdhmFxXV0+VpQDpiFLVxwtOAdCgvauO5V/JHA99qbFzA1zR3HgZMVTZz0+phQDrhJPIx38OAFTkbF7DMw4AOZTI3az0MSOe9RT42eRiwJ2fjAnZ5GHAgOJPfbfnwIjBUMlf3exhwLDiI9Rkts82IsnDUw4BzwUGMGUbTkpKMzs96GHAjMoLkz7rGAluBzxSX6x4GpLsAwkj+rW+KbStJ3xVF446HAY8iI0iq1zkHuEaxeOBhwLPICJLatI6ykftrisETDwNCg0nyaR4P7AAGo5cmPQx4GxlB8n/aW4HDwI8g+X0eBnwgkMQBYFHQx8R7D/EDZTcgs7NjNfCugfL7k/8F+EIgiTPABOB0g+QPeggO/b5O6gAws0HyhzzENqMBs8pkQDN2QWfK1AXpJRz8Em6Wz9D7Zf0M1UAseCCmqYjgqQhNxgVPxmk6Ong6WgsywQsyWpIMXpLUonzwonz0tpQNI31bShE2Zl1I76aRujFrd3QUJWanhwFp9RCRj40eBqzL2biANR4GLFcmc7PUwwAdUQo+oqRDesGH9HRMNfKYqplQhq3gzXlQ2ww4GR1NCTnuaUBXdDQlZKunASpXE1yupqVAW77LwEv3smVWmlFUxzrX5GeegrQgnfg7l+pWQzQtyWilGcXwpOWRJ9Yl+RUm6EkY/s6vb/IruqMOqw440nllM8ZhNaTbMsW77/6hsnmz8MliPGwxt4Uk/l/YIerpwFygHVhpX1Ebge3AXjvb22Oj7LQWxM1MeflHFaXne3OUr++tuMbDzPVvWpsnTcNB07TdNHaa5naLYVoaU3RehRBCCCGEEEIIIYQQQgiRlJKfo1QS24BbiV0AAAAASUVORK5CYII=" alt="youtube-play">
                                </img>
                            </span>
                            <span className={styles.container_Logo}>
                                <img className={styles.Logo} src="data:image/png;base64,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" alt="twitterx--v2">
                                </img>
                            </span>
                            <span className={styles.container_Logo}>
                                <img className={styles.Logo} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEkElEQVR4nO2dS6hXRRzHz9UUjcRWZg97mWXZYxM9VkGZteihYS2sRQghWEtbBK0SHxVBLaIkNDAzgmpXUbQp2kW0KbXHjR7K3SmiEvTwE1Nz6XTv3zNzzvzO63++H7jLO/Ob+Zw5M2f+88gyIYQQQgghhOgBwHzgIWA/cAg4iTjp62K/r5v5Tcl4AJhU/Qf5AVhXp4g5wHPhOMQMnnV1V4eQ52fmJKLZWcdrSqSx1rIDd+9DkcakSUfvRwzChvUWQt4yCkbAPgsh36kmzThkIeSEXTyD54SFEGGIhHQMCekYQxRyHDha8PdHm8ENUch1gfK822ZwQxRybaA8T7cZnITMALhTQpplVUDIWcCRtqRkqTBmQhzA9raCy1Khf1wTUaYlwLE2gpOQMwA8ISHdEjIX+LBpKTGxhQLvGytLlG0R8FWTwQ1RyNUly3ce8HlTwQ1RyMqKP1O/ApyuO7ghCrkqoaw3Ap/VGZyEVAC4GXgR+ElC0rmyioQCOYuBW4C/DGIbZAtZYWJidj38aRGcRSB9Y4WJgdn1ICEVuSJQsZslpFtCjgD3qoV0R8gU8Btwl15ZzbA8Qojjd+DxWCnqQ6pzeaSQaT4ALpOQ8pyOfErLCpluLa/7D8IJtZDZ/Ay87FferwLODlRonsKnPeL/Xd77gC3AI8A9wIND/TD8CFhdtAWsASG10hchB4HbI+MJVeilEpLGbmBhiQdkSkLq66SfqtBipwLpXqIWUo3SMiKFXJwVoD5kNHuKKq0ICbHn2/wwtgYhyxL/v1aqljtfAGtWl/ytew2wA9gLvAGcCqQvISX4JFLEBLAROFxB+EWBtNVCctwdIWOBP1GnKhISiXva50a0jDdJ40K1kDh2RbSORxNlSEgJHo7Yt/GLgZAL1ELiuCFQUXdgw/kSEse5gYp6RkIiMJy3CnXoe4zyWqoWYiNkt5GQRYF83F711shSMYxlcSCfrQZ5HIsYVuvgAM/1DXTq7wXyWEbLZKkYxrIhkM+8ilMleQqPZXUzBbRMl4S8GpHXxoT0Pz3TipFc+m6SslW6JOTX0Pm1/PuOf7tC2odDs7w+/a9pmS4JcayJyG8h8E6JNA/EbGPzu6Nap2tCPo7McwLYFJgqd0cPbgPOiUyzSssbeyHELvfJTcW7hWov+Ap1Leclv4CucBg9onWYLHRLJTbmosLUsQYretlPKn709gUdwaJAdfBacmA9PbPeokB18WRycAGAx+gYWSo1xubmt7YkB1gsw2RfoCVZKg3EuMt13smB/r/PcIOATpKl0lCc3wC3GcR6E/AlHaYvQqZ534kJTYGMiPFWf9poJ4a24yRkmh/998Y6t+/c/d4+45yr5W4nrX81uZWQvaGvQkZxahxugxsnIWOBhHQMCRlDIbrQxY7jFkJ6NYrpOActhKQufhb/sddCiK7N69i1eW5u6HvDoIbKpNkN0v6LWaTNbN9nIiMnRTdFV2eHqYzc9d3uKmpRrmXsrOX67pyYtepTonA3pN5fm4gRHf16f4yRW7Sgj0f+qYMDfuu2q5t5jcgQQgghhBBCiCyNvwGeDTiNSgYDTwAAAABJRU5ErkJggg==" alt="tiktok--v1">
                                </img>
                            </span>          
                        </div>
                    </div>
                    <div className={styles.followHeader2}>
                        <div className={styles.followHeader_text}>
                            <div className={styles.followHeader2_text_main}>Get the app</div>
                            <div className={styles.followHeader2_text_sub}>For Android and iOS</div>
                        </div>
                        <div className={styles.container_SocialMedia}>
                          <span className={styles.qrcode}><img src="/image/james_myj_qr.png"></img></span>
                        </div>
                    </div>
                </div>
                <div className={styles.followLink}>
                    <div>
                        <a href="#">Help</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Advertising</a>
                        <a href="#">Cookie Notices</a>
                    </div>
                    <div>
                        <a href="#">Condition of Use</a>
                        <a href="#">Box office</a>
                        <a href="#">License Thaireview Data</a>
                        <a href="#">Site index</a>
                        <a href="#">Jobs</a>
                    </div>
                </div>
            </div>
            <div>
                <div className={styles.copyright}>© 2025 Thaireview. All Right Reserved</div>
            </div>
        </div>
    )
}

export default Footer;