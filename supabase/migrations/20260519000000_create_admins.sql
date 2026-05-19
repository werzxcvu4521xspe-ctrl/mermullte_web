-- 20260519000000_create_admins.sql
-- Mermullet Hotel 통합 데이터베이스 스키마 설계 및 데이터 자동 주입

-- 1. 객실(rooms) 테이블 생성
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price INT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 고정 UUID 기반 최고급 객실 3개 데이터 자동 삽입
INSERT INTO public.rooms (id, name, description, price, image_url)
VALUES 
('7b4fd1c0-0000-0000-0000-000000000001', '디럭스 오션 스위트', '끝없이 펼쳐진 에메랄드빛 바다를 품은 럭셔리 스위트 룸', 380000, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
('7b4fd1c0-0000-0000-0000-000000000002', '이그제큐티브 풀빌라', '개인 온수 풀과 프라이빗 테라스로 완벽한 휴식을 선사하는 최고급 풀빌라', 650000, 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800'),
('7b4fd1c0-0000-0000-0000-000000000003', '머물렛 로열 펜트하우스', '360도 파노라마 오션뷰와 버틀러 서비스를 제공하는 최상위 등급의 펜트하우스', 1200000, 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800')
ON CONFLICT (id) DO NOTHING;

-- 3. 예약(reservations) 테이블 생성
CREATE TABLE IF NOT EXISTS public.reservations (
    id TEXT PRIMARY KEY,
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    room_name TEXT,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price INT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. 승인된 관리자(admins) 테이블 생성
CREATE TABLE IF NOT EXISTS public.admins (
    email TEXT PRIMARY KEY,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. 최고관리자 장유찬 구글 이메일 자동 등록 및 승인
INSERT INTO public.admins (email, name)
VALUES 
('werzxcvu4521xspe-ctrl@gmail.com', '최고관리자 장유찬(개발용)'),
('werzxcvu4521xspe@gmail.com', '최고관리자 장유찬')
ON CONFLICT (email) DO NOTHING;

