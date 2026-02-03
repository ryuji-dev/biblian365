'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-1000">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-white/5 p-6 md:p-10">
        <div className="relative z-10 space-y-3">
          <h1 className="text-2xl md:text-4xl text-white tracking-tight leading-tight">
            내 프로필
          </h1>
          <p className="text-zinc-400 text-base md:text-lg font-medium">
            계정 정보와 활동 통계를 확인하세요.
          </p>
        </div>
      </div>

      <Card className="glass-dark border-white/5 rounded-[2.5rem] p-8">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <User className="w-6 h-6 text-primary" />
            준비 중인 페이지입니다
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500">곧 새로운 프로필 기능으로 찾아뵙겠습니다.</p>
        </CardContent>
      </Card>
    </div>
  );
}
