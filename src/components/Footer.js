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
            <p>Mermullet Stay (머물렛 스테이) | 대표자: 정난숙</p>
            <p>대전광역시 동구 창조 1길 43 3,4층 (대전역 도보7분) | 사업자등록번호: 196-40-01102</p>
            <p>대표전화: 010-5428-4120 | 이메일: nancy0105@naver.com</p>
          </div>
          
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Mermullet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
