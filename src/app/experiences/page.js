import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Compass, Calendar, ChevronRight, Sparkles } from 'lucide-react';
import styles from './experiences.module.css';

const EXPERIENCES = [
  {
    id: 'exp-1',
    name: 'Morning Forest Meditation',
    koreanName: '아침 숲 호흡 명상',
    category: 'WELLNESS',
    desc: '이슬 머금은 아침 편백나무 숲길을 거닐며, 흙냄새와 싱그러운 바람 소리를 호흡으로 들이마시는 프라이빗 아침 숲 명상 프로그램입니다.',
    schedule: '매일 오전 07:30 - 08:30 (60분)',
    price: '30,000',
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'exp-2',
    name: 'Tea Ceremony & Light',
    koreanName: '차회와 자연의 다도',
    category: 'SENSORY',
    desc: '자연 채광 아래 서서히 차오르는 다관의 따스한 열기를 매만지며, 깊이 우려낸 차 한 잔을 통해 조용히 내면의 목소리에 집중하는 차회 프로그램입니다.',
    schedule: '매주 화/목/토 오후 03:00 - 04:30 (90분)',
    price: '50,000',
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'exp-3',
    name: 'Hand-crafted Pottery Class',
    koreanName: '손끝으로 빚는 흙점토 도예',
    category: 'CRAFT',
    desc: '투박한 흙더미를 손가락 온기로 조용히 어루만지고 늘려가며 나만의 고유한 찻잔과 식기를 빚어내는 차분한 촉각의 워크숍입니다.',
    schedule: '매주 금/일 오전 10:30 - 12:30 (120분)',
    price: '70,000',
    img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600'
  }
];

export default function ExperiencesPage() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      
      {/* 1. Hero Block */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <p className={styles.heroSub}>MERMULLET</p>
          <h1 className={styles.heroTitle}>이벤트 & 감각적 경험</h1>
        </div>
      </section>

      {/* 2. Experiences Grid */}
      <section className={styles.section}>
        <div className="container">
          <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p className={styles.heroSub}>SENSORY WORKSHOPS</p>
            <h2 className={styles.heroTitle} style={{ color: 'var(--accent-dark)', fontSize: '36px' }}>
              내면에 침잠하는 시간들
            </h2>
          </div>

          <div className={styles.expGrid}>
            {EXPERIENCES.map((exp) => (
              <div key={exp.id} className={styles.expCard}>
                <div className={styles.expImgBox}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={exp.img} alt={exp.name} className={styles.expImg} />
                  <span className={styles.expBadge}>{exp.category}</span>
                </div>
                
                <div className={styles.expInfo}>
                  <h3>{exp.koreanName}</h3>
                  <p className={styles.expDesc}>{exp.desc}</p>
                  
                  <div className={styles.expSchedule}>
                    <strong>진행 정보:</strong> {exp.schedule}
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <div className={styles.price}>
                      ₩{exp.price} <span className={styles.priceUnit}>/ 1인</span>
                    </div>
                    <a href="/booking" className={styles.btn}>
                      <span>참여 신청</span>
                      <ChevronRight size={14} />
                    </a>
                  </div>
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
