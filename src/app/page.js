import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Compass, Wind, Coffee, Award, Calendar, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import styles from './page.module.css';

// Fallback rooms list for visually complete loading
const LUXURY_ROOMS = [
  {
    id: 'room-1',
    name: 'Deluxe Ocean Suite',
    koreanName: '디럭스 오션 스위트',
    description: '끝없는 푸른 바다가 통유리 너머로 펼쳐지는 격조 높은 스위트룸입니다. 최고급 킹 베드와 전용 욕조에서 품격 있는 시간을 만끽하세요.',
    price: '380,000',
    capacity: 2,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200',
    amenities: ['Ocean View', 'King Bed', 'Private Balcony', 'Nespresso Machine']
  },
  {
    id: 'room-2',
    name: 'Executive Private Pool Villa',
    koreanName: '이그제큐티브 풀빌라',
    description: '외부와의 시선이 완벽히 차단된 독채형 빌라로, 4계절 온수 풀과 아늑한 전용 정원을 갖추고 있어 최상의 프라이버시를 선사합니다.',
    price: '650,000',
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
    amenities: ['Private Pool', 'Garden View', '2 King Beds', 'Kitchenette']
  },
  {
    id: 'room-3',
    name: 'Mermullet Royal Penthouse',
    koreanName: '머물렛 로열 펜트하우스',
    description: '호텔 최상층에 위치한 최고 등급의 펜트하우스입니다. 파노라마 바다 조망과 하이엔드 테라스, 24시간 버틀러 서비스가 제공됩니다.',
    price: '1,200,000',
    capacity: 6,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200',
    amenities: ['Panoramic View', 'Luxury Jacuzzi', '24h Butler', 'Premium Wine Cellar']
  }
];

export default async function Home() {
  let rooms = [];
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('price_per_night', { ascending: true });

    if (error || !data || data.length === 0) {
      throw new Error(error?.message || 'Empty data');
    }

    rooms = data.map((room) => ({
      id: room.id,
      name: room.name.includes(' (') ? room.name.split(' (')[1].replace(')', '') : room.name,
      koreanName: room.name.split(' (')[0],
      description: room.description,
      price: Number(room.price_per_night).toLocaleString(),
      capacity: room.capacity,
      image: room.image_url,
      amenities: room.amenities || []
    }));
  } catch (err) {
    console.log('Supabase rooms fetch failed, using mock rooms:', err.message);
    rooms = LUXURY_ROOMS;
  }

  return (
    <>
      <Navbar />
      
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={`${styles.heroContent} container animate-fade-in`}>
          <p className={styles.heroSub}>WHERE LUXURY MEETS THE OCEAN</p>
          <h1 className={styles.heroTitle}>
            세상의 끝에서 발견하는<br />
            <span>완벽한 품격과 휴식</span>
          </h1>
          <p className={styles.heroDesc}>
            Mermullet Hotel은 에메랄드빛 바다가 눈앞에 펼쳐지는 고품격 리조트로,<br />
            오직 당신만을 위해 설계된 맞춤형 럭셔리 서비스와 잊지 못할 힐링의 순간을 선사합니다.
          </p>
          <div className={styles.heroBtnGroup}>
            <Link href="/booking" className={styles.btnGold}>
              <Calendar size={18} />
              <span>실시간 예약하기</span>
            </Link>
            <a href="#rooms" className={styles.btnOutline}>
              <span>객실 둘러보기</span>
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Premium Services / Features */}
      <section className={styles.services}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionSub}>EXCLUSIVE VALUE</p>
            <h2 className={styles.sectionTitle}>Mermullet만의 특별한 가치</h2>
          </div>
          
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.iconBox}>
                <Compass size={28} />
              </div>
              <h3>프라이빗 도슨트 & 투어</h3>
              <p>호텔 주변의 빼어난 자연 경관과 유적지를 전문가의 친절한 스토리텔링과 함께 투어합니다.</p>
            </div>
            
            <div className={styles.serviceCard}>
              <div className={styles.iconBox}>
                <Wind size={28} />
              </div>
              <h3>오션 브리즈 스파</h3>
              <p>파도 소리를 들으며 몸과 마음을 치유하는 테라피스트의 프리미엄 맞춤형 오가닉 아로마 스파.</p>
            </div>
            
            <div className={styles.serviceCard}>
              <div className={styles.iconBox}>
                <Coffee size={28} />
              </div>
              <h3>파인 다이닝 & 라운지</h3>
              <p>미슐랭 스타 셰프들이 지역 특산 식자재로 선보이는 창의적이고 감각적인 고메 요리.</p>
            </div>
            
            <div className={styles.serviceCard}>
              <div className={styles.iconBox}>
                <Award size={28} />
              </div>
              <h3>24시간 버틀러 서비스</h3>
              <p>체크인 순간부터 체크아웃까지, 완벽한 편안함을 위해 모든 일정을 케어해 드립니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Rooms Showcase */}
      <section id="rooms" className={styles.rooms}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionSub}>LUXURIOUS ACCOMMODATIONS</p>
            <h2 className={styles.sectionTitle}>품격이 살아있는 객실</h2>
          </div>
          
          <div className={styles.roomsGrid}>
            {rooms.map((room) => (
              <div key={room.id} className={`${styles.roomCard} glass`}>
                <div className={styles.roomImgBox}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={room.image} alt={room.name} className={styles.roomImg} />
                  <div className={styles.priceTag}>
                    ₩{room.price} <span className={styles.priceUnit}>/ 1박</span>
                  </div>
                </div>
                
                <div className={styles.roomInfo}>
                  <div className={styles.roomTitleBox}>
                    <h3>{room.koreanName}</h3>
                    <span className={styles.engName}>{room.name}</span>
                  </div>
                  
                  <p className={styles.roomDesc}>{room.description}</p>
                  
                  <div className={styles.amenities}>
                    {room.amenities.map((amenity, i) => (
                      <span key={i} className={styles.amenityBadge}>{amenity}</span>
                    ))}
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <span className={styles.capacityText}>기준 인원: {room.capacity}인</span>
                    <Link href={`/booking?room=${room.id}`} className={styles.cardBtn}>
                      <span>예약하기</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}
