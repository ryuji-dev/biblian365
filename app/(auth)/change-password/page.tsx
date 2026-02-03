'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChangePasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('first_login')
        .eq('id', user.id)
        .single() as { data: { first_login: boolean } | null };

      setIsFirstLogin(profile?.first_login || false);
    }

    checkUser();
  }, [router, supabase]);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 12) {
      return '비밀번호는 최소 12자 이상이어야 합니다.';
    }
    if (!/[A-Z]/.test(pwd)) {
      return '대문자를 최소 1개 포함해야 합니다.';
    }
    if (!/[a-z]/.test(pwd)) {
      return '소문자를 최소 1개 포함해야 합니다.';
    }
    if (!/[0-9]/.test(pwd)) {
      return '숫자를 최소 1개 포함해야 합니다.';
    }
    if (!/[^A-Za-z0-9]/.test(pwd)) {
      return '특수문자를 최소 1개 포함해야 합니다.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 비밀번호 일치 확인
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    // 비밀번호 정책 검증
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // 비밀번호 변경
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError('비밀번호 변경에 실패했습니다: ' + updateError.message);
        setLoading(false);
        return;
      }

      // first_login 플래그 업데이트
      if (userId) {
        await (supabase
          .from('user_profiles') as any)
          .update({
            first_login: false,
            last_password_change: new Date().toISOString()
          })
          .eq('id', userId);
      }

      // 대시보드로 이동
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('비밀번호 변경 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>비밀번호 변경</CardTitle>
        <CardDescription>
          {isFirstLogin
            ? '처음 로그인하셨습니다. 새로운 비밀번호를 설정해주세요.'
            : '새로운 비밀번호를 입력해주세요.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isFirstLogin && (
            <div className="space-y-2">
              <Label htmlFor="current">현재 비밀번호</Label>
              <Input
                id="current"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required={!isFirstLogin}
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="new">새 비밀번호</Label>
            <Input
              id="new"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">새 비밀번호 확인</Label>
            <Input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="bg-muted p-3 rounded-md text-xs space-y-1">
            <p className="font-semibold">비밀번호 정책:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>최소 12자 이상</li>
              <li>대문자, 소문자, 숫자, 특수문자 각 1개 이상 포함</li>
            </ul>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '변경 중...' : '비밀번호 변경'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
