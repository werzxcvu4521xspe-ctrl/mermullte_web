-- 20260519000000_create_admins.sql
-- 승인된 관리자 이메일 목록 테이블 생성 및 최고관리자 장유찬 자동 승인

-- 1. admins 테이블 생성
CREATE TABLE IF NOT EXISTS public.admins (
    email TEXT PRIMARY KEY,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 최고관리자 장유찬 이메일 자동 등록
INSERT INTO public.admins (email, name)
VALUES ('werzxcvu4521xspe-ctrl@gmail.com', '최고관리자 장유찬')
ON CONFLICT (email) DO NOTHING;
