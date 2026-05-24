import Link from "next/link"
import styles from "./TelegramSection.module.css"

const TelegramSection = () => {
  return (
    <section className={styles.telegramSection}>
      <h1>Быстрый заказ</h1>
      <p>Покупайте и продавайте подарки без регистрации!</p>
      <Link href="https://t.me/giftan_bot" target="_blank" className={styles.telegramBtn}>
        <i className="fab fa-telegram-plane"></i>
        <span>Telegram</span>
      </Link>
    </section>
  );
}

export default TelegramSection