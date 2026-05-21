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
                src="/images/menu.jpg" 
                alt="Brand mood texture" 
                className={styles.circleImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Brand Story Section (Beautiful Editorial Magazine Layout) */}
      <section className={styles.storySection}>
        <div className="container">
          <div className={styles.storyHeader}>
            <p className={styles.heroSub} style={{ color: 'var(--accent-gold-hover)' }}>BRAND STORY</p>
            <h2 className={styles.storyMainTitle}>진정한 쉼을 향한 여정</h2>
          </div>

          <div className={styles.storyContentGrid}>
            {/* Part 1: Burnout & Muscle Rest Metaphor */}
            <div className={styles.storyRow}>
              <div className={styles.storyTextCol}>
                <h3 className={styles.storySubTitle}>왜 우리는 이토록 간절하게 쉼을 갈망할까요?</h3>
                <p className={styles.storyParagraph}>
                  매일 아침 울리는 스마트폰 알람 소리, 빽빽한 지하철, 모니터 가득 쌓인 일거리... 현대인들은 누구나 "아, 딱 하루만 아무것도 안 하고 푹 쉬고 싶다"는 생각을 마음속에 품고 살아갑니다. 실제로 한 보건기관의 조사에 따르면 대한민국 직장인의 80% 이상이 극심한 육체적·정신적 피로를 느끼는 '번아웃 증후군'을 경험했다고 답했습니다.
                </p>
                <p className={styles.storyParagraph}>
                  웨이트 트레이닝을 할 때 근육이 커지는 원리를 보면 아주 흥미로운 사실을 발견할 수 있습니다. 무거운 아령을 들고 땀을 흘릴 때 근육이 자라는 것이 아닙니다. 그때 근육은 미세하게 찢어지고 상처를 입을 뿐입니다. 진짜 근육이 단단해지고 부피가 자라는 순간은, 운동을 마치고 집에 돌아와 편안하게 잠을 자며 <strong>'쉴 때'</strong>입니다.
                </p>
                <p className={styles.storyParagraph}>
                  우리 마음과 인생도 이 근육과 똑같습니다. 매일 치열하게 달리기만 해서는 결코 성장할 수 없습니다. 상처받고 지친 마음이 온전히 회복될 수 있도록 '쉼'의 시간을 줄 때, 우리는 비로소 한 단계 더 단단하게 성장합니다. 즉, 진정한 휴식은 멈춤이 아니라 다음 단계로 나아가기 위한 가장 적극적인 준비 과정인 셈입니다.
                </p>
              </div>
              <div className={styles.storyImgCol}>
                <div className={styles.storyCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/sunlight.jpg" alt="Cozy sunlit room for true rest" className={styles.storyImg} />
                  <div className={styles.storyImgTag}>Growth happens during rest</div>
                </div>
              </div>
            </div>

            {/* Part 2: Travel exhaust & Happiness Frequency */}
            <div className={`${styles.storyRow} ${styles.rowReverse}`}>
              <div className={styles.storyTextCol}>
                <h3 className={styles.storySubTitle}>행복은 기쁨의 강도가 아니라, 빈도입니다</h3>
                <p className={styles.storyParagraph}>
                  하지만 우리는 쉴 때조차 너무 많은 에너지를 쓰곤 합니다. 몇 달 동안 열심히 적금을 붓고, 눈치를 보며 연차를 쓰고, 비행기 표를 끊어 일본이나 유럽 같은 먼 나라로 떠나는 여행을 계획합니다. 물론 이국적인 풍경은 큰 설렘을 줍니다. 하지만 공항으로 가는 길부터 낯선 언어 속에서 헤매는 과정까지, 여행을 마치고 집에 돌아오면 정작 "아, 역시 집이 최고다"라며 녹초가 되어 쓰러지기 일쑤입니다.
                </p>
                <blockquote className={styles.storyQuote}>
                  "행복은 기쁨의 강도가 아니라 빈도에 의해 결정된다"
                  <span>- 에드 디너(Ed Diener) 교수, 세계적 긍정심리학의 대가</span>
                </blockquote>
                <p className={styles.storyParagraph}>
                  1년에 단 한 번 느끼는 100점짜리 거대한 행복보다, 일상 속에서 자주 느끼는 10점짜리 소소한 행복 10번이 사람을 훨씬 더 건강하고 행복하게 만든다는 뜻입니다. 바로 이 지점에서 '머물렛'이 탄생했습니다. 저희는 질문을 던졌습니다.
                </p>
                <p className={styles.storyParagraph} style={{ fontStyle: 'italic', color: 'var(--accent-gold-hover)', fontSize: '15.5px', margin: '20px 0', fontWeight: '500' }}>
                  "왜 여행은 꼭 큰맘 먹고 먼 곳으로 떠나야만 할까? 우리 일상과 아주 가까운 곳에서 더 자주 여행을 즐길 수는 없을까?"
                </p>
                <p className={styles.storyParagraph}>
                  머물렛은 여행을 '먼 곳으로 이동하는 것'이 아니라, '일상 속에서 마주하는 특별한 경험'으로 새롭게 정의했습니다. 굳이 무거운 캐리어를 싸지 않아도, 비행기 표를 예매하느라 머리를 싸매지 않아도, 누구나 원할 때 언제든 일상 속 비일상을 만날 수 있도록 돕고 싶었습니다. 행복의 빈도를 높여주는 가장 쉽고 편안한 여행을 선물하고 싶어 탄생하게 되었습니다.
                </p>
              </div>
              <div className={styles.storyImgCol}>
                <div className={styles.storyCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/basket.jpg" alt="Relaxing yoga lifestyle basket" className={styles.storyImg} />
                  <div className={styles.storyImgTag}>Retreat for happiness frequency</div>
                </div>
              </div>
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
