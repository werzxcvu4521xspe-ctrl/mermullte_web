import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Compass, Sparkles, MapPin, Calendar, Heart } from 'lucide-react';
import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      
      {/* 1. Hero Block */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <p className={styles.heroSub}>MERMULLET</p>
          <h1 className={styles.heroTitle}>고요 속에서 마주하는 안식처</h1>
        </div>
      </section>

      {/* 2. Hotel Overview */}
      <section className={styles.section}>
        <div className={`${styles.introGrid} container`}>
          <div className={styles.introLeft}>
            <p className={styles.heroSub}>ABOUT THE STAY</p>
            <h2>비우고 채워지는,<br />가장 따뜻한 머무름.</h2>
            <p>
              머물렛은 단순히 잠을 자는 숙소를 넘어, 나를 둘러싸고 있는 자연의 소리와 빛의 무게감을 몸으로 느끼는 감각적인 휴식처입니다. 
              소박하게 정돈된 공간은 복잡한 바깥세상으로부터 온전한 방패막이가 되어 줍니다.
            </p>
            <p>
              가장 부드러운 해 질 녘 빛이 리넨 커튼 틈으로 새어 들 때, 따뜻하게 달궈진 도자 찻잔을 손끝으로 맞잡고 
              이곳에 머무는 매 순간의 고요를 조용히 응시해 보세요.
            </p>
            <Link href="/booking" className="btnDark" style={{ marginTop: '20px' }}>
              <Calendar size={16} />
              <span style={{ marginLeft: '8px' }}>예약 신청하기</span>
            </Link>
          </div>
          
          <div className={styles.introRight}>
            <div className={styles.introImgBox}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/room1.jpg" 
                alt="Minimal organic hotel details" 
                className={styles.introImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Facilities Section */}
      <section className={styles.section} style={{ backgroundColor: '#E7DED2' }}>
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p className={styles.heroSub}>EXCLUSIVE FACILITIES</p>
            <h2 className={styles.heroTitle} style={{ color: 'var(--accent-dark)' }}>차분함을 더하는 공간들</h2>
          </div>

          <div className={styles.facGrid}>
            {/* Facility 1 */}
            <div className={styles.facCard}>
              <div className={styles.facImgBox}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/dining.jpg" 
                  alt="Spa Room" 
                  className={styles.facImg}
                />
              </div>
              <div className={styles.facInfo}>
                <h3>Forest Spa</h3>
                <p>자연 에센셜 오일과 흙의 따스함을 조화시킨 머물렛만의 프라이빗 아로마 스파 스튜디오입니다.</p>
              </div>
            </div>

            {/* Facility 2 */}
            <div className={styles.facCard}>
              <div className={styles.facImgBox}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/lamps.jpg" 
                  alt="Tea Lounge" 
                  className={styles.facImg}
                />
              </div>
              <div className={styles.facInfo}>
                <h3>Warm Tea Lounge</h3>
                <p>선별된 찻잎과 정갈한 도자 다구들이 가지런히 놓인 소박하고 따뜻한 찻자리 공간입니다.</p>
              </div>
            </div>

            {/* Facility 3 */}
            <div className={styles.facCard}>
              <div className={styles.facImgBox}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/menu.jpg" 
                  alt="Clay Library" 
                  className={styles.facImg}
                />
              </div>
              <div className={styles.facInfo}>
                <h3>Clay Library</h3>
                <p>사색을 도와주는 도서 컬렉션과 투박한 흙점토 오브제들이 어우러진 조용한 서재 공간입니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Directions (Map) Section */}
      <section className={styles.section}>
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className={styles.heroSub}>LOCATION MAP</p>
            <h2 className={styles.heroTitle} style={{ color: 'var(--accent-dark)' }}>오시는 길</h2>
          </div>

          <div className={styles.mapWrapper}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!11m18!1m12!1m3!1d3165.105417387349!2d127.02534597641031!3d37.49830307205847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca15a31a98075%3A0xe54e6015cae4c0e6!2z7Jet7IK87Jet!5e0!3m2!1sko!2skr!4v1716000000000!5m2!1sko!2skr"
              width="100%" 
              height="100%" 
              style={{ border: 0, opacity: 0.85 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-secondary)' }}>
            <MapPin size={20} style={{ verticalAlign: 'middle', marginRight: '6px', color: 'var(--accent-gold-hover)' }} />
            <span>서울특별시 강남구 테헤란로 123 (역삼동) | 대표전화 02-1234-5678</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
