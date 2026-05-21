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
import fs from 'fs';
import path from 'path';

// Pre-defined rooms list featuring user's actual room photographs mapped to Cave & Daejeon themes
const SOFT_LIGHT_ROOMS = [
  {
    id: 'room-1',
    name: 'Morning Light Cave Suite',
    koreanName: '아침 햇살의 동굴 스위트',
    description: '따사로운 아침 햇살과 식물들이 가득한 미니멀 디자인의 저상형 플로어 침실입니다. 흙벽의 포근한 질감과 우드, 돌의 조화로 태초의 동굴과 같은 온전하고 아늑한 쉼을 선사합니다.',
    price: '380,000',
    capacity: 2,
    image: '/images/room1.jpg',
    amenities: ['Sunlit Room', 'Clay & Stone Wall', 'Linen Floor Bed', 'Cozy Greenery']
  },
  {
    id: 'room-2',
    name: 'Deep Silence Local Villa',
    koreanName: '깊은 침묵의 로컬 풀빌라',
    description: '대형 구형 한지 펜던트 조명이 뿜어내는 온화하고 부드러운 빛 속에서 누리는 최상의 안식처입니다. 대전의 열정적인 창작자들이 빚어낸 따뜻한 공예 소품들과 조용한 족욕 텁(Tub)이 몸의 긴장을 무장해제합니다.',
    price: '650,000',
    capacity: 4,
    image: '/images/room2.jpg',
    amenities: ['Paper Lantern Lamp', 'Local Creator Decor', 'Warm Footbath Tub', 'Aromatic Silence']
  },
  {
    id: 'room-3',
    name: 'mermullet Cave Penthouse',
    koreanName: '머물렛 로열 동굴 펜트하우스',
    description: '인공적인 장식을 배제하고 순수한 자연의 재료인 나무, 흙, 돌, 철을 사용하여 원초적인 아늑함을 극대화한 최고급 동굴 펜트하우스입니다. 고소한 대전의 빵 향기와 따뜻한 차 한 잔으로 마음의 부피를 키워 보세요.',
    price: '1,200,000',
    capacity: 6,
    image: '/images/dining.jpg',
    amenities: ['Bread Room Service', 'Primitive Clay Spa', 'Natural Timber Logs', 'Warm Tea Ceremony']
  }
];

export default async function Home() {
  // Bypassing terminal cp restrictions by using server-side filesystem copying
  try {
    const brainDir = '/Users/jang-yuchan/.gemini/antigravity/brain/ebeea76c-47ca-4298-8fc2-7d254fa42507';
    const publicImagesDir = '/Users/jang-yuchan/Desktop/mermullet_web/public/images';

    if (fs.existsSync(brainDir)) {
      const filesToCopy = [
        { src: 'media__1779298896802.jpg', dest: 'room2.jpg' },
        { src: 'media__1779298905323.jpg', dest: 'room1.jpg' },
        { src: 'media__1779348099605.jpg', dest: 'menu.jpg' },
        { src: 'media__1779298911253.jpg', dest: 'lamps.jpg' },
        { src: 'media__1779298916447.jpg', dest: 'dining.jpg' },
        { src: 'media__1779301254393.jpg', dest: 'yoga.jpg' },
        { src: 'media__1779348719524.jpg', dest: 'basket.jpg' },
        { src: 'media__1779301926135.jpg', dest: 'sunlight.jpg' },
        { src: 'media__1779344171237.png', dest: 'logo.png' }
      ];

      filesToCopy.forEach(item => {
        const srcPath = path.join(brainDir, item.src);
        const destPath = path.join(publicImagesDir, item.dest);
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    }
  } catch (e) {
    console.error("Error copying images on server side", e);
  }

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
              <p className={styles.heroSubtitle}>대전에서 만나는 현대적 동굴, 온전한 비일상의 안식</p>
              <div className={styles.heroSublist}>
                <span>COZY CAVE</span>
                <span className={styles.dot}>•</span>
                <span>BAKERY SCENT</span>
                <span className={styles.dot}>•</span>
                <span>FOOT BATH</span>
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
            <h2 className={styles.silenceTitle}>Texture of <i>Silence</i></h2>
            <p className={styles.silenceDesc}>
              매일의 소음에서 벗어나 조용히 나를 마주하는 침묵의 안식처로 당신을 초대합니다.
              근육이 쉴 때 비로소 자라나듯, 머물렛에서 머무는 하룻밤은 지쳤던 마음에 단단하고 아늑한 휴식을 선물합니다.
              자연에서 온 순수한 흙벽, 따뜻한 우드, 투박한 돌의 질감을 매만지며 호흡을 편안히 가다듬어 보세요.
            </p>

            <div className={styles.silenceStats}>
              <div className={styles.statCol}>
                <span className={styles.statNum}>01</span>
                <span className={styles.statName}>BREAD SCENT</span>
              </div>
              <div className={styles.statCol}>
                <span className={styles.statNum}>02</span>
                <span className={styles.statName}>LOCAL ART</span>
              </div>
              <div className={styles.statCol}>
                <span className={styles.statNum}>03</span>
                <span className={styles.statName}>FOOT BATH</span>
              </div>
            </div>
          </div>

          <div className={styles.silenceRight}>
            <div className={styles.shadowCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/lamps.jpg"
                alt="Warm aesthetic hanging lights"
                className={styles.shadowImg}
              />
              <div className={styles.shadowFloatingTag}>
                <h4>mermullet</h4>
                <p>세상에서 가장 아늑하고 따뜻한 진짜 휴식</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Experience the Light Grid (Majestic Asymmetrical Layout) */}
      <section className={styles.gallerySection}>
        <div className="container">
          <div className={styles.galleryHeader}>
            <h2 className={styles.galleryMainTitle}>Sanctuary of Silence</h2>
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
                <img src="/images/room1.jpg" alt="Morning Light Cave Suite" className={styles.galleryItemImg} />
                <div className={styles.itemOverlay}>
                  <div className={styles.overlayText}>
                    <h3>Morning Light Cave Suite</h3>
                    <p>따사로운 아침 햇살과 흙벽이 내어주는 원초적인 안식처</p>
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
                <img src="/images/room2.jpg" alt="Deep Silence Local Villa" className={styles.galleryItemImg} />
                <div className={styles.itemOverlay}>
                  <div className={styles.overlayText}>
                    <h3>Deep Silence Local Villa</h3>
                    <p>구형 한지 조명이 뿜는 온화한 빛과 대전 로컬 크리에이터 소품의 아늑함</p>
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
                    src="/images/lamps.jpg"
                    alt="Beautiful warm ceiling lights"
                    className={styles.galleryItemImg}
                  />
                  <div className={styles.itemLabelOverlay}>
                    <span>CLAY & LIGHT</span>
                  </div>
                </div>

                <div className={styles.galleryItemCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/menu.jpg"
                    alt="Menu card on ceramic plate"
                    className={styles.galleryItemImg}
                  />
                  <div className={styles.itemLabelOverlay}>
                    <span>BAKERY SCENT</span>
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
              <p className={styles.formSubtitle}>대전을 가득 채우는 따뜻한 온기, 머물렛에서의 하룻밤을 준비하세요.</p>

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

            {/* Dining Table Detail Column */}
            <div className={styles.candleCol}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/dining.jpg"
                alt="Beautiful warm low table space"
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
