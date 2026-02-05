# 📖 Biblian365

> **교회 및 청년부 공동체를 위한 경건생활 관리 및 성경 1년 통독 웹 애플리케이션**

Biblian365는 성도들의 꾸준한 말씀 읽기와 기도 생활을 돕기 위해 설계된 모던 웹 서비스입니다. 관리자가 발급한 계정을 통해 개인별 목표를 설정하고 진행 상황을 시각적으로 확인할 수 있습니다.

---

## 🛠 기술 스택

- **Frontend**: `Next.js 16 (App Router)`, `TypeScript`, `React 19`
- **Backend**: `Supabase` (Auth, PostgreSQL, SSR) - *Hosted on AWS*
- **Styling**: `Tailwind CSS`, `shadcn/ui`, `Lucide React`
- **Deployment**: `Vercel`

---

## ✨ 핵심 기능

### 1. 경건 시간 (Devotion) 기록 및 관리
- **정밀한 기록**: 시작/종료 시간을 입력하여 실제 경건 시간을 분 단위로 기록합니다. (자정을 넘기는 기록도 자동 분할 관리)
- **통계 대시보드**: 실시간 연속 일수(Streak), 최장 기록, 월별 참여 횟수 및 총 경건 시간을 시각화하여 제공합니다.
- **활동 달력**: 직관적인 달력 인터페이스를 통해 일별 참여 현황을 한눈에 파악하고 메모를 조회/수정합니다.

### 2. 성경 통독 (Bible Reading) 진행률
- **성경 통독표**: 창세기부터 요한계시록까지 전체 1,189장을 손쉽게 체크하며 읽기 여정을 관리합니다.
- **자동 진행률**: 권별/전체 진행률이 실시간으로 계산되어 대시보드에 반영됩니다.
- **다회독 기록**: 성경을 일독할 때마다 기록이 누적되어 연도별/회차별 통독 기록을 보존합니다.

### 3. 관리자 (Admin) 전용 기능
- **공동체 관리**: 이메일 기반 계정 생성, 권한 부여(Admin/Leader/User)를 통해 공동체 멤버를 관리합니다.
- **보안 및 제어**: 계정 잠금/해제 및 원격 비밀번호 초기화 기능을 제공합니다.
- **참여 모니터링**: 전체 사용자의 실시간 참여 현황을 파악하여 공동체의 영적 흐름을 돕습니다.

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
