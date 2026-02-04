# Supabase 이메일 및 서비스 설정 가이드

비블리안 365의 계정 자동 발급 및 비밀번호 초기화 기능을 활성화하기 위한 설정 가이드입니다.

---

## 1. SMTP 설정 (메일 발송 서버)

실제 교우들에게 메일을 보내기 위해서는 메일 서버 설정이 필요합니다.

1.  **Supabase Dashboard** 접속
2.  **Settings** > **Auth** > **SMTP** 메뉴로 이동
3.  **Enable Custom SMTP** 활성화
4.  보유하신 메일 서버 정보 입력 (예: Naver, Gmail, Resend 등)
    - **Sender email**: `info@your-church.com` (예시)
    - **Sender name**: `BIBLIAN 365`

---

## 2. 이메일 템플릿 설정 (메일 내용 꾸미기)

**Settings** > **Auth** > **Email Templates**에서 아래 코드를 복사해서 붙여넣으세요.

### ✉️ 초대 메일 (Invite User)

**제목:** `[BIBLIAN365] 가입을 환영합니다!`

**본문 (HTML):**

```html
<div
  style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 20px;"
>
  <h2 style="color: #7c3aed; font-weight: normal;">
    BIBLIAN365 가입을 환영합니다!
  </h2>
  <p style="font-weight: normal; line-height: 1.6;">
    성도님의 경건생활을 돕기 위해 BIBLIAN365 계정이 발급되었습니다.
  </p>
  <div
    style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin: 25px 0;"
  >
    <p style="margin: 5px 0; font-weight: normal;">
      <strong>아이디:</strong> {{ .Email }}
    </p>
    <p style="margin: 5px 0; font-weight: normal;">
      <strong>임시 비밀번호:</strong> 111111
    </p>
  </div>
  <p style="color: #666; font-size: 13px; font-weight: normal;">
    * 보안을 위해 로그인 후 반드시 비밀번호를 변경해 주세요.
  </p>
  <a
    href="{{ .ConfirmationURL }}"
    style="display: inline-block; background: #7c3aed; color: #fff; padding: 15px 30px; border-radius: 12px; text-decoration: none; margin-top: 15px; font-weight: normal;"
    >로그인하러 가기</a
  >
</div>
```

### ✉️ 비밀번호 초기화 메일 (Reset Password)

**제목:** `[BIBLIAN365] 비밀번호 초기화 안내`

**본문 (HTML):**

```html
<div
  style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 20px;"
>
  <h2 style="color: #ea580c; font-weight: normal;">
    비밀번호가 초기화되었습니다.
  </h2>
  <p style="font-weight: normal; line-height: 1.6;">
    요청하신 계정의 비밀번호가 안전하게 초기화되었습니다.
  </p>
  <div
    style="background: #fff7ed; padding: 20px; border-radius: 15px; margin: 25px 0; border: 1px solid #fed7aa;"
  >
    <p style="margin: 5px 0; font-weight: normal;">
      <strong>임시 비밀번호:</strong> 111111
    </p>
  </div>
  <p style="font-weight: normal; line-height: 1.6;">
    아래 버튼을 눌러 접속하신 후, 새로운 비밀번호로 변경하여 사용해 주세요.
  </p>
  <a
    href="https://biblian365.vercel.app/login"
    style="display: inline-block; background: #ea580c; color: #fff; padding: 15px 30px; border-radius: 12px; text-decoration: none; margin-top: 15px; font-weight: normal;"
    >BIBLIAN365 접속하기</a
  >
</div>
```

---

## 3. 서비스 환경 변수 (권한 설정)

계정 발급 버튼이 실제로 동작하려면 서버 측에 관리자 비밀키(`SERVICE_ROLE_KEY`) 설정이 필요합니다.

1.  Supabase **Settings** > **API**에서 **service_role** 키를 복사합니다.
2.  Vercel 프로젝트 설정의 **Environment Variables**에 아래 항목을 추가합니다.
    - `SUPABASE_SERVICE_ROLE_KEY`: `(복사한 키)`

이 설정이 완료되면 관리자 페이지의 모든 기능이 실시간으로 동작하게 됩니다!
