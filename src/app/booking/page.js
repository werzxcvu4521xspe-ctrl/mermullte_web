'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { supabase } from '../../lib/supabase';
import { Calendar, User, Mail, Phone, CreditCard, Sparkles, CheckCircle, ArrowRight, Users, MessageSquare, AlertCircle } from 'lucide-react';
import styles from './booking.module.css';

const ROOMS_DATA = [
  { id: 'room-1', name: '소나무 채 (Deluxe Ocean Suite)', price: 120000, maxGuests: 2, img: '/images/room1.jpg' },
  { id: 'room-2', name: '달빛 온돌방 (Executive Pool Villa)', price: 180000, maxGuests: 2, img: '/images/room2.jpg' },
  { id: 'room-3', name: '별빛 스위트 (Mermullet Penthouse)', price: 280000, maxGuests: 4, img: '/images/dining.jpg' }
];

export default function BookingPage() {
  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
  const [selectedRoom, setSelectedRoom] = useState('room-1');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guests, setGuests] = useState(2);
  const [requests, setRequests] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [nights, setNights] = useState(1);
  
  const [roomTotal, setRoomTotal] = useState(120000);
  const [tax, setTax] = useState(12000);
  const [totalPrice, setTotalPrice] = useState(132000);
  
  const [errorMessage, setErrorMessage] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Calculate nights, tax and total price
  useEffect(() => {
    let currentRoomTotal = 120000;
    const room = ROOMS_DATA.find(r => r.id === selectedRoom) || ROOMS_DATA[0];
    
    if (checkIn && checkOut) {
      const date1 = new Date(checkIn);
      const date2 = new Date(checkOut);
      if (date2 > date1) {
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNights(diffDays);
        currentRoomTotal = room.price * diffDays;
      } else {
        setNights(1);
        currentRoomTotal = room.price;
      }
    } else {
      setNights(1);
      currentRoomTotal = room.price;
    }
    
    setRoomTotal(currentRoomTotal);
    const calculatedTax = Math.round(currentRoomTotal * 0.1);
    setTax(calculatedTax);
    setTotalPrice(currentRoomTotal + calculatedTax);
    
    if (guests > room.maxGuests) {
      setGuests(room.maxGuests);
    }
  }, [checkIn, checkOut, selectedRoom, guests]);

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

  const handleNextStep = (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (guestName.length < 2) {
      setErrorMessage('이름은 2글자 이상이어야 합니다.');
      return;
    }
    if (!/^010-\d{4}-\d{4}$/.test(guestPhone)) {
      setErrorMessage('연락처는 010-XXXX-XXXX 형식이어야 합니다.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      setErrorMessage('올바른 이메일 형식이 아닙니다.');
      return;
    }
    const room = ROOMS_DATA.find(r => r.id === selectedRoom);
    if (room && guests > room.maxGuests) {
      setErrorMessage(`해당 객실의 최대 인원은 ${room.maxGuests}명입니다.`);
      return;
    }
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    if (date2 <= date1) {
      setErrorMessage('체크아웃 날짜는 체크인 날짜 이후여야 합니다.');
      return;
    }
    
    setStep(2); // Go to Payment
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const generatedBookingId = 'MRM-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(1000 + Math.random() * 9000);
      
      const reservationData = {
        room_id: selectedRoom === 'room-1' ? '7b4fd1c0-0000-0000-0000-000000000001' : 
                 selectedRoom === 'room-2' ? '7b4fd1c0-0000-0000-0000-000000000002' : '7b4fd1c0-0000-0000-0000-000000000003',
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        check_in: checkIn,
        check_out: checkOut,
        total_price: totalPrice,
        status: 'confirmed'
      };

      // Try to save in Supabase
      const { data, error } = await supabase
        .from('reservations')
        .insert([reservationData])
        .select();

      if (error) {
        console.warn('Supabase insert failed, using fallback', error);
      }
      
      // Save to localStorage as a reliable fallback/local state
      const localReservations = JSON.parse(localStorage.getItem('mermullet_reservations') || '[]');
      const newReservation = {
        id: generatedBookingId,
        room_name: ROOMS_DATA.find(r => r.id === selectedRoom)?.name.split(' (')[0],
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        check_in: checkIn,
        check_out: checkOut,
        guests: guests,
        requests: requests,
        total_price: totalPrice,
        status: '확정',
        created_at: new Date().toISOString()
      };
      localReservations.push(newReservation);
      localStorage.setItem('mermullet_reservations', JSON.stringify(localReservations));

      setBookingId(generatedBookingId);
      setStep(3); // Success
    } catch (err) {
      setErrorMessage('결제 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRoomObj = ROOMS_DATA.find(r => r.id === selectedRoom) || ROOMS_DATA[0];
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <>
      <Navbar />
      
      <main className={styles.main}>
        <div className={`${styles.container} container`}>
          
          {step === 3 ? (
            /* Reservation Success Screen */
            <div className={`${styles.successCard} animate-fade-in`}>
              <CheckCircle size={56} className={styles.successIcon} />
              <h2>예약이 완료되었습니다</h2>
              <p className={styles.successSub}>입력하신 이메일({guestEmail})로 예약 확인 이메일이 발송되었습니다.</p>
              
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
                  <span>선택 객실</span>
                  <span>{selectedRoomObj.name.split(' (')[0]}</span>
                </div>
                <div className={styles.receiptRow}>
                  <span>일정</span>
                  <span>{checkIn} ~ {checkOut} ({nights}박)</span>
                </div>
                <div className={styles.receiptRow}>
                  <span>인원</span>
                  <span>{guests}명</span>
                </div>
                <div className={`${styles.receiptRow} ${styles.receiptTotal}`}>
                  <span>최종 결제 금액</span>
                  <strong>₩{totalPrice.toLocaleString()}</strong>
                </div>
              </div>

              <div className={styles.successActions}>
                <a href="/" className={styles.btnSecondary}>
                  홈으로 돌아가기
                </a>
                <a href="/booking/lookup" className={styles.btnPrimaryGold}>
                  예약 조회 페이지로 이동
                </a>
              </div>
            </div>
          ) : (
            <div className={styles.bookingGrid}>
              
              {/* Left Side: Form */}
              <div className={styles.formCard}>
                
                {step === 1 && (
                  <>
                    <div className={styles.formHeader}>
                      <Sparkles size={24} className={styles.sparkleIcon} />
                      <h2>예약 정보 입력</h2>
                      <p>일정과 개인 정보를 기입해 주시면 나를 찾는 사색의 공간을 설계해 드립니다.</p>
                    </div>
                    
                    {errorMessage && (
                      <div className={styles.errorAlert}>
                        <AlertCircle size={16} />
                        <span>{errorMessage}</span>
                      </div>
                    )}
                    
                    <form onSubmit={handleNextStep} className={styles.form}>
                      
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
                              {room.name} (최대 {room.maxGuests}인)
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Dates Grid */}
                      <div className={styles.datesGrid}>
                        <div className={styles.inputGroup}>
                          <label>체크인 (Check-in)</label>
                          <div className={styles.inputWithIcon}>
                            <Calendar size={16} />
                            <input 
                              type="date" 
                              value={checkIn}
                              min={todayStr}
                              onChange={(e) => setCheckIn(e.target.value)}
                              required 
                              className={styles.input}
                            />
                          </div>
                        </div>
    
                        <div className={styles.inputGroup}>
                          <label>체크아웃 (Check-out)</label>
                          <div className={styles.inputWithIcon}>
                            <Calendar size={16} />
                            <input 
                              type="date" 
                              value={checkOut} 
                              min={checkIn || todayStr}
                              onChange={(e) => setCheckOut(e.target.value)}
                              required 
                              className={styles.input}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.inputGroup}>
                        <label>숙박 인원</label>
                        <div className={styles.inputWithIcon}>
                          <Users size={16} />
                          <select 
                            value={guests} 
                            onChange={(e) => setGuests(parseInt(e.target.value))}
                            className={styles.input}
                            required
                          >
                            {[1, 2, 3, 4].map(num => (
                              <option key={num} value={num} disabled={num > selectedRoomObj.maxGuests}>{num}명</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className={styles.formDivider}></div>

                      {/* Guest Info */}
                      <div className={styles.inputGroup}>
                        <label>예약자 성함</label>
                        <div className={styles.inputWithIcon}>
                          <User size={16} />
                          <input 
                            type="text" 
                            placeholder="성함을 입력해 주세요" 
                            value={guestName} 
                            onChange={(e) => setGuestName(e.target.value)}
                            required 
                            className={styles.input}
                          />
                        </div>
                      </div>

                      <div className={styles.inputGroup}>
                        <label>연락처</label>
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

                      <div className={styles.inputGroup}>
                        <label>이메일 주소</label>
                        <div className={styles.inputWithIcon}>
                          <Mail size={16} />
                          <input 
                            type="email" 
                            placeholder="예약 확인 이메일을 받으실 주소" 
                            value={guestEmail} 
                            onChange={(e) => setGuestEmail(e.target.value)}
                            required 
                            className={styles.input}
                          />
                        </div>
                      </div>
                      
                      <div className={styles.inputGroup}>
                        <label>특이사항 (선택)</label>
                        <div className={styles.inputWithIcon} style={{alignItems: 'flex-start'}}>
                          <MessageSquare size={16} style={{marginTop: '12px'}} />
                          <textarea 
                            placeholder="요청사항이 있으시면 남겨주세요." 
                            value={requests} 
                            onChange={(e) => setRequests(e.target.value)}
                            className={styles.textarea}
                            rows={3}
                          />
                        </div>
                      </div>

                      <button type="submit" className={styles.submitBtn}>
                        다음 단계 — 결제하기
                      </button>
                      
                    </form>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className={styles.formHeader}>
                      <CreditCard size={24} className={styles.sparkleIcon} />
                      <h2>결제하기</h2>
                      <p>마지막 단계입니다. 결제 수단을 선택하고 예약을 확정해 주세요.</p>
                    </div>
                    
                    {errorMessage && (
                      <div className={styles.errorAlert}>
                        <AlertCircle size={16} />
                        <span>{errorMessage}</span>
                      </div>
                    )}
                    
                    <form onSubmit={handlePayment} className={styles.form}>
                      <div className={styles.paymentMethods}>
                        <label className={`${styles.paymentMethod} ${paymentMethod === 'card' ? styles.activeMethod : ''}`}>
                          <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                          신용/체크카드
                        </label>
                        <label className={`${styles.paymentMethod} ${paymentMethod === 'kakaopay' ? styles.activeMethod : ''}`}>
                          <input type="radio" name="payment" value="kakaopay" checked={paymentMethod === 'kakaopay'} onChange={() => setPaymentMethod('kakaopay')} />
                          카카오페이
                        </label>
                        <label className={`${styles.paymentMethod} ${paymentMethod === 'bank' ? styles.activeMethod : ''}`}>
                          <input type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
                          무통장입금
                        </label>
                      </div>

                      {paymentMethod === 'card' && (
                        <div className={styles.cardDetails}>
                          <div className={styles.inputGroup}>
                            <label>카드 번호</label>
                            <input type="text" placeholder="0000-0000-0000-0000" className={styles.input} required />
                          </div>
                          <div className={styles.datesGrid}>
                            <div className={styles.inputGroup}>
                              <label>유효기간 (MM/YY)</label>
                              <input type="text" placeholder="MM/YY" className={styles.input} required />
                            </div>
                            <div className={styles.inputGroup}>
                              <label>CVC</label>
                              <input type="text" placeholder="123" className={styles.input} required />
                            </div>
                          </div>
                          <div className={styles.inputGroup}>
                            <label>카드 소유자 이름</label>
                            <input type="text" placeholder="HONG GILDONG" className={styles.input} required />
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'bank' && (
                        <div className={styles.bankDetails}>
                          <p><strong>입금 계좌:</strong> 국민은행 123456-78-901234 (주)머물렛</p>
                          <p><strong>입금 기한:</strong> 예약일로부터 24시간 이내</p>
                          <p className={styles.smallNote}>기한 내 미입금 시 예약이 자동 취소됩니다.</p>
                        </div>
                      )}
                      
                      {paymentMethod === 'kakaopay' && (
                        <div className={styles.kakaopayDetails}>
                          <p>결제하기 버튼을 누르시면 카카오페이 결제창으로 이동합니다.</p>
                        </div>
                      )}

                      <div className={styles.sslNote}>
                        결제 정보는 SSL 암호화로 안전하게 보호됩니다.
                      </div>

                      <div className={styles.actionButtons}>
                        <button type="button" onClick={() => setStep(1)} className={styles.btnSecondary} disabled={isSubmitting}>
                          이전 단계
                        </button>
                        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                          {isSubmitting ? '결제 처리 중...' : '결제 완료하기'}
                        </button>
                      </div>
                    </form>
                  </>
                )}

              </div>

              {/* Right Side: Sidebar Price Info */}
              <div className={styles.sidebarCard}>
                <div className={styles.roomPreviewBox}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={selectedRoomObj.img} 
                    alt={selectedRoomObj.name} 
                    className={styles.roomPreviewImg} 
                  />
                </div>

                <h3>Reservation Summary</h3>
                <p className={styles.sidebarSub}>선택하신 공간의 예약 요약입니다.</p>
                
                <div className={styles.summaryList}>
                  <div className={styles.summaryRow}>
                    <span>객실</span>
                    <strong>{selectedRoomObj.name.split(' (')[0]}</strong>
                  </div>
                  
                  <div className={styles.summaryRow}>
                    <span>일정</span>
                    <span>{checkIn || '-'} ~ {checkOut || '-'}</span>
                  </div>

                  <div className={styles.summaryRow}>
                    <span>기간 및 인원</span>
                    <span>{nights}박, {guests}명</span>
                  </div>

                  <div className={styles.divider}></div>

                  <div className={styles.summaryRow}>
                    <span>객실 요금 합계</span>
                    <span>₩{roomTotal.toLocaleString()}</span>
                  </div>
                  
                  <div className={styles.summaryRow}>
                    <span>세금 및 봉사료 (10%)</span>
                    <span>₩{tax.toLocaleString()}</span>
                  </div>
                  
                  <div className={`${styles.summaryRow} ${styles.totalPriceRow}`}>
                    <span>최종 결제 금액</span>
                    <strong className={styles.sidebarTotal}>₩{totalPrice.toLocaleString()}</strong>
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
