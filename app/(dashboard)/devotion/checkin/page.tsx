import { createClient } from "@/lib/supabase/server";
import { CheckinClient } from "@/components/devotion/CheckinClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Calendar as CalendarIcon, Target } from "lucide-react";
import { calculateCurrentStreak, calculateLongestStreak } from "@/lib/utils/streak";

export default async function DevotionCheckinPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 체크인 기록 가져오기 (최근 1년)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const { data: checkins } = await supabase
    .from("devotion_checkins")
    .select("checkin_date, duration_minutes, memo")
    .eq("user_id", user.id)
    .gte("checkin_date", oneYearAgo.toISOString().split("T")[0])
    .order("checkin_date", { ascending: false });

  const checkinDates = checkins?.map(c => c.checkin_date) || [];
  const initialCheckinDetails: Record<string, { durationMinutes?: number; memo?: string }> = {};
  checkins?.forEach(c => {
    initialCheckinDetails[c.checkin_date] = {
      durationMinutes: c.duration_minutes || undefined,
      memo: c.memo || undefined,
    };
  });
  
  const currentStreak = calculateCurrentStreak(checkinDates);
  const longestStreak = calculateLongestStreak(checkinDates);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-primary" />
          경건시간 체크인
        </h1>
        <p className="text-gray-600 mt-1">오늘의 하나님과 만난 시간을 기록하고 확인하세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-orange-50 border-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">현재 연속</p>
                <p className="text-4xl font-bold text-orange-700 mt-1">{currentStreak}일</p>
              </div>
              <Flame className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-indigo-50 border-indigo-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">최장 기록</p>
                <p className="text-4xl font-bold text-indigo-700 mt-1">{longestStreak}일</p>
              </div>
              <Target className="w-12 h-12 text-indigo-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">이번 달 횟수</p>
                <p className="text-4xl font-bold text-green-700 mt-1">
                  {checkinDates.filter(d => d.startsWith(new Date().toISOString().slice(0, 7))).length}회
                </p>
              </div>
              <CalendarIcon className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h3 className="font-semibold text-lg px-1">활동 기록</h3>
        <CheckinClient 
          checkinDates={checkinDates} 
          initialCheckinDetails={initialCheckinDetails} 
        />
        <p className="text-center text-sm text-gray-500">
          날짜를 클릭하여 상세 기록을 입력하거나 수정할 수 있습니다.
        </p>
      </div>
    </div>
  );
}

