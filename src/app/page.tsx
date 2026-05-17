import NewGifts from "../components/new-gifts/NewGifts";
import Promo from "../components/promo/Promo";
import TelegramSection from "../components/telegram-section/TelegramSection";

export default function Home() {
  return (
    <main>
      <Promo />
      <NewGifts />
      <TelegramSection />
    </main>
  );
}