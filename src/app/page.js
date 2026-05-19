import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Calendar,
  ChevronRight,
  Sparkles,
  Compass,
  Wind,
  Coffee,
  Heart,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import styles from './page.module.css';

// Pre-defined rooms list featuring user's actual room photographs
const SOFT_LIGHT_ROOMS = [
  {
    id: 'room-1',
    name: 'Deluxe Ocean Suite',
    koreanName: '디럭스 오션 스위트',
    description: '따사로운 아침 햇살과 식물들이 가득한 미니멀 디자인의 저상형 플로어 침실입니다. 우아한 대형 골드 아치형 거울과 포근한 순면 리넨 베드로 자연 친화적 쉼을 선사합니다.',
    price: '380,000',
    capacity: 2,
    image: '/images/room1.jpg',
    amenities: ['Sunlit Room', 'Flooring Linen Bed', 'Large Gold Mirror', 'Lush Greenery']
  },
  {
    id: 'room-2',
    name: 'Executive Pool Villa',
    koreanName: '이그제큐티브 풀빌라',
    description: '대형 구형 한지 펜던트 조명이 뿜어내는 온화하고 부드러운 빛 속에서 누리는 최상의 안식처입니다. 주름진 화이트 퀼트 베딩과 정갈한 우드 바닥으로 동양적이고 감성적인 분위기를 자아냅니다.',
    price: '650,000',
    capacity: 4,
    image: '/images/room2.jpg',
    amenities: ['Paper Lantern Lamp', 'Wrinkled Cotton Duvet', 'Soft Sunshine Shadow', 'Wood Flooring']
  },
  {
    id: 'room-3',
    name: 'mermullet Penthouse',
    koreanName: '머물렛 로열 펜트하우스',
    description: '360도 파노라마 바다 전경이 눈앞에 가득 찬 공간이자 호텔 최상층에 우뚝 선 펜트하우스입니다. 자연의 부드러운 그림자와 따뜻한 차분함이 극대화된 하이엔드 인테리어.',
    price: '1,200,000',
    capacity: 6,
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1200',
    amenities: ['360 Panorama View', 'Private Premium Spa', '24h Personal Butler', 'Eco Clay Accents']
  }
];

export default async function Home() {
  let rooms = [];
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('price', { ascending: true });

    if (error || !data || data.length === 0) {
      throw new Error(error?.message || 'Empty data');
    }

    rooms = data.map((room) => {
      let customImage = room.image_url;
      let customDesc = room.description;
      let customAmenities = ['Cozy Linen', 'Nature Material', 'Soft Light', 'Calm Relax'];

      if (room.id === '7b4fd1c0-0000-0000-0000-000000000001' || room.name.includes('디럭스') || room.name.includes('Deluxe')) {
        customImage = '/images/room1.jpg';
        customDesc = SOFT_LIGHT_ROOMS[0].description;
        customAmenities = SOFT_LIGHT_ROOMS[0].amenities;
      } else if (room.id === '7b4fd1c0-0000-0000-0000-000000000002' || room.name.includes('풀빌라') || room.name.includes('Villa')) {
        customImage = '/images/room2.jpg';
        customDesc = SOFT_LIGHT_ROOMS[1].description;
        customAmenities = SOFT_LIGHT_ROOMS[1].amenities;
      } else if (room.id === '7b4fd1c0-0000-0000-0000-000000000003' || room.name.includes('펜트') || room.name.includes('Penthouse')) {
        customImage = SOFT_LIGHT_ROOMS[2].image;
        customDesc = SOFT_LIGHT_ROOMS[2].description;
        customAmenities = SOFT_LIGHT_ROOMS[2].amenities;
      }

      return {
        id: room.id,
        name: room.name.includes(' (') ? room.name.split(' (')[1].replace(')', '') : room.name,
        koreanName: room.name.split(' (')[0],
        description: customDesc,
        price: Number(room.price).toLocaleString(),
        image: customImage,
        amenities: customAmenities,
        capacity: room.capacity || 2
      };
    });
  } catch (err) {
    rooms = SOFT_LIGHT_ROOMS;
  }

  return (
    <div className={styles.mainWrapper}>
      <Navbar />

      {/* 1. Hero Block (Breathtaking full-bleed warm lighting bedroom container) */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroBanner}>
            <div className={styles.heroOverlay}></div>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>mermullet</h1>
              <p className={styles.heroSubtitle}>지금 가장 사색적인 쉼터</p>
              <div className={styles.heroSublist}>
                <span>ROOM DELUXE</span>
                <span className={styles.dot}>•</span>
                <span>SUITE</span>
                <span className={styles.dot}>•</span>
                <span>SPA VILLA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Texture of Silence Section */}
      <section className={styles.silenceSection}>
        <div className={`${styles.silenceGrid} container`}>
          <div className={styles.silenceLeft}>
            <p className={styles.metaLabel}>OUR PHILOSOPHY</p>
            <h2 className={styles.silenceTitle}>Texture of Silence</h2>
            <p className={styles.silenceDesc}>
              조용히 나를 만나는 고요 속으로 초대합니다. 따뜻하게 데워진 찻잔의 온기를 느끼고,
              창틈으로 들어오는 은은한 햇살의 흐름을 바라보며 호흡을 가다듬어 보세요.
              머물렛은 오롯이 비워진 공간 속에서 자연의 질감들을 마주하며 사색을 채울 수 있도록 돕습니다.
            </p>

            <div className={styles.silenceStats}>
              <div className={styles.statCol}>
                <span className={styles.statNum}>01</span>
                <span className={styles.statName}>MEDITATION</span>
              </div>
              <div className={styles.statCol}>
                <span className={styles.statNum}>02</span>
                <span className={styles.statName}>CRAFTS</span>
              </div>
              <div className={styles.statCol}>
                <span className={styles.statNum}>03</span>
                <span className={styles.statName}>SILENCE</span>
              </div>
            </div>
          </div>

          <div className={styles.silenceRight}>
            <div className={styles.shadowCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600"
                alt="Sunlight shadows on warm textured clay wall"
                className={styles.shadowImg}
              />
              <div className={styles.shadowFloatingTag}>
                <h4>mermullet</h4>
                <p>자연과 공간이 건네는 가장 편안한 침묵</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Experience the Light Grid (Majestic Asymmetrical Layout) */}
      <section className={styles.gallerySection}>
        <div className="container">
          <div className={styles.galleryHeader}>
            <h2 className={styles.galleryMainTitle}>Experience the Light</h2>
            <Link href="/booking" className={styles.viewAllLink}>
              <span>View All Spaces</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.galleryGrid}>
            {/* Left Big Column */}
            <div className={styles.galleryLeftCol}>
              <div className={styles.galleryItemCard}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/room1.jpg" alt="Morning Light Suite" className={styles.galleryItemImg} />
                <div className={styles.itemOverlay}>
                  <div className={styles.overlayText}>
                    <h3>Morning Light Suite</h3>
                    <p>따사로운 아침 햇살과 식물들이 가득한 안식처</p>
                  </div>
                  <Link href={`/booking?room=${rooms[0]?.id || 'room-1'}`} className={styles.overlayBtn}>
                    Book this Space
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Asymmetrical Column */}
            <div className={styles.galleryRightCol}>
              {/* Top Horizontal Row */}
              <div className={`${styles.galleryItemCard} ${styles.horizontalCard}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/room2.jpg" alt="Deep Forest Cabin" className={styles.galleryItemImg} />
                <div className={styles.itemOverlay}>
                  <div className={styles.overlayText}>
                    <h3>Deep Forest Cabin</h3>
                    <p>대형 구형 한지 조명이 내뿜는 고요한 쉼</p>
                  </div>
                  <Link href={`/booking?room=${rooms[1]?.id || 'room-2'}`} className={styles.overlayBtn}>
                    Book this Space
                  </Link>
                </div>
              </div>

              {/* Bottom Twin Columns */}
              <div className={styles.twinGridRow}>
                <div className={styles.galleryItemCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400"
                    alt="Cozy Bedding details"
                    className={styles.galleryItemImg}
                  />
                  <div className={styles.itemLabelOverlay}>
                    <span>BEDDING DETAILS</span>
                  </div>
                </div>

                <div className={styles.galleryItemCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=400"
                    alt="Ceramic vase aesthetic detail"
                    className={styles.galleryItemImg}
                  />
                  <div className={styles.itemLabelOverlay}>
                    <span>CERAMIC DESIGN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Reserve Form Card Section */}
      <section className={styles.reservationSection}>
        <div className="container">
          <div className={`${styles.reservationContainer} glass`}>
            {/* Form Column */}
            <div className={styles.formCol}>
              <h2 className={styles.formTitle}>예약하기</h2>
              <p className={styles.formSubtitle}>원하시는 사색 공간에서 당신만의 쉼을 찾으세요.</p>

              <form action="/booking" method="GET" className={styles.quickForm}>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>CHECK IN</label>
                    <input type="date" name="checkIn" defaultValue="2026-06-01" required />
                  </div>
                  <div className={styles.formField}>
                    <label>CHECK OUT</label>
                    <input type="date" name="checkOut" defaultValue="2026-06-02" required />
                  </div>
                </div>

                <div className={styles.formField} style={{ marginTop: '20px' }}>
                  <label>SANCTUARY</label>
                  <select name="room" required>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>{r.koreanName} ({r.name})</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className={styles.submitReserveBtn}>
                  Find Your Sanctuary
                </button>
              </form>
            </div>

            {/* Candle Image Column */}
            <div className={styles.candleCol}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1548048026-5a1a941d93d3?auto=format&fit=crop&q=80&w=600"
                alt="Warm single burning candle on wooden holder with linen towels"
                className={styles.candleImg}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
