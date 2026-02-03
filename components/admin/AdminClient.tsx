'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Database, UserPlus } from 'lucide-react';

interface AdminClientProps {
  mode: 'users' | 'templates';
}

export function AdminClient({ mode }: AdminClientProps) {
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState('2026');

  // 계정 발급용 스테이트
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('WelcomeBiblian365!');

  const handleSeedTemplate = async () => {
    if (!confirm(`${year}년 통독 템플릿을 생성하시겠습니까? (365일 샘플 데이터 포함)`)) return;
    setLoading(true);
    try {
      const resp = await fetch('/api/admin/seed-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: parseInt(year) }),
      });
      if (resp.ok) {
        alert('템플릿 생성 완료!');
      } else {
        const data = await resp.json();
        alert('에러: ' + data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProvisionUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 실제로는 Edge Function을 호출하는 것이 좋으나, 
      // 여기서는 데모용으로 API Route를 통해 호출하는 척 하거나 
      // Supabase Auth Admin API를 서버 사이드에서 호출하도록 유도
      alert('사용자 발급 기능은 전용 Edge Function 배포 후 활성화됩니다. deployment-guide.md의 코드를 전용 대시보드에서 배포해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'templates') {
    return (
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="year">대상 연도</Label>
          <Input 
            id="year" 
            value={year} 
            onChange={(e) => setYear(e.target.value)} 
            placeholder="2026"
          />
        </div>
        <Button 
          onClick={handleSeedTemplate} 
          disabled={loading} 
          className="w-full flex gap-2"
        >
          <Database className="w-4 h-4" />
          {year}년 템플릿 생성 (샘플 데이터)
        </Button>
        <p className="text-xs text-gray-400">
          * 실제 정교한 통독표 데이터는 CSV 업로드 기능을 통해 구현할 것을 권장합니다.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleProvisionUser} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">이름</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pwd">임시 비밀번호</Label>
          <Input id="pwd" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full flex gap-2">
        <UserPlus className="w-4 h-4" />
        계정 발급하기
      </Button>
    </form>
  );
}
