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
          <p className={styles.heroSub}>MERMULLET ABOUT</p>
          <h1 className={styles.heroTitle}>고요 속에서 마주하는 안식처</h1>
        </div>
      </section>

      {/* 2. Hotel Overview (Daejeon Origin) */}
      <section className={styles.section}>
        <div className={`${styles.introGrid} container`}>
          <div className={styles.introLeft}>
            <p className={styles.heroSub}>THE ORIGIN</p>
            <h2>교통의 허리 대전에서,<br />쉼의 첫걸음을 내딛다.</h2>
            <p>
              머물렛의 이 가슴 설레는 여정은 대한민국의 허리이자 교통의 중심지인 '대전'에서 첫발을 내딛습니다. 
              대전은 서울에서도, 부산에서도, 광주에서도 KTX를 타면 1시간 남짓이면 닿을 수 있는 가장 가깝고 편리한 도시입니다.
            </p>
            <p>
              누군가는 대전을 '노잼(재미없는) 도시'라고 부르기도 하지만, 머물렛이 바라본 대전은 숨겨진 보물 같은 매력과 따뜻함이 가득한 곳이었습니다. 
              우리의 일상과 아주 가까운 대전에서, 굳이 머나먼 비행을 떠나지 않고도 온전한 비일상을 만날 수 있도록 돕습니다.
            </p>
            <Link href="/booking" className="btnDark" style={{ marginTop: '20px' }}>
              <Calendar size={16} />
              <span style={{ marginLeft: '8px' }}>머물렛 예약 신청</span>
            </Link>
          </div>
          
          <div className={styles.introRight}>
            <div className={styles.introImgBox}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/sunlight.jpg" 
                alt="Minimal organic hotel details" 
                className={styles.introImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 3 Sensory Experiences Section (Awakening the 5 Senses) */}
      <section className={styles.section} style={{ backgroundColor: '#E7DED2' }}>
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p className={styles.heroSub} style={{ color: 'var(--accent-gold-hover)' }}>FIVE SENSES</p>
            <h2 className={styles.heroTitle} style={{ color: 'var(--accent-dark)' }}>오감을 깨우는 세 가지 경험</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginTop: '12px', maxWidth: '600px', marginInline: 'auto' }}>
              머물렛에서의 하룻밤은 당신의 무뎌진 다섯 가지 감각(오감)을 온전히 깨우고 채우는 특별한 쉼으로 채워져 있습니다.
            </p>
          </div>

          <div className={styles.facGrid}>
            {/* Experience 1: Bread Scent */}
            <div className={styles.facCard}>
              <div className={styles.facImgBox}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/menu.jpg" 
                  alt="Bread Holy Land Daejeon" 
                  className={styles.facImg}
                />
              </div>
              <div className={styles.facInfo}>
                <h4 style={{ color: 'var(--accent-gold-hover)', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '6px' }}>SENSE 01. SCENT OF BREAD</h4>
                <h3>고소한 빵의 향기</h3>
                <p>
                  대전은 이미 전국에서 손꼽히는 맛있는 빵의 성지입니다. 
                  문을 열고 들어서는 순간 번지는 고소하고 달콤한 빵 냄새와 입안을 가득 채우는 풍요로운 맛은 쌓였던 스트레스를 단숨에 날려줍니다.
                </p>
              </div>
            </div>

            {/* Experience 2: Local Brand Curation */}
            <div className={styles.facCard}>
              <div className={styles.facImgBox}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/lamps.jpg" 
                  alt="Daejeon Local Brand Curation" 
                  className={styles.facImg}
                />
              </div>
              <div className={styles.facInfo}>
                <h4 style={{ color: 'var(--accent-gold-hover)', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '6px' }}>SENSE 02. LOCAL WARMTH</h4>
                <h3>로컬 브랜드의 온기</h3>
                <p>
                  대전의 열정적인 창작자들이 만든 진정성 넘치는 동네 브랜드들을 머물렛의 안목으로 꼼꼼하게 골라 방 안에 채웠습니다. 
                  이야기가 담긴 따뜻한 소품들에서 새로운 영감을 얻어 보세요.
                </p>
              </div>
            </div>

            {/* Experience 3: Healing Footbath */}
            <div className={styles.facCard}>
              <div className={styles.facImgBox}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/basket.jpg" 
                  alt="Healing Warm Footbath" 
                  className={styles.facImg}
                />
              </div>
              <div className={styles.facInfo}>
                <h4 style={{ color: 'var(--accent-gold-hover)', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '6px' }}>SENSE 03. HEALING FOOTBATH</h4>
                <h3>피로를 녹이는 족욕</h3>
                <p>
                  은은한 불빛 아래 따뜻한 물에 발을 담그고 가만히 눈을 감아 보세요. 
                  온몸의 긴장이 풀리며 "아, 좋다"라는 감탄사와 함께 하루의 모든 피로가 봄눈 녹듯 사르르 사라집니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Cave Concept Section */}
      <section className={styles.section}>
        <div className={`${styles.introGrid} container`} style={{ gridTemplateColumns: '0.9fr 1.1fr' }}>
          <div className={styles.introRight} style={{ gridColumn: 1 }}>
            <div className={styles.introImgBox} style={{ borderRadius: '0 0 50% 50%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/yoga.jpg" 
                alt="Primitive cozy cave concept" 
                className={styles.introImg}
              />
            </div>
          </div>

          <div className={styles.introLeft} style={{ gridColumn: 2, paddingLeft: '40px' }}>
            <p className={styles.heroSub}>ARCHETYPAL RETREAT</p>
            <h2>원초적인 안식처, '동굴'</h2>
            <p>
              인간이 가장 안전하게 숨 쉬고 쉴 수 있었던 최초의 공간은 바로 '동굴'이었습니다. 
              어린 시절, 누구나 한 번쯤 방구석에 이불로 비밀기지를 만들어 아늑함을 느껴본 기억이 있을 것입니다. 
              수만 년 전 우리 조상들에게 동굴은 사나운 비바람을 막아주는 유일하고 완벽한 피난처였습니다.
            </p>
            <p>
              머물렛은 바로 이 원초적인 동굴의 아늑함을 현대적인 공간으로 재해석했습니다. 
              차갑고 인공적인 플라스틱 대신 나무, 흙, 돌, 철 등 자연에서 온 순수한 재료들로 가득 채워져 있습니다. 
              나무가 내뿜는 향기와 흙벽의 포근한 질감은 공간에 들어서는 순간 몸의 긴장을 무장해제 시킵니다.
            </p>
            <p>
              찢어진 근육이 쉴 때 비로소 자라나듯, 머물렛에서 머무는 하룻밤 동안 당신의 마음도 한 뼘 더 깊어지고 단단해질 것입니다. 
              멀리 가지 않아도 괜찮습니다. 이번 주말에는 대전 머물렛에서 세상에서 가장 아늑하고 따뜻한 진짜 휴식과 연결되어 보세요.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Directions (Map) Section */}
      <section className={styles.section} style={{ backgroundColor: '#F4EFE6', borderTop: '1px solid rgba(90, 75, 58, 0.05)' }}>
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className={styles.heroSub}>LOCATION MAP</p>
            <h2 className={styles.heroTitle} style={{ color: 'var(--accent-dark)' }}>오시는 길</h2>
          </div>

          <div className={styles.mapWrapper}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!11m18!1m12!1m3!1d3213.9174127599026!2d127.43085601201994!3d36.33230307223805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3565494d4d62fb6d%3A0x6b87640db0a1a0df!2z64yA7KCE7Jet!5e0!3m2!1sko!2skr!4v1716000000000!5m2!1sko!2skr"
              width="100%" 
              height="100%" 
              style={{ border: 0, opacity: 0.85 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            <MapPin size={20} style={{ verticalAlign: 'middle', marginRight: '6px', color: 'var(--accent-gold-hover)' }} />
            <strong>대전광역시 중구 은행동 123 (성심당 도보 3분 & 대전역 KTX 도보 10분)</strong>
            <br />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'inline-block' }}>대표전화 042-123-4567 | info@mermullet.com</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
