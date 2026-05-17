import Link from 'next/link';
import styles from './Header.module.css'

const LogoBlock = () => {
  return (
    <Link href="/" className={styles.logo}>
      <i className="fas fa-gift"></i>
      <h1>Giftan</h1>
    </Link>
  );
}

export default LogoBlock;