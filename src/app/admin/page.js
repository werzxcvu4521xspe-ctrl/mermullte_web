'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { supabase } from '../../lib/supabase';
import { 
  Users, Calendar, DollarSign, Check, X, Trash2, 
  Search, ShieldAlert, Sparkles, Filter, RefreshCw, LogOut
} from 'lucide-react';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isApprovedAdmin, setIsApprovedAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Admin Privilege Management state
  const [activeTab, setActiveTab] = useState('reservations');
  const [adminsList, setAdminsList] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingCount: 0,
    totalRevenue: 0
  });

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      // 1. Try to fetch from Supabase
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      setReservations(data);
    } catch (err) {
      // Fallback: Fetch from LocalStorage if Supabase is not ready yet
      console.log('Supabase fetch failed or table missing, using LocalStorage data:', err.message);
      const localReservations = JSON.parse(localStorage.getItem('mermullet_reservations') || '[]');
      
      // Inject some elegant initial mock data if completely empty so it looks breathtaking on first load!
      if (localReservations.length === 0) {
        const defaultMocks = [
          {
            id: 'RSV-824A',
            room_name: '디럭스 오션 스위트',
            guest_name: '김도훈',
            guest_email: 'dohun@gmail.com',
            guest_phone: '010-4432-8921',
            check_in: '2026-06-01',
            check_out: '2026-06-03',
            total_price: 760000,
            status: 'confirmed',
            created_at: new Date(Date.now() - 3600000 * 2).toISOString()
          },
          {
            id: 'RSV-391C',
            room_name: '머물렛 로열 펜트하우스',
            guest_name: '이지현',
            guest_email: 'jihyeon@naver.com',
            guest_phone: '010-8891-2342',
            check_in: '2026-06-15',
            check_out: '2026-06-18',
            total_price: 3600000,
            status: 'pending',
            created_at: new Date(Date.now() - 3600000 * 12).toISOString()
          },
          {
            id: 'RSV-120F',
            room_name: '이그제큐티브 풀빌라',
            guest_name: '박서연',
            guest_email: 'seoyeon@daum.net',
            guest_phone: '010-1234-9988',
            check_in: '2026-05-24',
            check_out: '2026-05-25',
            total_price: 650000,
            status: 'cancelled',
            created_at: new Date(Date.now() - 3600000 * 48).toISOString()
          }
        ];
        localStorage.setItem('mermullet_reservations', JSON.stringify(defaultMocks));
        setReservations(defaultMocks);
      } else {
        // Sort by created_at descending
        localReservations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setReservations(localReservations);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setCheckingAuth(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // If no user is logged in, redirect to login page
          router.push('/login');
          return;
        }
        
        setUser(user);

        // Check if user is in the admins table in Supabase
        const { data: adminRecord, error } = await supabase
          .from('admins')
          .select('*')
          .eq('email', user.email)
          .single();

        if (error || !adminRecord) {
          setIsApprovedAdmin(false);
        } else {
          setIsApprovedAdmin(true);
          // Only fetch reservations and admins if they are an approved admin!
          fetchReservations();
          fetchAdmins();
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        setIsApprovedAdmin(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // Calculate statistics whenever reservations list updates
  useEffect(() => {
    const total = reservations.length;
    const pending = reservations.filter(r => r.status === 'pending').length;
    
    // Revenue from confirmed bookings
    const revenue = reservations
      .filter(r => r.status === 'confirmed')
      .reduce((sum, r) => sum + Number(r.total_price || 0), 0);

    setStats({
      totalBookings: total,
      pendingCount: pending,
      totalRevenue: revenue
    });
  }, [reservations]);

  // Update Status Action (Confirm/Cancel)
  const updateStatus = async (id, newStatus) => {
    try {
      // 1. Try Supabase
      const { error } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state directly
      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
      );
    } catch (err) {
      // LocalStorage fallback
      const localReservations = JSON.parse(localStorage.getItem('mermullet_reservations') || '[]');
      const updated = localReservations.map(r => r.id === id ? { ...r, status: newStatus } : r);
      localStorage.setItem('mermullet_reservations', JSON.stringify(updated));
      
      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
      );
    }
  };

  // Delete Reservation Action
  const deleteReservation = async (id) => {
    if (!confirm('정말로 이 예약을 삭제하시겠습니까?')) return;

    try {
      // 1. Try Supabase
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      // LocalStorage fallback
      const localReservations = JSON.parse(localStorage.getItem('mermullet_reservations') || '[]');
      const updated = localReservations.filter(r => r.id !== id);
      localStorage.setItem('mermullet_reservations', JSON.stringify(updated));
      
      setReservations(prev => prev.filter(r => r.id !== id));
    }
  };

  // Filter & Search logic
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch = 
      r.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.guest_email?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Fetch Admins List
  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setAdminsList(data || []);
    } catch (err) {
      console.error('Failed to fetch admin users:', err.message);
      // Fallback local storage
      const localAdmins = JSON.parse(localStorage.getItem('mermullet_admins') || '[]');
      if (localAdmins.length === 0) {
        const defaultAdmins = [
          { email: 'werzxcvu4521xspe@gmail.com', name: '최고관리자 장유찬', created_at: new Date().toISOString() }
        ];
        localStorage.setItem('mermullet_admins', JSON.stringify(defaultAdmins));
        setAdminsList(defaultAdmins);
      } else {
        setAdminsList(localAdmins);
      }
    }
  };

  // Add a new Admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    setIsAddingAdmin(true);
    const cleanedEmail = newAdminEmail.trim().toLowerCase();
    const adminName = newAdminName.trim() || '일반 관리자';

    try {
      const { error } = await supabase
        .from('admins')
        .insert([{ email: cleanedEmail, name: adminName }]);

      if (error) throw error;

      alert(`성공: [${cleanedEmail}] 계정에 관리자 권한을 부여했습니다.`);
      setNewAdminEmail('');
      setNewAdminName('');
      fetchAdmins();
    } catch (err) {
      console.log('Supabase insert failed, using fallback:', err.message);
      // Fallback local storage
      const localAdmins = JSON.parse(localStorage.getItem('mermullet_admins') || '[]');
      if (localAdmins.some(a => a.email === cleanedEmail)) {
        alert('이미 등록된 관리자 이메일입니다.');
      } else {
        const updated = [...localAdmins, { email: cleanedEmail, name: adminName, created_at: new Date().toISOString() }];
        localStorage.setItem('mermullet_admins', JSON.stringify(updated));
        setAdminsList(updated);
        alert(`로컬 저장소에 성공: [${cleanedEmail}] 계정에 권한을 부여했습니다.`);
        setNewAdminEmail('');
        setNewAdminName('');
      }
    } finally {
      setIsAddingAdmin(false);
    }
  };

  // Remove Admin
  const handleRemoveAdmin = async (emailToRemove) => {
    if (emailToRemove === user?.email) {
      alert('자기 자신 최고관리자의 권한은 해제할 수 없습니다!');
      return;
    }

    if (!confirm(`정말로 [${emailToRemove}] 계정의 관리자 권한을 회수하시겠습니까?`)) return;

    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('email', emailToRemove);

      if (error) throw error;

      alert('성공적으로 관리자 권한을 회수했습니다.');
      fetchAdmins();
    } catch (err) {
      console.log('Supabase delete failed, using fallback:', err.message);
      // Fallback local storage
      const localAdmins = JSON.parse(localStorage.getItem('mermullet_admins') || '[]');
      const updated = localAdmins.filter(a => a.email !== emailToRemove);
      localStorage.setItem('mermullet_admins', JSON.stringify(updated));
      setAdminsList(updated);
      alert('로컬 저장소에서 권한을 회수했습니다.');
    }
  };

  if (checkingAuth) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.authLoading}>
            <RefreshCw size={44} className={styles.spin} />
            <p>보안 세션을 확인 중입니다...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!isApprovedAdmin) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <div className={`${styles.deniedCard} glass`}>
            <ShieldAlert size={60} className={styles.deniedIcon} />
            <h2>어드민 접근 권한 제한</h2>
            <p className={styles.deniedNote}>
              현재 로그인하신 구글 계정 <strong>({user?.email})</strong>은 사전 승인된 관리자 목록에 등록되어 있지 않습니다.
            </p>
            <p className={styles.instruction}>
              관리자 페이지를 이용하시려면 최고 관리자 장유찬님에게 권한 승인을 요청해 주세요.
            </p>
            <div className={styles.deniedActions}>
              <button 
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/login');
                }} 
                className={styles.logoutBtn}
              >
                <LogOut size={16} />
                <span>다른 계정으로 로그인</span>
              </button>
              <button 
                onClick={() => router.push('/')} 
                className={styles.homeBtn}
              >
                <span>홈페이지로 돌아가기</span>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className={styles.main}>
        <div className={`${styles.container} container`}>
          
          {/* Dashboard Header */}
          <div className={styles.header}>
            <div>
              <div className={styles.headerBadge}>
                <Sparkles size={14} />
                <span>ADMIN CONSOLE</span>
              </div>
              <h2>예약자 관리 대시보드</h2>
              <p>실시간 호텔 예약 접수 현황을 확인하고 예약을 최종 조율 및 관리합니다.</p>
            </div>
            
            <button onClick={fetchReservations} className={styles.refreshBtn}>
              <RefreshCw size={16} />
              <span>새로고침</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={`${styles.statsCard} glass`}>
              <div className={`${styles.iconContainer} ${styles.blue}`}>
                <Calendar size={22} />
              </div>
              <div className={styles.statInfo}>
                <p>전체 예약 건수</p>
                <h3>{stats.totalBookings} <span className={styles.unit}>건</span></h3>
              </div>
            </div>

            <div className={`${styles.statsCard} glass`}>
              <div className={`${styles.iconContainer} ${styles.gold}`}>
                <ShieldAlert size={22} />
              </div>
              <div className={styles.statInfo}>
                <p>대기 중인 예약</p>
                <h3 className={styles.pendingColor}>
                  {stats.pendingCount} <span className={styles.unit}>건</span>
                </h3>
              </div>
            </div>

            <div className={`${styles.statsCard} glass`}>
              <div className={`${styles.iconContainer} ${styles.green}`}>
                <DollarSign size={22} />
              </div>
              <div className={styles.statInfo}>
                <p>확정 예약 누적 매출</p>
                <h3 className={styles.revenueColor}>
                  ₩{stats.totalRevenue.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className={styles.tabNav}>
            <button 
              onClick={() => setActiveTab('reservations')} 
              className={`${styles.tabBtn} ${activeTab === 'reservations' ? styles.activeTab : ''}`}
            >
              <Calendar size={16} />
              <span>예약 내역 관리</span>
            </button>
            <button 
              onClick={() => setActiveTab('admins')} 
              className={`${styles.tabBtn} ${activeTab === 'admins' ? styles.activeTab : ''}`}
            >
              <Users size={16} />
              <span>관리자 권한 부여 ({adminsList.length})</span>
            </button>
          </div>

          {activeTab === 'reservations' ? (
            <>
              {/* Controls Bar (Search, Filter) */}
              <div className={`${styles.controlsBar} glass`}>
                <div className={styles.searchBox}>
                  <Search size={18} className={styles.searchIcon} />
                  <input 
                    type="text" 
                    placeholder="예약자명 또는 예약번호 검색..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>

                <div className={styles.filters}>
                  <div className={styles.filterGroup}>
                    <Filter size={16} className={styles.filterIcon} />
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="all">모든 예약 상태</option>
                      <option value="pending">대기중 (Pending)</option>
                      <option value="confirmed">확정됨 (Confirmed)</option>
                      <option value="cancelled">취소됨 (Cancelled)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className={`${styles.tableWrapper} glass`}>
                {isLoading ? (
                  <div className={styles.loadingSpinner}>
                    <RefreshCw size={36} className={styles.spin} />
                    <p>실시간 예약 목록을 조회 중입니다...</p>
                  </div>
                ) : filteredReservations.length === 0 ? (
                  <div className={styles.emptyState}>
                    <ShieldAlert size={48} className={styles.emptyIcon} />
                    <h3>조회된 예약건이 없습니다</h3>
                    <p>검색 조건이나 필터링 조건을 다시 확인해 주시기 바랍니다.</p>
                  </div>
                ) : (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>예약 ID</th>
                        <th>예약자 정보</th>
                        <th>신청 객실</th>
                        <th>숙박 기간</th>
                        <th>결제 금액</th>
                        <th>예약 상태</th>
                        <th className={styles.actionsHeader}>관리 작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.map((res) => (
                        <tr key={res.id}>
                          <td className={styles.resId}>
                            <span>{res.id?.substring(0, 8)}</span>
                          </td>
                          <td className={styles.guestInfo}>
                            <div className={styles.guestName}>{res.guest_name}</div>
                            <div className={styles.guestContact}>
                              <span>{res.guest_email}</span>
                              <span className={styles.contactDivider}>|</span>
                              <span>{res.guest_phone}</span>
                            </div>
                          </td>
                          <td className={styles.roomCell}>
                            <span>{res.room_name || (res.room_id === '7b4fd1c0-0000-0000-0000-000000000001' ? '디럭스 오션 스위트' : 
                                   res.room_id === '7b4fd1c0-0000-0000-0000-000000000002' ? '이그제큐티브 풀빌라' : '머물렛 로열 펜트하우스')}</span>
                          </td>
                          <td className={styles.dateCell}>
                            <div className={styles.checkDates}>
                              <span>{res.check_in}</span>
                              <span className={styles.arrow}>&rarr;</span>
                              <span>{res.check_out}</span>
                            </div>
                          </td>
                          <td className={styles.priceCell}>
                            <strong>₩{Number(res.total_price).toLocaleString()}</strong>
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${styles[res.status]}`}>
                              {res.status === 'pending' ? '승인 대기' : 
                               res.status === 'confirmed' ? '예약 확정' : '취소됨'}
                            </span>
                          </td>
                          <td className={styles.actionsCell}>
                            {res.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => updateStatus(res.id, 'confirmed')} 
                                  className={`${styles.actionBtn} ${styles.confirmBtn}`}
                                  title="예약 승인"
                                >
                                  <Check size={14} />
                                  <span>승인</span>
                                </button>
                                <button 
                                  onClick={() => updateStatus(res.id, 'cancelled')} 
                                  className={`${styles.actionBtn} ${styles.cancelBtn}`}
                                  title="예약 취소"
                                >
                                  <X size={14} />
                                  <span>취소</span>
                                </button>
                              </>
                            )}
                            
                            {res.status === 'confirmed' && (
                              <button 
                                onClick={() => updateStatus(res.id, 'cancelled')} 
                                className={`${styles.actionBtn} ${styles.cancelBtn}`}
                                title="예약 취소"
                              >
                                <X size={14} />
                                <span>취소</span>
                              </button>
                            )}

                            {res.status === 'cancelled' && (
                              <button 
                                onClick={() => updateStatus(res.id, 'confirmed')} 
                                className={`${styles.actionBtn} ${styles.confirmBtn}`}
                                title="재승인"
                              >
                                <Check size={14} />
                                <span>재승인</span>
                              </button>
                            )}

                            <button 
                              onClick={() => deleteReservation(res.id)} 
                              className={`${styles.actionBtn} ${styles.deleteBtn}`}
                              title="예약 삭제"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            <div className={styles.adminManagerContainer}>
              {/* Left Side: Add New Admin Form */}
              <div className={`${styles.adminAddCard} glass`}>
                <div className={styles.cardTitle}>
                  <Users size={20} className={styles.titleIcon} />
                  <h4>신규 관리자 추가</h4>
                </div>
                <p className={styles.cardDesc}>
                  사전 등록 승인할 구글 로그인 이메일을 입력하세요. 등록 즉시 어드민 페이지 접근 권한이 활성화됩니다.
                </p>
                <form onSubmit={handleAddAdmin} className={styles.adminForm}>
                  <div className={styles.inputGroup}>
                    <label>구글 이메일 주소</label>
                    <input 
                      type="email" 
                      placeholder="example@gmail.com" 
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>관리자 이름/직급</label>
                    <input 
                      type="text" 
                      placeholder="예: 장유찬 최고관리자, 홍길동 지배인" 
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isAddingAdmin}
                    className={styles.addBtn}
                  >
                    {isAddingAdmin ? '권한 부여 중...' : '관리자 권한 부여하기'}
                  </button>
                </form>
              </div>

              {/* Right Side: Current Admins List */}
              <div className={`${styles.adminListCard} glass`}>
                <div className={styles.cardTitle}>
                  <Users size={20} className={styles.titleIcon} />
                  <h4>현재 권한 보유 목록 ({adminsList.length})</h4>
                </div>
                <div className={styles.adminsListWrapper}>
                  {adminsList.length === 0 ? (
                    <div className={styles.noAdmins}>등록된 관리자가 없습니다.</div>
                  ) : (
                    adminsList.map((adm) => (
                      <div key={adm.email} className={styles.adminRow}>
                        <div className={styles.adminRowLeft}>
                          <div className={styles.avatar}>
                            {adm.name?.charAt(0) || '管'}
                          </div>
                          <div className={styles.adminMeta}>
                            <span className={styles.admName}>{adm.name || '일반 관리자'}</span>
                            <span className={styles.admEmail}>{adm.email}</span>
                          </div>
                        </div>
                        
                        <div className={styles.adminRowRight}>
                          {adm.email === user?.email ? (
                            <span className={styles.badgeRootAdmin}>최고관리자 (본인)</span>
                          ) : (
                            <button 
                              onClick={() => handleRemoveAdmin(adm.email)}
                              className={styles.removeAdminBtn}
                              title="관리자 권한 해제"
                            >
                              <Trash2 size={14} />
                              <span>회수</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
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
