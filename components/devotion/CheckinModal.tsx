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
      <DialogContent className="sm:max-w-[480px] glass-dark border-white/5 p-8 rounded-[2.5rem]">
        <form onSubmit={handleSubmit} className="space-y-8">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-3xl text-white tracking-tight">
              {formatDateKorean(date)}
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-lg">
              이날의 경건시간 기록을 입력하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="duration" className="text-sm font-bold text-zinc-400 uppercase tracking-wider ml-1">
                수행 시간 (분)
              </Label>
              <Input
                id="duration"
                type="number"
                placeholder="예: 30"
                value={duration}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)}
                disabled={loading}
                className="bg-white/5 border-white/10 rounded-2xl h-14 text-lg px-6 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-muted-foreground/30 text-white"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="memo" className="text-sm font-bold text-zinc-400 uppercase tracking-wider ml-1">
                한 줄 메모
              </Label>
              <Textarea
                id="memo"
                placeholder="말씀 묵상 내용이나 기도 제목 등"
                value={memo}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMemo(e.target.value)}
                disabled={loading}
                className="bg-white/5 border-white/10 rounded-2xl min-h-[120px] text-lg p-6 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-muted-foreground/30 text-white"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-0 sm:justify-between pt-4">
            {initialData ? (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleDelete}
                disabled={loading}
                className="text-zinc-500 hover:text-destructive hover:bg-destructive/10 rounded-xl px-6"
              >
                기록 삭제
              </Button>
            ) : <div />}
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl px-8"
              >
                취소
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : '저장하기'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
