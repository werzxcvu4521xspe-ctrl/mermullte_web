import './globals.css';

export const metadata = {
  title: 'Mermullet Hotel | 프리미엄 럭셔리 스테이',
  description: '품격 있는 휴식과 프리미엄 서비스를 제공하는 Mermullet 호텔의 실시간 예약 및 소개 사이트입니다.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
