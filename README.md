# backteam

Backprogress 동아리 팀 빌딩 플랫폼(Backteam)입니다.

## 실행 방법

```bash
npm install
npm run dev
```

## 환경 변수

아래 값을 `.env.local`에 설정하면 Supabase 연동이 활성화됩니다.

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## 주요 구조

- `src/components`: 메인 피드/공고 작성/알림/교사 대시보드 UI
- `src/lib`: Supabase 클라이언트 및 인증/프로필 파싱 로직
- `src/data`: 화면 확인용 목 데이터
- `supabase/schema.sql`: 요구 스키마 정의
- `.github/workflows/deploy.yml` 및 `.github/deploy.yml`: GitHub Pages 배포 워크플로우
