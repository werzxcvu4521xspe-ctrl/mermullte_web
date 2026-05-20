'use client';

import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { supabase } from '../../../lib/supabase';
import styles from './lookup.module.css';
import { Search } from 'lucide-react';

export default function BookingLookupPage() {
  const [bookingId, setBookingId] = useState('');
  const [email, setEmail] = useState('');
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setReservation(null);

    try {
      // 1. 먼저 로컬 스토리지 데이터 확인 (예약 시스템 Fallback 반영)
      const localData = JSON.parse(localStorage.getItem('mermullet_reservations') || '[]');
      const localRes = localData.find(r => r.id === bookingId && r.guest_email === email);

      if (localRes) {
        setReservation(localRes);
        setIsLoading(false);
        return;
      }

      // 2. 로컬에 없으면 Supabase 데이터베이스 조회
      const { data, error: sbError } = await supabase
        .from('reservations')
        .select(`*, rooms (name)`)
        .eq('id', bookingId)
        .eq('guest_email', email)
        .single();

      if (sbError || !data) {
        setError('입력하신 정보와 일치하는 예약 내역이 없습니다.');
      } else {
        setReservation({
          id: data.id,
          room_name: data.rooms?.name || '알 수 없는 객실',
          check_in: data.check_in,
          check_out: data.check_out,
          guests: data.guests || 2,
          total_price: data.total_price,
          status: data.status === 'confirmed' ? '확정' : data.status === 'cancelled' ? '취소 완료' : '완료'
        });
      }
    } catch (err) {
      setError('예약 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirmCancel = window.confirm('정말 취소하시겠어요? 체크인 3일 전이므로 전액 환불됩니다.');
    if (!confirmCancel) return;

    try {
      // 1. 로컬 스토리지 업데이트 시도
      const localData = JSON.parse(localStorage.getItem('mermullet_reservations') || '[]');
      const index = localData.findIndex(r => r.id === reservation.id);
      
      if (index !== -1) {
        localData[index].status = '취소 완료';
        localStorage.setItem('mermullet_reservations', JSON.stringify(localData));
        setReservation({ ...reservation, status: '취소 완료' });
        alert('예약이 성공적으로 취소되었습니다. 취소 확인 이메일이 발송됩니다.');
        return;
      }

      // 2. Supabase 업데이트
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservation.id);

      if (error) throw error;
      
      setReservation({ ...reservation, status: '취소 완료' });
      alert('예약이 성공적으로 취소되었습니다. 취소 확인 이메일이 발송됩니다.');
    } catch (err) {
      alert('취소 처리 중 오류가 발생했습니다.');
    }
  };

  // 체크인 날짜가 오늘로부터 며칠 남았는지 계산
  const calculateDaysLeft = (checkInDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inDate = new Date(checkInDate);
    inDate.setHours(0, 0, 0, 0);
    const diffTime = inDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const renderResult = () => {
    const daysLeft = calculateDaysLeft(reservation.check_in);
    
    // 예약 확정 상태이고 3일 이상 남은 경우에만 취소 가능
    let displayStatus = reservation.status;
    if (displayStatus === 'confirmed') displayStatus = '예약 확정';
    if (displayStatus === 'cancelled') displayStatus = '취소 완료';
    
    const canCancel = (displayStatus === '확정' || displayStatus === '예약 확정') && daysLeft >= 3;

    return (
      <div className={styles.resultCard}>
        <div className={styles.header}>
          <h2>예약 상세 내역</h2>
        </div>

        <div className={`${styles.statusBadge} ${displayStatus === '취소 완료' ? styles.statusCancelled : styles.statusConfirmed}`}>
          {displayStatus}
        </div>

        <div className={styles.detailRow}>
          <span>예약 번호</span>
          <strong>{reservation.id}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>예약 객실</span>
          <strong>{reservation.room_name}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>일정</span>
          <strong>{reservation.check_in} ~ {reservation.check_out}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>인원</span>
          <strong>{reservation.guests || 2}명</strong>
        </div>
        <div className={styles.detailRow}>
          <span>결제 금액</span>
          <strong>₩{Number(reservation.total_price).toLocaleString()}</strong>
        </div>

        <div className={styles.cancelSection}>
          <button 
            className={styles.cancelBtn} 
            onClick={handleCancel}
            disabled={!canCancel}
          >
            예약 취소
          </button>
          {!canCancel && displayStatus !== '취소 완료' && (
            <span className={styles.cancelNotice}>체크인 3일 전까지만 예약 취소가 가능합니다.</span>
          )}
        </div>

        <button className={styles.backBtn} onClick={() => setReservation(null)}>
          다른 예약 조회하기
        </button>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          {!reservation ? (
            <>
              <div className={styles.header}>
                <Search size={32} style={{ color: 'var(--accent-gold)', marginBottom: '16px' }} />
                <h1>예약 조회 및 취소</h1>
                <p>예약 번호와 이메일 주소를 입력해 내역을 확인하세요.</p>
              </div>

              <form onSubmit={handleLookup} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>예약 번호</label>
                  <input 
                    type="text" 
                    placeholder="예: MRM-2026..."
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>예약자 이메일</label>
                  <input 
                    type="email" 
                    placeholder="예약 시 입력한 이메일 주소"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.input}
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                  {isLoading ? '조회 중...' : '예약 내역 조회하기'}
                </button>

                {error && <div className={styles.errorMsg}>{error}</div>}
              </form>
            </>
          ) : (
            renderResult()
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
