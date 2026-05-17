'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hotel, Calendar, LayoutDashboard } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoGold}>Mermullet</span> Hotel
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
            <Hotel size={18} />
            <span>호텔 소개</span>
          </Link>
          
          <Link href="/booking" className={`${styles.navLink} ${pathname === '/booking' ? styles.active : ''}`}>
            <Calendar size={18} />
            <span>실시간 예약</span>
          </Link>
          
          <Link href="/admin" className={`${styles.navLink} ${pathname.startsWith('/admin') ? styles.activeAdmin : ''}`}>
            <LayoutDashboard size={18} />
            <span>관리 대시보드</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
