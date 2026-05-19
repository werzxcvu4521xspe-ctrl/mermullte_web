import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Sparkles, Heart, Compass, Wind, Lightbulb } from 'lucide-react';
import styles from './brand.module.css';

export default function BrandPage() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      
      {/* 1. Hero Block */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <p className={styles.heroSub}>MERMULLET</p>
          <h1 className={styles.heroTitle}>머물렛 브랜드 철학</h1>
        </div>
      </section>

      {/* 2. Brand Narrative */}
      <section className={styles.section}>
        <div className={`${styles.brandGrid} container`}>
          <div className={styles.introLeft}>
            <p className={styles.heroSub}>BRAND IDENTITY</p>
            <h2>mermullet.<br />느린 호흡으로 걷는 시간.</h2>
            <p>
              머물렛은 자연의 가장 부드러운 해 질 녘 빛 속에서 
              조용히 걸음을 멈추고 온전히 쉴 수 있는 사색의 순간을 뜻합니다.
            </p>
            <p>
              저희는 리넨, 돌, 흙점토 등 시간이 지나도 결코 그 편안함이 바래지 않는 
              투박하고 자연스러운 소재만을 공간에 들였습니다. 
              화려한 인공 장식을 걷어내고 비워둔 여백 사이로 자연의 질감들이 서서히 스며듭니다.
            </p>
          </div>
          
          <div className={styles.brandRight}>
            <div className={styles.circleMask}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600" 
                alt="Brand mood texture" 
                className={styles.circleImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Style Guide & Color Tokens */}
      <section className={styles.section} style={{ backgroundColor: '#E7DED2' }}>
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className={styles.heroSub}>VISUAL CODES</p>
            <h2 className={styles.heroTitle} style={{ color: 'var(--accent-dark)' }}>머물렛 컬러 파레트</h2>
          </div>

          <div className={styles.paletteGrid}>
            {/* Color 1 */}
            <div className={styles.paletteCard}>
              <div className={styles.colorBox} style={{ backgroundColor: '#F4EFE6' }}></div>
              <span className={styles.colorHex}>#F4EFE6</span>
              <p className={styles.colorName}>Warm Cream</p>
            </div>
            
            {/* Color 2 */}
            <div className={styles.paletteCard}>
              <div className={styles.colorBox} style={{ backgroundColor: '#E7DED2' }}></div>
              <span className={styles.colorHex}>#E7DED2</span>
              <p className={styles.colorName}>Linen Gray</p>
            </div>

            {/* Color 3 */}
            <div className={styles.paletteCard}>
              <div className={styles.colorBox} style={{ backgroundColor: '#D1C2AD' }}></div>
              <span className={styles.colorHex}>#D1C2AD</span>
              <p className={styles.colorName}>Soft Sand</p>
            </div>

            {/* Color 4 */}
            <div className={styles.paletteCard}>
              <div className={styles.colorBox} style={{ backgroundColor: '#B59E86' }}></div>
              <span className={styles.colorHex}>#B59E86</span>
              <p className={styles.colorName}>Clay Beige</p>
            </div>

            {/* Color 5 */}
            <div className={styles.paletteCard}>
              <div className={styles.colorBox} style={{ backgroundColor: '#8E7B63' }}></div>
              <span className={styles.colorHex}>#8E7B63</span>
              <p className={styles.colorName}>Twig Brown</p>
            </div>

            {/* Color 6 */}
            <div className={styles.paletteCard}>
              <div className={styles.colorBox} style={{ backgroundColor: '#5A4B3A' }}></div>
              <span className={styles.colorHex}>#5A4B3A</span>
              <p className={styles.colorName}>Deep Clay</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Values Section */}
      <section className={styles.section}>
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p className={styles.heroSub}>CORE VALUES</p>
            <h2 className={styles.heroTitle} style={{ color: 'var(--accent-dark)' }}>머물렛이 전하고자 하는 쉼</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <Heart size={32} style={{ color: 'var(--accent-gold-hover)', marginBottom: '16px' }} />
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '12px' }}>Warmth (온기)</h4>
              <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>사람과 공간, 자연이 만나는 따뜻한 어우러짐을 지향합니다.</p>
            </div>

            <div style={{ textAlign: 'center', padding: '24px' }}>
              <Compass size={32} style={{ color: 'var(--accent-gold-hover)', marginBottom: '16px' }} />
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '12px' }}>Quietude (고요)</h4>
              <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>소음이 차단된 자리에 은은하게 고이는 나만의 고요한 시간.</p>
            </div>

            <div style={{ textAlign: 'center', padding: '24px' }}>
              <Wind size={32} style={{ color: 'var(--accent-gold-hover)', marginBottom: '16px' }} />
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '12px' }}>Nature (자연)</h4>
              <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>리넨, 나뭇가지, 흙 오브제 등 자연 소재가 주는 완전한 편안함.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
