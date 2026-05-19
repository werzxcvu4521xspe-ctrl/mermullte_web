'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hotel, Calendar, LayoutDashboard, LogOut, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check initial user and verify admin rights
    const checkInitialUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: adminRecord } = await supabase
          .from('admins')
          .select('*')
          .eq('email', user.email.toLowerCase())
          .single();
          
        setIsAdmin(!!adminRecord);
      } else {
        setIsAdmin(false);
      }
    };

    checkInitialUser();

    // Listen to Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        const { data: adminRecord } = await supabase
          .from('admins')
          .select('*')
          .eq('email', currentUser.email.toLowerCase())
          .single();
          
        setIsAdmin(!!adminRecord);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
          
          {isAdmin && (
            <Link href="/admin" className={`${styles.navLink} ${pathname.startsWith('/admin') ? styles.activeAdmin : ''}`}>
              <LayoutDashboard size={18} />
              <span>관리 대시보드</span>
            </Link>
          )}
        </nav>

        <div className={styles.authWrapper}>
          {user ? (
            <div className={styles.userInfo}>
              {user.user_metadata?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="avatar" 
                  className={styles.avatar} 
                />
              ) : (
                <div className={styles.avatarFallback}>
                  {user.email?.substring(0, 2).toUpperCase()}
                </div>
              )}
              <button 
                onClick={async () => {
                  await supabase.auth.signOut();
                }} 
                className={styles.logoutBtn}
                title="로그아웃"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginBtn}>
              <LogIn size={16} />
              <span>로그인</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
