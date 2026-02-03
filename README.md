# 📖 Biblian365

> **교회 및 청년부 공동체를 위한 경건생활 관리 및 성경 1년 통독 웹 애플리케이션**

Biblian365는 성도들의 꾸준한 말씀 읽기와 기도 생활을 돕기 위해 설계된 모던 웹 서비스입니다. 관리자가 발급한 계정을 통해 개인별 목표를 설정하고 진행 상황을 시각적으로 확인할 수 있습니다.

---

## 🛠 기술 스택

- **Frontend**: `Next.js 16 (App Router)`, `TypeScript`, `React 19`
- **Backend**: `Supabase` (Auth, PostgreSQL, SSR)
- **Styling**: `Tailwind CSS`, `shadcn/ui`, `Lucide React`
- **Deployment**: `Vercel`

---

## ✨ 핵심 기능

### 1. 경건시간 (Devotion) 관리
- **목표 설정**: 연간/일일 경건시간 목표를 설정하고 관리합니다.
- **체크인**: 날짜별 수행 시간과 간단한 메모를 기록합니다.
- **통계**:连续 일수(Streak) 표시 및 달성률 시각화 대시보드를 제공합니다.

### 2. 성경 통독 (Bible Reading)
- **통독표**: 날짜별 읽기 본문이 포함된 1년 통독표를 제공합니다.
- **진행 관리**: 읽은 본문을 체크하면 진행률이 자동으로 업데이트됩니다.
- **누적 기록**: 성경을 여러 번 통독할 경우 회차별 기록을 관리합니다.

### 3. 관리자 (Admin) 콘솔
- **사용자 관리**: 이메일 기반 계정 생성, 권한 부여(Admin/Leader/User).
- **상태 제어**: 계정 잠금/해제 및 비밀번호 초기화 기능.
- **대시보드**: 전체 사용자의 참여 현황을 한눈에 파악합니다.

---

## 🚀 빠른 시작 가이드

### 1. 개발 환경 설정

**필수 요구사항:**
- Node.js 24 LTS 이상
- Supabase Project (무료 티어 가능)

**설치 과정:**
```bash
# 1. 저장소 복제 및 이동
git clone https://github.com/your-repo/biblian365.git
cd biblian365

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일을 열어 Supabase URL 및 API Key를 입력하세요.
```

### 2. 데이터베이스 및 인증 설정
상세한 설정 방법은 [Supabase 설정 가이드](file:///Users/noah/Documents/projects/biblian365/biblian365/supabase-setting-guide.md)를 참고하세요.

1. **SQL Editor**: 데이터베이스 테이블 및 RLS 정책을 설정합니다.
2. **Auth Settings**: 이메일 템플릿 및 자동 발급 기능을 구성합니다.

### 3. 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`을 엽니다.

---

## 📁 프로젝트 구조

```text
biblian365/
├── app/                  # Next.js App Router (페이지 및 레이아웃)
│   ├── (auth)/           # 인증 (로그인, 비밀번호 변경)
│   ├── (dashboard)/      # 핵심 기능 (데시보드, 경건시간, 통독, 프로필)
│   └── api/              # API Serverless Functions
├── components/           # UI 및 도메인 전용 컴포넌트
├── lib/                  # 유틸리티 및 클라이언트 설정
│   ├── supabase/         # Supabase 클라이언트 라이브러리
│   └── utils.ts          # 공통 유틸리티 함수
├── types/                # TypeScript 타입 정의
└── public/               # 정적 애셋
```

---

## 📝 라이선스
**Internal Use Only** - 본 프로젝트는 정해진 공동체 내부용으로만 사용이 제한됩니다.
