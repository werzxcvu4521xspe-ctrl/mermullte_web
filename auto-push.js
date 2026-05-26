const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 설정 변수
const WATCH_DIR = path.join(__dirname, 'src');
const DEBOUNCE_DELAY = 5000; // 변경 감지 후 5초 대기 (연속 수정 대응)
let debounceTimer = null;
let pendingChanges = new Set();

console.log('✨ 머물렛 실시간 자동 배포 감지기 시작 ✨');
console.log(`📂 감지 대상 폴더: ${WATCH_DIR}`);
console.log(`⏱️ 대기 지연 시간: ${DEBOUNCE_DELAY / 1000}초 (연속 입력 시 자동 연장)`);
console.log('--------------------------------------------------');

// OS가 macOS이므로 recursive 옵션이 완벽하게 지원됩니다.
fs.watch(WATCH_DIR, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  
  // 임시 파일, git 폴더, node_modules 등 제외
  if (
    filename.includes('.git') || 
    filename.includes('node_modules') || 
    filename.endsWith('~') || 
    filename.startsWith('.')
  ) {
    return;
  }

  const relativePath = path.relative(WATCH_DIR, path.join(WATCH_DIR, filename));
  pendingChanges.add(relativePath);

  // 이전에 설정된 타이머가 있으면 취소 (디바운스 구현)
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // 지정된 대기시간 후에 git add & commit & push 실행
  debounceTimer = setTimeout(() => {
    const changeList = Array.from(pendingChanges).join(', ');
    console.log(`\n📝 변경된 파일 감지됨 [${new Date().toLocaleTimeString()}]: ${changeList}`);
    console.log('🚀 Git 자동 커밋 및 Vercel 실시간 배포 시작...');
    
    // Git 자동 명령어 실행
    const commitMessage = `auto: 실시간 코드 수정 (${changeList})`;
    const command = `git add . && git commit -m "${commitMessage}" && git push`;

    exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ 자동 배포 중 에러 발생:', error.message);
        return;
      }
      
      console.log('✅ Git 푸시 성공!');
      console.log('🌐 Vercel 실시간 빌드 & 배포가 트리거되었습니다!');
      console.log('--------------------------------------------------');
      
      // 상태 초기화
      pendingChanges.clear();
      debounceTimer = null;
    });
  }, DEBOUNCE_DELAY);
});
