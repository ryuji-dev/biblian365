import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 관리자 권한 확인
    const { data: profileData } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const profile = profileData as { role: string } | null;

    if (profile?.role !== 'admin' && profile?.role !== 'leader') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email, fullName, temporaryPassword, role = 'user' } = await req.json();

    if (!email || !fullName) {
      return NextResponse.json({ error: "이메일과 이름은 필수입니다." }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // 1. Auth 사용자 생성
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password: temporaryPassword || '1111',
      email_confirm: true, // 발급 즉시 바로 로그인 가능하도록 설정
      user_metadata: { full_name: fullName }
    });

    if (authError) {
      return NextResponse.json({ error: `계정 생성 실패: ${authError.message}` }, { status: 400 });
    }

    // 2. User Profiles 테이블 업데이트 (트리거가 없을 경우를 대비해 명시적 수행)
    const { error: profileError } = await (adminClient
      .from('user_profiles') as any)
      .upsert({
        id: authUser.user.id,
        email,
        full_name: fullName,
        role: role as 'user' | 'leader' | 'admin',
        first_login: true // 첫 로그인 후 비번 변경 유도용
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    return NextResponse.json({ message: "성공적으로 계정이 발급되었습니다." });

  } catch (error: any) {
    console.error('Provisioning error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
