import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 관리자 권한 확인
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email, fullName, temporaryPassword, role } = await req.json();

    // 서비스 롤 키가 있는 관리자 클라이언트 필요 (Next.js 서버 사이드에서 직접 처리는 지양하고 Edge Function 권장)
    // 하지만 지금은 테스트를 위해 안내 메시지만 반환
    return NextResponse.json({ 
      error: "보안을 위해 계정 발급은 Supabase Edge Function을 통해서만 수행됩니다. deployment-guide.md의 내용을 배포해주세요." 
    }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
