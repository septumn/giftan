import styles from './Header.module.css';
import LogoBlock from './LogoBlock';
import SearchBlock from './SearchBlock';
import HeaderActionsBlock from './HeaderActionsBlock';
import HeaderNavMenuBlock from './HeaderNavMenuBlock';
import Image from 'next/image';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <LogoBlock />

          <SearchBlock />

          <HeaderActionsBlock />
        </div>

        <HeaderNavMenuBlock />
      </div>
    </header>
  )
}

export default Header;