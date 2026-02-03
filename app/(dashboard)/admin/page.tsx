import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BookOpen, ShieldAlert, History } from "lucide-react";
import { AdminClient } from "@/components/admin/AdminClient";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== 'admin') {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">접근 권한이 없습니다</h1>
        <p className="text-gray-500">관리자 전용 페이지입니다.</p>
      </div>
    );
  }

  // 통계 데이터 가져오기 (전체 사용자 수, 오늘 체크인 수 등)
  const { count: userCount } = await supabase.from("user_profiles").select("*", { count: 'exact', head: true });
  const today = new Date().toISOString().split('T')[0];
  const { count: todayCheckins } = await supabase.from("devotion_checkins").select("*", { count: 'exact', head: true }).eq("checkin_date", today);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <ShieldAlert className="w-6 h-6 text-indigo-600" />
        관리자 콘솔
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>전체 회원</CardDescription>
            <CardTitle className="text-2xl">{userCount || 0}명</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>오늘 체크인</CardDescription>
            <CardTitle className="text-2xl text-green-600">{todayCheckins || 0}명</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 계정 관리 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              계정 발급 및 관리
            </CardTitle>
            <CardDescription>새로운 사용자의 계정을 생성합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminClient mode="users" />
          </CardContent>
        </Card>

        {/* 통독표 관리 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              통독표 템플릿 관리
            </CardTitle>
            <CardDescription>2026년 통독 일정을 생성하거나 업로드합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminClient mode="templates" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
