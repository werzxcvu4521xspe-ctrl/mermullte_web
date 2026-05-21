import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ChevronRight } from 'lucide-react';
import styles from './blog.module.css';

const BLOGS = [
  {
    id: 'post-1',
    date: 'MAY 18, 2026',
    title: '차분한 쉼을 찾아서: 비움의 미학',
    desc: '화려한 장식과 인공 불빛으로 가득한 일상 속에서 나를 보호하는 일. 물건을 하나씩 걷어내고 여백을 응시할 때 비로소 드러나는 내면의 평온에 대해 에세이 형식으로 풀어냅니다.',
    img: '/images/dining.jpg'
  },
  {
    id: 'post-2',
    date: 'MAY 12, 2026',
    title: '햇살의 길이와 바람의 무게감',
    desc: '아침 07시 30분, 나지막이 침대 밑 우드 바닥으로 내려앉는 노란 햇살의 길이를 가만히 응시해 보셨나요? 조용한 자연의 그림자 움직임을 쫓는 것만으로도 호흡이 느려집니다.',
    img: '/images/room2.jpg'
  },
  {
    id: 'post-3',
    date: 'APRIL 28, 2026',
    title: '행복의 냄새: 대전에서 만난 고소한 위로',
    desc: '갓 구워낸 소금빵의 버터 향과 짭조름한 소금 알갱이가 혀끝에 닿을 때, 지쳐있던 오감이 온전히 깨어납니다. 대전의 따뜻한 빵 냄새 속에서 아무것도 하지 않고 휴식하며 마음의 부피를 키우는 온전한 채움의 기록.',
    img: '/images/menu.jpg'
  }
];

export default function BlogPage() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      
      {/* 1. Hero Block */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <p className={styles.heroSub}>MERMULLET</p>
          <h1 className={styles.heroTitle}>사색 다이어리 & 블로그</h1>
        </div>
      </section>

      {/* 2. Blog Grid */}
      <section className={styles.section}>
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p className={styles.heroSub}>QUIET DIARY</p>
            <h2 className={styles.heroTitle} style={{ color: 'var(--accent-dark)', fontSize: '36px' }}>
              고요 속에서 쓰여진 기록들
            </h2>
          </div>

          <div className={styles.blogGrid}>
            {BLOGS.map((blog) => (
              <div key={blog.id} className={styles.blogCard}>
                <div className={styles.blogImgBox}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={blog.img} alt={blog.title} className={styles.blogImg} />
                </div>
                
                <div className={styles.blogInfo}>
                  <span className={styles.date}>{blog.date}</span>
                  <h3>{blog.title}</h3>
                  <p className={styles.blogDesc}>{blog.desc}</p>
                  
                  <a href="#" className={styles.readMore}>
                    <span>Read Article</span>
                    <ChevronRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
