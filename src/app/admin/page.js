'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { supabase } from '../../lib/supabase';
import { 
  Users, Calendar as CalendarIcon, DollarSign, Check, X, Trash2, 
  Search, ShieldAlert, Sparkles, Filter, RefreshCw, LogOut,
  LayoutDashboard, CalendarOff, Home as HomeIcon, PieChart, TrendingUp,
  TrendingDown, Download, Plus
} from 'lucide-react';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isApprovedAdmin, setIsApprovedAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [activeTab, setActiveTab] = useState('finance');
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Admin List
  const [adminsList, setAdminsList] = useState([]);
  
  // Finances / Expenses
  const [expenses, setExpenses] = useState([]);
  const todayStr = new Date().toISOString().split('T')[0];
  const [expenseForm, setExpenseForm] = useState({ 
    date: todayStr, 
    category: '청소비', 
    name: '', 
    amount: '', 
    memo: '' 
  });

  const EXPENSE_CATEGORIES = ['청소비', '소모품', '수도·전기·가스', '수리·유지비', '식음료(어메니티)', '마케팅·광고', '플랫폼 수수료', '기타'];

  // Rooms Management
  const [rooms, setRooms] = useState([]);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editRoomForm, setEditRoomForm] = useState({});

  // Blocked Dates Management
  const [blockedDates, setBlockedDates] = useState([]);
  const [blockForm, setBlockForm] = useState({ date: todayStr, reason: '', room: 'all' });

  useEffect(() => {
    const localBlocked = JSON.parse(localStorage.getItem('mermullet_blocked_dates') || '[]');
    setBlockedDates(localBlocked);
  }, []);

  const handleAddBlockDate = (e) => {
    e.preventDefault();
    if (blockedDates.some(b => b.date === blockForm.date && b.room === blockForm.room)) {
      alert('이미 해당 조건으로 차단된 날짜입니다.');
      return;
    }
    const newBlock = { id: Date.now().toString(), ...blockForm };
    const updated = [...blockedDates, newBlock].sort((a, b) => new Date(a.date) - new Date(b.date));
    setBlockedDates(updated);
    localStorage.setItem('mermullet_blocked_dates', JSON.stringify(updated));
    setBlockForm({ ...blockForm, reason: '' });
  };

  const handleRemoveBlockDate = (id) => {
    if (!confirm('차단을 해제하고 예약을 다시 받으시겠습니까?')) return;
    const updated = blockedDates.filter(b => b.id !== id);
    setBlockedDates(updated);
    localStorage.setItem('mermullet_blocked_dates', JSON.stringify(updated));
  };

  useEffect(() => {
    const localRooms = JSON.parse(localStorage.getItem('mermullet_rooms') || '[]');
    if (localRooms.length === 0) {
      const defaultRooms = [
        { id: 'room-1', name: '소나무 채 (Deluxe Ocean Suite)', basePrice: 120000, peakPrice: 160000, description: '바다가 보이는 프라이빗 스위트룸입니다.', amenities: 'King Bed, Ocean View, Mini Bar, 욕조', isActive: true },
        { id: 'room-2', name: '달빛 온돌방 (Executive Pool Villa)', basePrice: 180000, peakPrice: 220000, description: '전통 한옥의 멋과 현대적 풀빌라의 조화.', amenities: 'Private Pool, 온돌방, BBQ, 주방', isActive: true },
        { id: 'room-3', name: '별빛 스위트 (Mermullet Penthouse)', basePrice: 280000, peakPrice: 350000, description: '머물렛의 시그니처 펜트하우스입니다.', amenities: 'Rooftop, 2 Bedrooms, 파티룸, Wine Cellar', isActive: true }
      ];
      localStorage.setItem('mermullet_rooms', JSON.stringify(defaultRooms));
      setRooms(defaultRooms);
    } else {
      setRooms(localRooms);
    }
  }, []);

  const handleEditRoom = (room) => {
    setEditingRoomId(room.id);
    setEditRoomForm(room);
  };

  const handleSaveRoom = () => {
    const updated = rooms.map(r => r.id === editRoomForm.id ? editRoomForm : r);
    setRooms(updated);
    localStorage.setItem('mermullet_rooms', JSON.stringify(updated));
    setEditingRoomId(null);
  };

  const toggleRoomActive = (id) => {
    if(!confirm('객실의 활성화 상태를 변경하시겠습니까? 비활성화 시 예약이 불가능해집니다.')) return;
    const updated = rooms.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r);
    setRooms(updated);
    localStorage.setItem('mermullet_rooms', JSON.stringify(updated));
  };

  useEffect(() => {
    // Load expenses from local storage for now
    const localExpenses = JSON.parse(localStorage.getItem('mermullet_expenses') || '[]');
    setExpenses(localExpenses);
  }, []);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data);
    } catch (err) {
      const localReservations = JSON.parse(localStorage.getItem('mermullet_reservations') || '[]');
      localReservations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setReservations(localReservations);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setCheckingAuth(true);
      try {
        if (typeof window !== 'undefined' && localStorage.getItem('mermullet_dev_bypass') === 'true') {
          const mockUser = JSON.parse(localStorage.getItem('mermullet_mock_user') || '{}');
          setUser(mockUser);
          setIsApprovedAdmin(true);
          fetchReservations();
          setCheckingAuth(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }
        
        setUser(user);
        const { data: adminRecord, error } = await supabase
          .from('admins')
          .select('*')
          .eq('email', user.email.toLowerCase())
          .single();

        if (error || !adminRecord) {
          setIsApprovedAdmin(false);
        } else {
          setIsApprovedAdmin(true);
          fetchReservations();
        }
      } catch (err) {
        setIsApprovedAdmin(false);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  // Status Updaters
  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('reservations').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      const local = JSON.parse(localStorage.getItem('mermullet_reservations') || '[]');
      const updated = local.map(r => r.id === id ? { ...r, status: newStatus } : r);
      localStorage.setItem('mermullet_reservations', JSON.stringify(updated));
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    }
  };

  const deleteReservation = async (id) => {
    if (!confirm('정말로 이 예약을 삭제하시겠습니까?')) return;
    try {
      const { error } = await supabase.from('reservations').delete().eq('id', id);
      if (error) throw error;
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      const local = JSON.parse(localStorage.getItem('mermullet_reservations') || '[]');
      const updated = local.filter(r => r.id !== id);
      localStorage.setItem('mermullet_reservations', JSON.stringify(updated));
      setReservations(prev => prev.filter(r => r.id !== id));
    }
  };

  // Finance Logic
  const handleAddExpense = (e) => {
    e.preventDefault();
    const newExp = { 
      id: Date.now().toString(), 
      ...expenseForm, 
      amount: Number(expenseForm.amount) 
    };
    const updated = [newExp, ...expenses].sort((a,b) => new Date(b.date) - new Date(a.date));
    setExpenses(updated);
    localStorage.setItem('mermullet_expenses', JSON.stringify(updated));
    setExpenseForm({ ...expenseForm, name: '', amount: '', memo: '' });
  };

  const handleDeleteExpense = (id) => {
    if(!confirm('지출 내역을 삭제하시겠습니까?')) return;
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    localStorage.setItem('mermullet_expenses', JSON.stringify(updated));
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM for Excel
    csvContent += "구분,날짜,항목/객실,결제금액(원),세금/수수료차감 실수령액(원),비고\n";
    
    // Revenue
    reservations.filter(r => r.status === 'confirmed' || r.status === '확정').forEach(r => {
      const net = Math.round(r.total_price * 0.875);
      csvContent += `매출,${r.created_at?.split('T')[0] || r.check_in},${r.room_name},${r.total_price},${net},예약번호: ${r.id}\n`;
    });
    
    // Expenses
    expenses.forEach(e => {
      csvContent += `지출,${e.date},[${e.category}] ${e.name},${e.amount},${e.amount},${e.memo || ''}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mermullet_finance_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats Calculation
  const todayDate = new Date();
  const currentMonthPrefix = todayStr.substring(0, 7);
  const lastMonthDate = new Date(todayDate.getFullYear(), todayDate.getMonth() - 1, 1);
  const lastMonthPrefix = lastMonthDate.toISOString().substring(0, 7);

  const calcMetrics = (monthPrefix) => {
    const rev = reservations
      .filter(r => (r.created_at?.startsWith(monthPrefix) || r.check_in?.startsWith(monthPrefix)) && (r.status === 'confirmed' || r.status === '확정'))
      .reduce((sum, r) => sum + Number(r.total_price || 0), 0);
    const exp = expenses
      .filter(e => e.date?.startsWith(monthPrefix))
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);
    return { rev, exp, profit: rev - exp };
  };

  const thisMonthMetrics = calcMetrics(currentMonthPrefix);
  const lastMonthMetrics = calcMetrics(lastMonthPrefix);

  const getPercentChange = (current, previous) => {
    if (previous === 0) return current > 0 ? { text: '+100%', up: true } : { text: '0%', up: true };
    const change = ((current - previous) / previous) * 100;
    return { 
      text: (change > 0 ? '+' : '') + change.toFixed(1) + '%', 
      up: change >= 0 
    };
  };

  const revChange = getPercentChange(thisMonthMetrics.rev, lastMonthMetrics.rev);
  const expChange = getPercentChange(thisMonthMetrics.exp, lastMonthMetrics.exp);
  const profChange = getPercentChange(thisMonthMetrics.profit, lastMonthMetrics.profit);

  const filteredReservations = reservations.filter((r) => {
    const matchesSearch = 
      r.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.guest_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (checkingAuth) {
    return (
      <main className={styles.main}>
        <div className={styles.authLoading}><RefreshCw size={44} className={styles.spin} /></div>
      </main>
    );
  }

  if (!isApprovedAdmin) {
    return (
      <main className={styles.main}>
        <div className={`${styles.deniedCard} glass`}>
          <ShieldAlert size={60} className={styles.deniedIcon} />
          <h2>어드민 접근 권한 제한</h2>
          <button onClick={() => router.push('/')}>홈으로</button>
        </div>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={`${styles.container} container`}>
          <div className={styles.header}>
            <div>
              <div className={styles.headerBadge}>
                <Sparkles size={14} />
                <span>ADMIN CONSOLE</span>
              </div>
              <h2>머물렛 통합 관리 시스템</h2>
            </div>
            
            {activeTab === 'finance' && (
              <button onClick={handleExportCSV} className={styles.exportBtn}>
                <Download size={16} />
                <span>엑셀(CSV) 내보내기</span>
              </button>
            )}
          </div>

          <div className={styles.tabNav}>
            <button onClick={() => setActiveTab('dashboard')} className={`${styles.tabBtn} ${activeTab === 'dashboard' ? styles.activeTab : ''}`}>
              <LayoutDashboard size={16} /> 대시보드
            </button>
            <button onClick={() => setActiveTab('reservations')} className={`${styles.tabBtn} ${activeTab === 'reservations' ? styles.activeTab : ''}`}>
              <CalendarIcon size={16} /> 예약 목록
            </button>
            <button onClick={() => setActiveTab('finance')} className={`${styles.tabBtn} ${activeTab === 'finance' ? styles.activeTab : ''}`}>
              <PieChart size={16} /> 재무 관리
            </button>
            <button onClick={() => setActiveTab('rooms')} className={`${styles.tabBtn} ${activeTab === 'rooms' ? styles.activeTab : ''}`}>
              <HomeIcon size={16} /> 객실 관리
            </button>
            <button onClick={() => setActiveTab('block')} className={`${styles.tabBtn} ${activeTab === 'block' ? styles.activeTab : ''}`}>
              <CalendarOff size={16} /> 차단 날짜 관리
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <div className={styles.dashboardSection}>
              <div className={styles.statsGrid}>
                <div className={`${styles.statsCard} glass`}>
                  <p>이번 달 총 매출</p>
                  <h3 className={styles.revenueColor}>₩{thisMonthMetrics.rev.toLocaleString()}</h3>
                </div>
                <div className={`${styles.statsCard} glass`}>
                  <p>이번 달 총 지출</p>
                  <h3 className={styles.expenseColor}>₩{thisMonthMetrics.exp.toLocaleString()}</h3>
                </div>
                <div className={`${styles.statsCard} glass`}>
                  <p>이번 달 순이익</p>
                  <h3 className={styles.profitColor}>₩{thisMonthMetrics.profit.toLocaleString()}</h3>
                </div>
                <div className={`${styles.statsCard} glass`}>
                  <p>이번 달 예약 건수</p>
                  <h3>{reservations.filter(r => r.created_at?.startsWith(currentMonthPrefix)).length} 건</h3>
                </div>
              </div>
              
              <div className={styles.dashboardSplit}>
                <div className={`${styles.recentBox} glass`}>
                  <h4>최근 예약 현황 (5건)</h4>
                  <table className={styles.simpleTable}>
                    <thead>
                      <tr>
                        <th>예약자</th>
                        <th>객실</th>
                        <th>일정</th>
                        <th>상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.slice(0, 5).map(r => (
                        <tr key={r.id}>
                          <td>{r.guest_name}</td>
                          <td>{r.room_name?.split('(')[0]}</td>
                          <td>{r.check_in}</td>
                          <td><span className={`${styles.miniBadge} ${r.status === '확정' || r.status === 'confirmed' ? styles.miniConfirmed : ''}`}>{r.status === 'confirmed' ? '확정' : r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className={`${styles.tableWrapper} glass`}>
              {/* ... existing reservations table code ... */}
              <div className={styles.controlsBar}>
                <div className={styles.searchBox}>
                  <Search size={18} />
                  <input type="text" placeholder="예약자명 또는 예약번호 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.filterSelect}>
                  <option value="all">모든 예약 상태</option>
                  <option value="pending">대기중</option>
                  <option value="confirmed">확정됨</option>
                  <option value="cancelled">취소됨</option>
                </select>
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>예약 ID</th>
                    <th>예약자 정보</th>
                    <th>객실</th>
                    <th>일정</th>
                    <th>상태</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((res) => (
                    <tr key={res.id}>
                      <td>{res.id?.substring(0, 8)}</td>
                      <td>{res.guest_name}<br/>{res.guest_phone}</td>
                      <td>{res.room_name?.split('(')[0]}</td>
                      <td>{res.check_in} ~ {res.check_out}</td>
                      <td>{res.status}</td>
                      <td className={styles.actionsCell}>
                         <button onClick={() => updateStatus(res.id, 'confirmed')} title="승인" className={styles.confirmBtn}><Check size={14} /></button>
                         <button onClick={() => updateStatus(res.id, 'cancelled')} title="취소" className={styles.cancelBtn}><X size={14} /></button>
                         <button onClick={() => deleteReservation(res.id)} title="삭제" className={styles.deleteBtn}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className={styles.financeContainer}>
              {/* Top Summary */}
              <div className={styles.financeSummaryGrid}>
                <div className={`${styles.financeCard} glass`}>
                  <div className={styles.fCardHeader}>
                    <span>이번 달 총 매출</span>
                    <div className={`${styles.trendBadge} ${revChange.up ? styles.trendUp : styles.trendDown}`}>
                      {revChange.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {revChange.text}
                    </div>
                  </div>
                  <h3 className={styles.revenueColor}>₩{thisMonthMetrics.rev.toLocaleString()}</h3>
                </div>
                <div className={`${styles.financeCard} glass`}>
                  <div className={styles.fCardHeader}>
                    <span>이번 달 총 지출</span>
                    <div className={`${styles.trendBadge} ${!expChange.up ? styles.trendUp : styles.trendDown}`}>
                      {expChange.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {expChange.text}
                    </div>
                  </div>
                  <h3 className={styles.expenseColor}>₩{thisMonthMetrics.exp.toLocaleString()}</h3>
                </div>
                <div className={`${styles.financeCard} glass`}>
                  <div className={styles.fCardHeader}>
                    <span>이번 달 순이익</span>
                    <div className={`${styles.trendBadge} ${profChange.up ? styles.trendUp : styles.trendDown}`}>
                      {profChange.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {profChange.text}
                    </div>
                  </div>
                  <h3 className={styles.profitColor}>₩{thisMonthMetrics.profit.toLocaleString()}</h3>
                </div>
              </div>

              {/* Main Content Split */}
              <div className={styles.financeSplit}>
                
                {/* Left: Revenue List */}
                <div className={`${styles.financePanel} glass`}>
                  <div className={styles.panelHeader}>
                    <h4>매출 현황 (이번 달 확정 예약)</h4>
                    <span className={styles.panelSubtitle}>*실수령액은 세금(10%) 및 수수료(2.5%) 공제 후 금액입니다.</span>
                  </div>
                  <div className={styles.tableScroll}>
                    <table className={styles.simpleTable}>
                      <thead>
                        <tr>
                          <th>일자</th>
                          <th>객실</th>
                          <th>결제액</th>
                          <th>실수령액</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations
                          .filter(r => (r.created_at?.startsWith(currentMonthPrefix) || r.check_in?.startsWith(currentMonthPrefix)) && (r.status === 'confirmed' || r.status === '확정'))
                          .map(r => {
                            const net = Math.round(r.total_price * 0.875);
                            return (
                              <tr key={r.id}>
                                <td>{r.created_at?.split('T')[0] || r.check_in}</td>
                                <td>{r.room_name?.split('(')[0]}</td>
                                <td>{Number(r.total_price).toLocaleString()}</td>
                                <td className={styles.revenueColor}><strong>{net.toLocaleString()}</strong></td>
                              </tr>
                            );
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Expenses Input & List */}
                <div className={`${styles.financePanel} glass`}>
                  <div className={styles.panelHeader}>
                    <h4>지출 관리</h4>
                  </div>
                  
                  <form onSubmit={handleAddExpense} className={styles.expenseForm}>
                    <div className={styles.expInputRow}>
                      <input type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} required className={styles.expInput} />
                      <select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} className={styles.expInput}>
                        {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className={styles.expInputRow}>
                      <input type="text" placeholder="지출 항목명 (예: 객실 샴푸 리필)" value={expenseForm.name} onChange={e => setExpenseForm({...expenseForm, name: e.target.value})} required className={styles.expInput} style={{flex: 1.5}} />
                      <input type="number" placeholder="금액 (원)" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} required className={styles.expInput} style={{flex: 1}} />
                    </div>
                    <div className={styles.expInputRow}>
                      <input type="text" placeholder="메모 (선택)" value={expenseForm.memo} onChange={e => setExpenseForm({...expenseForm, memo: e.target.value})} className={styles.expInput} style={{flex: 1}} />
                      <button type="submit" className={styles.expSubmitBtn}><Plus size={16}/> 등록</button>
                    </div>
                  </form>

                  <div className={styles.tableScroll} style={{marginTop: '20px'}}>
                    <table className={styles.simpleTable}>
                      <thead>
                        <tr>
                          <th>일자</th>
                          <th>카테고리</th>
                          <th>항목명</th>
                          <th>금액</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.filter(e => e.date?.startsWith(currentMonthPrefix)).map(e => (
                          <tr key={e.id}>
                            <td>{e.date.substring(5)}</td>
                            <td><span className={styles.miniBadge}>{e.category}</span></td>
                            <td>{e.name}</td>
                            <td className={styles.expenseColor}>{Number(e.amount).toLocaleString()}</td>
                            <td>
                              <button onClick={() => handleDeleteExpense(e.id)} className={styles.deleteMiniBtn}><X size={14}/></button>
                            </td>
                          </tr>
                        ))}
                        {expenses.length === 0 && (
                          <tr><td colSpan="5" style={{textAlign:'center', color:'#9ca3af', padding:'20px'}}>등록된 지출 내역이 없습니다.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}
          
          {activeTab === 'rooms' && (
            <div className={styles.roomsContainer}>
              <div className={styles.roomsHeader}>
                <h3>객실 정보 및 운영 관리</h3>
                <p>객실의 요금, 설명, 어메니티를 수정하고 예약 가능 여부를 설정합니다.</p>
              </div>

              <div className={styles.roomsList}>
                {rooms.map(room => (
                  <div key={room.id} className={`${styles.roomCard} glass ${!room.isActive ? styles.roomInactive : ''}`}>
                    {editingRoomId === room.id ? (
                      <div className={styles.roomEditForm}>
                        <h4>{room.name} 수정</h4>
                        <div className={styles.expInputRow}>
                          <div style={{flex: 1}}>
                            <label>비수기 요금(기본)</label>
                            <input type="number" value={editRoomForm.basePrice} onChange={e => setEditRoomForm({...editRoomForm, basePrice: Number(e.target.value)})} className={styles.expInput} />
                          </div>
                          <div style={{flex: 1}}>
                            <label>성수기 요금</label>
                            <input type="number" value={editRoomForm.peakPrice} onChange={e => setEditRoomForm({...editRoomForm, peakPrice: Number(e.target.value)})} className={styles.expInput} />
                          </div>
                        </div>
                        <div>
                          <label>객실 설명</label>
                          <textarea value={editRoomForm.description} onChange={e => setEditRoomForm({...editRoomForm, description: e.target.value})} className={styles.roomTextarea} rows={3} />
                        </div>
                        <div>
                          <label>어메니티 (쉼표로 구분)</label>
                          <input type="text" value={editRoomForm.amenities} onChange={e => setEditRoomForm({...editRoomForm, amenities: e.target.value})} className={styles.expInput} />
                        </div>
                        <div className={styles.roomEditActions}>
                          <button onClick={() => setEditingRoomId(null)} className={styles.cancelRoomBtn}>취소</button>
                          <button onClick={handleSaveRoom} className={styles.saveRoomBtn}>저장하기</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={styles.roomCardTop}>
                          <div className={styles.roomTitle}>
                            <h4>{room.name}</h4>
                            <span className={`${styles.roomStatusBadge} ${room.isActive ? styles.badgeActive : styles.badgeDisabled}`}>
                              {room.isActive ? '운영 중' : '비활성화(예약불가)'}
                            </span>
                          </div>
                          <div className={styles.roomActions}>
                            <button onClick={() => toggleRoomActive(room.id)} className={styles.toggleActiveBtn}>
                              {room.isActive ? '객실 비활성화' : '객실 활성화'}
                            </button>
                            <button onClick={() => handleEditRoom(room)} className={styles.editRoomBtn}>정보 수정</button>
                          </div>
                        </div>
                        <div className={styles.roomDetailsGrid}>
                          <div className={styles.roomDetailItem}>
                            <span>기본 1박 요금</span>
                            <strong>₩{Number(room.basePrice).toLocaleString()}</strong>
                          </div>
                          <div className={styles.roomDetailItem}>
                            <span>성수기 1박 요금</span>
                            <strong>₩{Number(room.peakPrice).toLocaleString()}</strong>
                          </div>
                          <div className={styles.roomDetailItem} style={{gridColumn: '1 / -1'}}>
                            <span>설명</span>
                            <p>{room.description}</p>
                          </div>
                          <div className={styles.roomDetailItem} style={{gridColumn: '1 / -1'}}>
                            <span>어메니티</span>
                            <p>{room.amenities}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'block' && (
            <div className={styles.blockContainer}>
              <div className={styles.blockHeader}>
                <h3>예약 차단(블록) 날짜 관리</h3>
                <p>내부 수리, 워크숍, 개인 사정 등으로 예약을 받지 않을 날짜를 수동으로 지정합니다.</p>
              </div>

              <div className={styles.blockSplit}>
                {/* Left: Add Block Form */}
                <div className={`${styles.blockPanel} glass`}>
                  <h4>신규 차단 등록</h4>
                  <form onSubmit={handleAddBlockDate} className={styles.blockForm}>
                    <div className={styles.inputGroup}>
                      <label>차단 대상 객실</label>
                      <select 
                        value={blockForm.room} 
                        onChange={e => setBlockForm({...blockForm, room: e.target.value})}
                        className={styles.expInput}
                      >
                        <option value="all">전 객실 차단 (펜션 전체)</option>
                        {rooms.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className={styles.inputGroup}>
                      <label>차단 날짜 지정</label>
                      <input 
                        type="date" 
                        value={blockForm.date} 
                        onChange={e => setBlockForm({...blockForm, date: e.target.value})}
                        className={styles.expInput}
                        required
                        min={todayStr}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>차단 사유 (메모)</label>
                      <input 
                        type="text" 
                        placeholder="예: 객실 보수 공사, 가족 워크숍" 
                        value={blockForm.reason} 
                        onChange={e => setBlockForm({...blockForm, reason: e.target.value})}
                        className={styles.expInput}
                        required
                      />
                    </div>

                    <button type="submit" className={styles.blockSubmitBtn}>
                      <CalendarOff size={16} /> 해당 날짜 예약 차단하기
                    </button>
                  </form>
                </div>

                {/* Right: Blocked Dates List */}
                <div className={`${styles.blockPanel} glass`}>
                  <h4>차단된 날짜 목록</h4>
                  <div className={styles.blockedList}>
                    {blockedDates.length === 0 ? (
                      <div className={styles.emptyBlock}>
                        현재 수동으로 차단된 날짜가 없습니다.
                      </div>
                    ) : (
                      blockedDates.map(b => (
                        <div key={b.id} className={styles.blockedItem}>
                          <div className={styles.blockedItemLeft}>
                            <div className={styles.blockedDateBox}>
                              <span className={styles.bMonth}>{new Date(b.date).getMonth() + 1}월</span>
                              <span className={styles.bDay}>{new Date(b.date).getDate()}</span>
                            </div>
                            <div className={styles.blockedInfo}>
                              <span className={styles.bRoomBadge}>{b.room === 'all' ? '전 객실 차단' : rooms.find(r => r.id === b.room)?.name || '특정 객실'}</span>
                              <span className={styles.bReason}>{b.reason}</span>
                            </div>
                          </div>
                          <button onClick={() => handleRemoveBlockDate(b.id)} className={styles.unblockBtn}>
                            차단 해제
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </main>
    </>
  );
}
