import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoGold}>Mermullet</span> Hotel
          </div>
          <p className={styles.tagline}>
            영혼을 깨우는 파도 소리와 최고의 품격, 럭셔리한 서비스로 여러분의 소중한 휴식을 더욱 특별하게 만듭니다.
          </p>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.meta}>
          <div className={styles.info}>
            <p>Mermullet Hotel & Resort | 대표자: 장유찬</p>
            <p>서울특별시 강남구 테헤란로 123 (역삼동) | 사업자등록번호: 123-45-67890</p>
            <p>대표전화: 02-1234-5678 | 이메일: reserve@mermullet.com</p>
          </div>
          
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Mermullet Hotel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
