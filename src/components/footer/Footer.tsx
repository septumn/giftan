import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>Giftan</h3>
            <p>Маркетплейс телеграм подарков для любых поводов. Дарим внимание и радость с 2026 года.</p>
            <div className={styles.socialLinks}>
              <a href="https://t.me/gifton_bot" target="_blank"><i className="fab fa-telegram"></i></a>
              <a href="#"><i className="fab fa-vk"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
          <div className={styles.footerSection}>
            <h3>Категории</h3>
            <p><a href="#">Для неё</a></p>
            <p><a href="#">Для него</a></p>
            <p><a href="#">Хиты</a></p>
            <p><a href="#">Лучшие</a></p>
          </div>
          <div className={styles.footerSection}>
            <h3>Информация</h3>
            <p><a href="#">О нас</a></p>
            <p><a href="#">Доставка и оплата</a></p>
            <p><a href="#">Возврат</a></p>
            <p><a href="#">Отзывы</a></p>
          </div>
          <div className={styles.footerSection}>
            <h3>Контакты</h3>
            <p><i className="fas fa-phone"></i> +7 (999) 123-45-67</p>
            <p><i className="fas fa-envelope"></i> info@gifton.ru</p>
            <p><i className="fab fa-telegram"></i> @giftan_bot</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2026 Giftan. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;