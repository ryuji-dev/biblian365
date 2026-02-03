"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CheckinCalendarProps {
  checkinDates: string[]; // YYYY-MM-DD
  onDateClick: (date: string) => void;
}

export function CheckinCalendar({ checkinDates, onDateClick }: CheckinCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 캘린더 앞뒤 빈 칸 계산 (월요일 시작 기준)
  const startDay = monthStart.getDay(); // 0(일) ~ 6(토)
  const prefixDays = startDay === 0 ? 6 : startDay - 1;

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

  const isChecked = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return checkinDates.includes(dateStr);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">
          {format(currentMonth, "yyyy년 M월", { locale: ko })}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: prefixDays }).map((_, i) => (
          <div key={`empty-${i}`} className="h-12 md:h-16" />
        ))}
        
        {days.map((day) => {
          const checked = isChecked(day);
          const today = isToday(day);
          
          return (
            <button
              key={day.toString()}
              onClick={() => onDateClick(format(day, "yyyy-MM-dd"))}
              className={cn(
                "h-12 md:h-16 flex flex-col items-center justify-center rounded-lg transition-all relative group",
                today ? "border-2 border-primary/30" : "border border-transparent",
                checked ? "bg-primary/10" : "hover:bg-gray-50"
              )}
            >
              <span className={cn(
                "text-sm font-medium",
                today ? "text-primary font-bold" : "text-gray-700",
                checked && "text-primary"
              )}>
                {format(day, "d")}
              </span>
              
              {checked && (
                <div className="mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
