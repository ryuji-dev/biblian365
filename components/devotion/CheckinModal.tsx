'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDateKorean } from '@/lib/utils/date';

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  initialData?: {
    durationMinutes?: number;
    memo?: string;
  };
  onSuccess: () => void;
}

export function CheckinModal({ 
  isOpen, 
  onClose, 
  date, 
  initialData, 
  onSuccess 
}: CheckinModalProps) {
  const [duration, setDuration] = useState<string>(initialData?.durationMinutes?.toString() || '');
  const [memo, setMemo] = useState(initialData?.memo || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await fetch('/api/devotion/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkinDate: date,
          durationMinutes: duration ? parseInt(duration) : null,
          memo: memo || null,
        }),
      });

      if (resp.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await resp.json();
        alert('에러 발생: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('체크인을 삭제하시겠습니까?')) return;
    setLoading(true);

    try {
      const resp = await fetch(`/api/devotion/checkin?date=${date}`, {
        method: 'DELETE',
      });

      if (resp.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{formatDateKorean(date)}</DialogTitle>
            <DialogDescription>
              이날의 경건시간 기록을 입력하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">수행 시간 (분)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="예: 30"
                value={duration}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="memo">한 줄 메모</Label>
              <Textarea
                id="memo"
                placeholder="말씀 묵상 내용이나 기도 제목 등"
                value={memo}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMemo(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between w-full">
            {initialData && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={loading}
              >
                삭제
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '저장 중...' : '저장하기'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
