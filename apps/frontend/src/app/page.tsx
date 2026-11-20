import Promo from "../components/promo/Promo"
import TelegramSection from "../components/telegram-section/TelegramSection"

export default async function Home() {
  return (
    <main>
      <Promo />
      {/* <NewGifts /> */}
      <TelegramSection />
    </main>
  )
}