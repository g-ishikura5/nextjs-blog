import styles from "./footer.module.css";
import utilStyles from "../styles/utils.module.css";

const Footer = () => {
  return (
    <div className={`${styles.footer} ${utilStyles.center}`}>
      <div className={`${styles.displayArea} ${utilStyles.spaceBetween}`}>
        <div className={styles.companyNameArea}>
          <div className={styles.companyName}>NeutCode株式会社</div>
          <a href="https://neutcode.com/" target="_blank">
            <img
              className={styles.logoArea}
              src="/images/logo.png"
              alt="neutcode"
            />
          </a>
        </div>
        <div>
          <h4>LINKS</h4>
          <ul className={styles.link}>
            <li>
              <a href="https://neutcode.com/index.html" target="_blank">
                {">"} Home
              </a>
            </li>
            <li>
              <a href="https://neutcode.com/company.html" target="_blank">
                {">"} Company
              </a>
            </li>
            <li>
              <a href="https://neutcode.com/recruit.html" target="_blank">
                {">"} Recruit
              </a>
            </li>
            <li>
              <a href="https://neutcode.com/contact.html" target="_blank">
                {">"} Contact
              </a>
            </li>
            <li>
              <a href="https://neutcode.com/privacy.html" target="_blank">
                {">"} Privacy policy
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4>OFFICE</h4>
          <div className={styles.office}>
            <div>〒100-0004</div>
            <div>東京都千代田区大手町1-7-2</div>
            <div>東京サンケイビル 27F</div>
            <div className={utilStyles.marginTop20px}>TEL: 現在非公開</div>
            <div>MAIL: info@neutcode.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
