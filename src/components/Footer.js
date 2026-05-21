import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoGold}>Stay in</span> Soft Light
          </div>
          <p className={styles.tagline}>
            자연의 온기와 빛으로 채워진, 오직 당신만을 위한 조용한 쉼의 공간입니다.
          </p>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.meta}>
          <div className={styles.info}>
            <p>Mermullet Stay (머물렛 스테이) | 대표자: 장유찬</p>
            <p>대전광역시 중구 은행동 123 (성심당 도보 3분) | 사업자등록번호: 123-45-67890</p>
            <p>대표전화: 042-123-4567 | 이메일: info@mermullet.com</p>
          </div>
          
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Mermullet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
