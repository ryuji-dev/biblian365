import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, ShieldAlert, History, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminClient } from "@/components/admin/AdminClient";
import { cn } from "@/lib/utils";
import { Database } from "@/types/database.types";
import Link from 'next/link';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface AdminPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1');
  const itemsPerPage = 10;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const userProfile = profile as { role: 'user' | 'leader' | 'admin' } | null;

  if (userProfile?.role !== 'admin' && userProfile?.role !== 'leader') {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in duration-700">
        <ShieldAlert className="w-16 h-16 text-red-500/50 mb-2" />
        <h1 className="text-2xl text-white">접근 권한이 없습니다</h1>
        <p className="text-zinc-500">관리자 또는 리더만 접근 가능한 페이지입니다.</p>
      </div>
    );
  }

  // 전반적인 통계 데이터
  const { count: userCount } = await supabase.from("user_profiles").select("*", { count: 'exact', head: true });
  const today = new Date().toISOString().split('T')[0];
  const { data: todayCheckinData } = await supabase
    .from("devotion_checkins")
    .select("user_id")
    .eq("checkin_date", today);

  const todayCheckins = todayCheckinData
    ? new Set((todayCheckinData as { user_id: string }[]).map(c => c.user_id)).size
    : 0;

  // 교우 목록 (페이지네이션 적용)
  const { data: usersData, count: totalUsers } = await supabase
    .from("user_profiles")
    .select("id, email, full_name, role, created_at", { count: 'exact' })
    .order("created_at", { ascending: false })
    .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

  const memberList = usersData as UserProfile[] | null;
  const totalPages = Math.ceil((totalUsers || 0) / itemsPerPage);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-1000">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 via-primary/5 to-transparent border border-white/5 p-6 md:p-10 mb-6 font-normal">
        <div className="relative z-10 space-y-3">
          <h1 className="text-2xl md:text-4xl text-white tracking-tight leading-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-indigo-500" />
            관리자 콘솔
          </h1>
          <p className="text-zinc-400 text-base md:text-lg font-medium max-w-2xl">
            교우들의 활동 정보를 확인하고 계정을 관리할 수 있는 공간입니다.
          </p>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[120%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-dark border-white/5 shadow-none overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 rounded-[2rem]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-zinc-300 uppercase tracking-tight mb-2">
              <Users className="w-4 h-4 text-indigo-500" />
              전체 회원
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl text-white tracking-tight font-normal">{userCount || 0}명</div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center transition-all duration-500 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] font-normal">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-white/5 shadow-none overflow-hidden group hover:border-green-500/30 transition-all duration-500 rounded-[2rem]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-zinc-300 uppercase tracking-tight mb-2">
              <History className="w-4 h-4 text-green-500" />
              오늘 경건시간
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl text-white tracking-tight font-normal">{todayCheckins || 0}명</div>
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center transition-all duration-500 group-hover:bg-green-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] font-normal">
                <History className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forms Section */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="glass-dark border-white/5 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl text-white flex items-center gap-3 font-normal">
                <Users className="w-6 h-6 text-primary" />
                계정 발급
              </CardTitle>
              <CardDescription className="text-zinc-500 font-normal">
                새로운 교우의 계정을 생성합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <AdminClient mode="users" />
            </CardContent>
          </Card>

          <Card className="glass-dark border-white/5 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl text-white flex items-center gap-3 font-normal">
                <History className="w-6 h-6 text-orange-500" />
                비밀번호 초기화
              </CardTitle>
              <CardDescription className="text-zinc-500 font-normal">
                비밀번호를 '1111'로 초기화합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <AdminClient mode="reset-password" />
            </CardContent>
          </Card>
        </div>

        {/* User List Table */}
        <div className="lg:col-span-2">
          <Card className="glass-dark border-white/5 rounded-[2.5rem] overflow-hidden h-full flex flex-col">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl text-white font-normal">가입 교우 목록</CardTitle>
              <CardDescription className="text-zinc-500 font-normal">
                전체 교우 명단입니다. (페이지당 10명)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 flex-1 flex flex-col">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="py-4 text-xs font-medium text-zinc-500 uppercase tracking-widest">이름</th>
                      <th className="py-4 text-xs font-medium text-zinc-500 uppercase tracking-widest">이메일</th>
                      <th className="py-4 text-xs font-medium text-zinc-500 uppercase tracking-widest text-right">권한</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-normal">
                    {memberList?.map((u) => (
                      <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-5 text-white font-normal">{u.full_name}</td>
                        <td className="py-5 text-zinc-400 font-normal">{u.email}</td>
                        <td className="py-5 text-right">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-normal tracking-widest uppercase border border-transparent",
                            u.role === 'admin' ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/10" :
                              u.role === 'leader' ? "bg-primary/20 text-primary border-primary/10" : "bg-zinc-800 text-zinc-500"
                          )}>
                            {u.role === 'admin' ? '목사님' : u.role === 'leader' ? '리더' : '교우'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-white/5 font-normal">
                  <Link
                    href={`/admin?page=${Math.max(1, currentPage - 1)}`}
                    className={cn(
                      "p-2 rounded-xl border border-white/5 bg-white/5 text-zinc-400 hover:text-white transition-all",
                      currentPage === 1 && "opacity-30 pointer-events-none"
                    )}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Link>
                  <div className="text-zinc-500 text-sm">
                    <span className="text-white">{currentPage}</span> / {totalPages}
                  </div>
                  <Link
                    href={`/admin?page=${Math.min(totalPages, currentPage + 1)}`}
                    className={cn(
                      "p-2 rounded-xl border border-white/5 bg-white/5 text-zinc-400 hover:text-white transition-all",
                      currentPage === totalPages && "opacity-30 pointer-events-none"
                    )}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
