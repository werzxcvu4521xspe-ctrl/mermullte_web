'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { supabase } from '../../lib/supabase';
import { Calendar, User, Mail, Phone, CreditCard, Sparkles, CheckCircle } from 'lucide-react';
import styles from './booking.module.css';

const ROOMS_DATA = [
  { id: 'room-1', name: '디럭스 오션 스위트 (Deluxe Ocean Suite)', price: 380000 },
  { id: 'room-2', name: '이그제큐티브 풀빌라 (Executive Pool Villa)', price: 650000 },
  { id: 'room-3', name: '머물렛 로열 펜트하우스 (Mermullet Penthouse)', price: 1200000 }
];

export default function BookingPage() {
  const [selectedRoom, setSelectedRoom] = useState('room-1');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [nights, setNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(380000);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingId, setBookingId] = useState('');

  // Calculate nights and total price whenever checkIn, checkOut or selectedRoom changes
  useEffect(() => {
    if (checkIn && checkOut) {
      const date1 = new Date(checkIn);
      const date2 = new Date(checkOut);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      
      setNights(diffDays);
      
      const room = ROOMS_DATA.find(r => r.id === selectedRoom);
      if (room) {
        setTotalPrice(room.price * diffDays);
      }
    } else {
      const room = ROOMS_DATA.find(r => r.id === selectedRoom);
      if (room) {
        setTotalPrice(room.price);
      }
    }
  }, [checkIn, checkOut, selectedRoom]);

  // Set default dates (today and tomorrow)
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    setCheckIn(formatDate(today));
    setCheckOut(formatDate(tomorrow));
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const reservationData = {
        room_id: selectedRoom === 'room-1' ? '7b4fd1c0-0000-0000-0000-000000000001' : 
                 selectedRoom === 'room-2' ? '7b4fd1c0-0000-0000-0000-000000000002' : '7b4fd1c0-0000-0000-0000-000000000003',
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        check_in: checkIn,
        check_out: checkOut,
        total_price: totalPrice,
        status: 'pending'
      };

      // 1. Try to save in Supabase
      const { data, error } = await supabase
        .from('reservations')
        .insert([reservationData])
        .select();

      if (error) {
        // If Supabase fails (e.g. database not set up yet), we fallback to LocalStorage for complete demo functionality!
        console.warn('Supabase insert failed, using LocalStorage fallback:', error.message);
        throw new Error('Supabase Not Ready');
      }

      // Supabase insertion success!
      setBookingId(data[0].id.substring(0, 8).toUpperCase());
      setIsSuccess(true);
    } catch (err) {
      // LocalStorage Fallback (so it runs perfectly even on new/empty environments)
      const mockId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const localReservations = JSON.parse(localStorage.getItem('mermullet_reservations') || '[]');
      
      const newReservation = {
        id: mockId,
        room_name: ROOMS_DATA.find(r => r.id === selectedRoom)?.name.split(' (')[0],
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        check_in: checkIn,
        check_out: checkOut,
        total_price: totalPrice,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      localReservations.push(newReservation);
      localStorage.setItem('mermullet_reservations', JSON.stringify(localReservations));

      setBookingId(mockId);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <main className={styles.main}>
        <div className={`${styles.container} container`}>
          
          {isSuccess ? (
            /* Reservation Success Screen */
            <div className={`${styles.successCard} glass animate-fade-in`}>
              <CheckCircle size={64} className={styles.successIcon} />
              <h2>예약 신청이 완료되었습니다!</h2>
              <p className={styles.successSub}>고객님의 소중한 휴식을 위해 완벽히 준비하겠습니다.</p>
              
              <div className={styles.receipt}>
                <div className={styles.receiptRow}>
                  <span>예약 번호</span>
                  <strong className={styles.bookingCode}>{bookingId}</strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>예약자명</span>
                  <span>{guestName}</span>
                </div>
                <div className={styles.receiptRow}>
                  <span>객실명</span>
                  <span>{ROOMS_DATA.find(r => r.id === selectedRoom)?.name.split(' (')[0]}</span>
                </div>
                <div className={styles.receiptRow}>
                  <span>일정</span>
                  <span>{checkIn} ~ {checkOut} ({nights}박)</span>
                </div>
                <div className={`${styles.receiptRow} ${styles.receiptTotal}`}>
                  <span>총 결제금액</span>
                  <strong>₩{totalPrice.toLocaleString()}</strong>
                </div>
              </div>

              <div className={styles.successActions}>
                <button onClick={() => setIsSuccess(false)} className={styles.btnSecondary}>
                  추가 예약하기
                </button>
                <a href="/admin" className={styles.btnPrimaryGold}>
                  관리 대시보드에서 확인
                </a>
              </div>
            </div>
          ) : (
            /* Booking Form Screen */
            <div className={styles.bookingGrid}>
              
              {/* Left Side: Form */}
              <div className={`${styles.formCard} glass`}>
                <div className={styles.formHeader}>
                  <Sparkles size={24} className={styles.sparkleIcon} />
                  <h2>실시간 객실 예약</h2>
                  <p>일정과 개인정보를 입력하시면 신속히 예약을 확정해 드립니다.</p>
                </div>
                
                <form onSubmit={handleBooking} className={styles.form}>
                  
                  {/* Select Room */}
                  <div className={styles.inputGroup}>
                    <label>객실 선택</label>
                    <select 
                      value={selectedRoom} 
                      onChange={(e) => setSelectedRoom(e.target.value)}
                      className={styles.select}
                    >
                      {ROOMS_DATA.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Dates Grid */}
                  <div className={styles.datesGrid}>
                    <div className={styles.inputGroup}>
                      <label>체크인</label>
                      <div className={styles.inputWithIcon}>
                        <Calendar size={16} />
                        <input 
                          type="date" 
                          value={checkIn} 
                          onChange={(e) => setCheckIn(e.target.value)}
                          required 
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>체크아웃</label>
                      <div className={styles.inputWithIcon}>
                        <Calendar size={16} />
                        <input 
                          type="date" 
                          value={checkOut} 
                          onChange={(e) => setCheckOut(e.target.value)}
                          required 
                          className={styles.input}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className={styles.formDivider}></div>

                  {/* Guest Info */}
                  <div className={styles.inputGroup}>
                    <label>예약자 성함</label>
                    <div className={styles.inputWithIcon}>
                      <User size={16} />
                      <input 
                        type="text" 
                        placeholder="실명을 입력해 주세요" 
                        value={guestName} 
                        onChange={(e) => setGuestName(e.target.value)}
                        required 
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>이메일 주소</label>
                    <div className={styles.inputWithIcon}>
                      <Mail size={16} />
                      <input 
                        type="email" 
                        placeholder="example@email.com" 
                        value={guestEmail} 
                        onChange={(e) => setGuestEmail(e.target.value)}
                        required 
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>전화번호</label>
                    <div className={styles.inputWithIcon}>
                      <Phone size={16} />
                      <input 
                        type="tel" 
                        placeholder="010-0000-0000" 
                        value={guestPhone} 
                        onChange={(e) => setGuestPhone(e.target.value)}
                        required 
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className={styles.submitBtn}
                  >
                    {isSubmitting ? '예약 처리 중...' : '예약 신청하기'}
                  </button>
                  
                </form>
              </div>

              {/* Right Side: Sidebar Price Info */}
              <div className={`${styles.sidebarCard} glass`}>
                <h3>예약 정보 요약</h3>
                <p className={styles.sidebarSub}>선택하신 객실의 결제 예정 금액입니다.</p>
                
                <div className={styles.summaryList}>
                  <div className={styles.summaryRow}>
                    <span>선택 객실</span>
                    <strong>{ROOMS_DATA.find(r => r.id === selectedRoom)?.name.split(' (')[0]}</strong>
                  </div>
                  
                  <div className={styles.summaryRow}>
                    <span>숙박 기간</span>
                    <span>{checkIn || '-'} ~ {checkOut || '-'} ({nights}박)</span>
                  </div>

                  <div className={styles.summaryRow}>
                    <span>1박 요금</span>
                    <span>₩{ROOMS_DATA.find(r => r.id === selectedRoom)?.price.toLocaleString()}</span>
                  </div>

                  <div className={styles.divider}></div>
                  
                  <div className={`${styles.summaryRow} ${styles.totalPriceRow}`}>
                    <span>총 결제금액</span>
                    <strong className={styles.sidebarTotal}>₩{totalPrice.toLocaleString()}</strong>
                  </div>
                </div>

                <div className={styles.bookingTip}>
                  <CreditCard size={18} />
                  <div>
                    <h4>현장 결제 지원</h4>
                    <p>예약 완료 후 체크인 시 신용카드 또는 현금으로 결제가 진행됩니다.</p>
                  </div>
                </div>
              </div>
              
            </div>
          )}
          
        </div>
      </main>
      
      <Footer />
    </>
  );
}
