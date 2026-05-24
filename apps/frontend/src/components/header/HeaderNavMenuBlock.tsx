import Link from 'next/link';
import styles from './Header.module.css';

const HeaderNavMenuBlock = () => {
  return (
    <nav style={{ marginTop: '20px' }}>
      <ul className={styles.navMenu}>
        <div>
          <li><Link href="/">Главная</Link></li>
          <li><Link href="/catalog">Каталог</Link></li>
        </div>
        <div>
          <li><Link href="/new-gifts">Новинки</Link></li>
          <li><Link href="/stars">Звёзды</Link></li>
        </div>
      </ul>
    </nav>
  );
}

export default HeaderNavMenuBlock;