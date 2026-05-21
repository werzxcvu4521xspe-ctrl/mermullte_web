'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hotel, Calendar, LayoutDashboard, LogOut, LogIn, Sparkles, Compass, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check initial user and verify admin rights
    const checkInitialUser = async () => {
      if (typeof window !== 'undefined' && localStorage.getItem('mermullet_dev_bypass') === 'true') {
        const mockUser = JSON.parse(localStorage.getItem('mermullet_mock_user') || '{}');
        setUser({
          email: mockUser.email,
          user_metadata: {
            avatar_url: null
          }
        });
        setIsAdmin(true);
        return;
      }

      try {
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
      } catch (err) {
        setIsAdmin(false);
      }
    };

    checkInitialUser();

    // Listen to Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (typeof window !== 'undefined' && localStorage.getItem('mermullet_dev_bypass') === 'true') {
        return;
      }

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
        <Link href="/" className={styles.logoContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="mermullet" className={styles.logoImg} />
        </Link>

        <nav className={styles.nav}>
          <Link href="/brand" className={`${styles.navLink} ${pathname === '/brand' ? styles.active : ''}`}>
            <span>브랜드 소개</span>
          </Link>

          <Link href="/about" className={`${styles.navLink} ${pathname === '/about' ? styles.active : ''}`}>
            <span>호텔 소개</span>
          </Link>

          <Link href="/experiences" className={`${styles.navLink} ${pathname === '/experiences' ? styles.active : ''}`}>
            <span>이벤트 & 경험</span>
          </Link>

          <Link href="/blog" className={`${styles.navLink} ${pathname === '/blog' ? styles.active : ''}`}>
            <span>블로그</span>
          </Link>

          {isAdmin && (
            <Link href="/admin" className={`${styles.navLink} ${pathname.startsWith('/admin') ? styles.activeAdmin : ''}`}>
              <span>관리 대시보드</span>
            </Link>
          )}
        </nav>

        <div className={styles.authWrapper}>
          <Link href="/booking" className={styles.reserveBtn}>
            <span>실시간 예약</span>
          </Link>

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
                <div className={styles.avatarFallback} title={user.email}>
                  {user.email?.substring(0, 2).toUpperCase()}
                </div>
              )}
              <button
                onClick={async () => {
                  if (typeof window !== 'undefined' && localStorage.getItem('mermullet_dev_bypass') === 'true') {
                    localStorage.removeItem('mermullet_dev_bypass');
                    localStorage.removeItem('mermullet_mock_user');
                    setUser(null);
                    setIsAdmin(false);
                    window.location.href = '/login';
                    return;
                  }
                  try {
                    await supabase.auth.signOut();
                  } catch (e) {}
                  window.location.href = '/login';
                }}
                className={styles.logoutBtn}
                title="로그아웃"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginIconBtn} title="로그인">
              <LogIn size={16} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
