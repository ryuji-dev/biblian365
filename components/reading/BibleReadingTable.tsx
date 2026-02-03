'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BIBLE_BOOKS, TOTAL_CHAPTERS, BibleBook } from '@/lib/constants/bible';
import { BookOpen, CheckCircle2, Circle, Flame, Target, ChevronDown, ChevronUp, Book } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BibleProgress {
    book_id: number;
    chapter: number;
    year: number;
    completed_at: string;
}

interface BibleReadingTableProps {
    progress: BibleProgress[];
}

export function BibleReadingTable({ progress }: BibleReadingTableProps) {
    const router = useRouter();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [expandedBookId, setExpandedBookId] = useState<number | null>(null);
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [optimisticProgress, setOptimisticProgress] = useState(progress);

    // Sync optimistic state with props when props change
    useEffect(() => {
        setOptimisticProgress(progress);
    }, [progress]);

    // Calculations
    const currentYearProgress = optimisticProgress.filter(p => Number(p.year) === Number(selectedYear));
    const completedCount = currentYearProgress.length;
    const progressPercent = Math.round((completedCount / TOTAL_CHAPTERS) * 100);

    const todayString = new Date().toISOString().split('T')[0];
    const todayCount = optimisticProgress.filter(p => p.completed_at?.startsWith(todayString)).length;

    // Calculate total reads: count how many years have all chapters completed
    const totalReads = useMemo(() => {
        const yearGroups: Record<number, Set<string>> = {};
        optimisticProgress.forEach(p => {
            const y = Number(p.year);
            if (!yearGroups[y]) yearGroups[y] = new Set();
            yearGroups[y].add(`${p.book_id}-${p.chapter}`);
        });
        return Object.values(yearGroups).filter(set => set.size === TOTAL_CHAPTERS).length;
    }, [optimisticProgress]);

    const bookProgress = useMemo(() => {
        const map: Record<number, number[]> = {};
        currentYearProgress.forEach(p => {
            const bid = Number(p.book_id);
            if (!map[bid]) map[bid] = [];
            map[bid].push(Number(p.chapter));
        });
        return map;
    }, [currentYearProgress]);

    const toggleChapter = async (bookId: number, chapter: number) => {
        const key = `${bookId}-${chapter}`;
        if (loading[key]) return;

        // Optimistic Update
        const isCurrentlyDone = bookProgress[bookId]?.includes(chapter);
        const prevProgress = [...optimisticProgress];

        if (isCurrentlyDone) {
            setOptimisticProgress(prev => prev.filter(p =>
                !(Number(p.book_id) === bookId && Number(p.chapter) === chapter && Number(p.year) === Number(selectedYear))
            ));
        } else {
            setOptimisticProgress(prev => [...prev, {
                book_id: bookId,
                chapter: chapter,
                year: Number(selectedYear),
                completed_at: new Date().toISOString()
            }]);
        }

        setLoading(prev => ({ ...prev, [key]: true }));
        try {
            const res = await fetch('/api/bible-reading/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId, chapter, year: Number(selectedYear) }),
            });
            if (!res.ok) {
                setOptimisticProgress(prevProgress); // Rollback
            } else {
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            setOptimisticProgress(prevProgress); // Rollback
        } finally {
            setLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    const toggleAllChapters = async (bookId: number) => {
        const key = `all-${bookId}`;
        if (loading[key]) return;

        const prevProgress = [...optimisticProgress];
        const book = BIBLE_BOOKS.find(b => b.id === bookId);
        if (!book) return;

        // Optimistic: Mark all chapters as done for this year
        const newEntries = Array.from({ length: book.chapters }, (_, i) => ({
            book_id: bookId,
            chapter: i + 1,
            year: Number(selectedYear),
            completed_at: new Date().toISOString()
        }));

        setOptimisticProgress(prev => {
            const otherProgress = prev.filter(p =>
                !(Number(p.book_id) === bookId && Number(p.year) === Number(selectedYear))
            );
            return [...otherProgress, ...newEntries];
        });

        setLoading(prev => ({ ...prev, [key]: true }));
        try {
            const res = await fetch('/api/bible-reading/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId, all: true, year: Number(selectedYear) }),
            });
            if (!res.ok) {
                setOptimisticProgress(prevProgress); // Rollback
            } else {
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            setOptimisticProgress(prevProgress); // Rollback
        } finally {
            setLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    const renderBookList = (books: BibleBook[], theme: 'indigo' | 'rose') => {
        const colorClasses = {
            indigo: {
                bg: "bg-indigo-500/5",
                border: "border-indigo-500/20",
                hover: "hover:border-indigo-500/40",
                iconBg: "bg-indigo-500/20",
                iconText: "text-indigo-500",
                chapterDone: "bg-indigo-600",
                progress: "bg-indigo-500"
            },
            rose: {
                bg: "bg-rose-500/5",
                border: "border-rose-500/20",
                hover: "hover:border-rose-500/40",
                iconBg: "bg-rose-500/20",
                iconText: "text-rose-500",
                chapterDone: "bg-rose-500",
                progress: "bg-rose-500"
            }
        };

        const colors = colorClasses[theme];

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map(book => {
                    const completedChapters = bookProgress[book.id] || [];
                    const isCompleted = completedChapters.length === book.chapters;
                    const isExpanded = expandedBookId === book.id;
                    const isBulkLoading = loading[`all-${book.id}`];

                    return (
                        <div key={book.id} className="flex flex-col">
                            <div className={cn(
                                "w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between",
                                isCompleted
                                    ? `${colors.bg} ${colors.border} ${colors.hover}`
                                    : "bg-white/5 border-white/10 hover:border-white/20",
                                isExpanded && (theme === 'indigo' ? "ring-2 ring-indigo-500/50" : "ring-2 ring-rose-500/50")
                            )}>
                                <button
                                    onClick={() => setExpandedBookId(isExpanded ? null : book.id)}
                                    className="flex items-center gap-3 flex-1 text-left"
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center",
                                        isCompleted
                                            ? colors.iconBg + " " + colors.iconText
                                            : `${colors.iconBg.replace('20', '10')} ${colors.iconText}`
                                    )}>
                                        <Book className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-white">{book.name}</h3>
                                        <p className="text-xs text-zinc-500">
                                            {completedChapters.length} / {book.chapters} 장 읽음
                                        </p>
                                    </div>
                                </button>
                                <div className="flex items-center gap-2">
                                    {!isCompleted && (
                                        <button
                                            disabled={isBulkLoading}
                                            onClick={() => toggleAllChapters(book.id)}
                                            className={cn(
                                                "p-2 rounded-lg transition-colors hover:bg-white/5",
                                                isBulkLoading ? "animate-pulse" : `text-zinc-500 ${theme === 'indigo' ? 'hover:text-indigo-400' : 'hover:text-rose-400'}`
                                            )}
                                            title="한 번에 다 읽음"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setExpandedBookId(isExpanded ? null : book.id)}
                                        className="p-2 text-zinc-500"
                                    >
                                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="mt-2 p-4 bg-zinc-900/50 border border-white/5 rounded-2xl animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                                        {Array.from({ length: book.chapters }, (_, i) => i + 1).map(chapter => {
                                            const done = completedChapters.includes(chapter);
                                            const isLoading = loading[`${book.id}-${chapter}`];
                                            return (
                                                <button
                                                    key={chapter}
                                                    disabled={isLoading}
                                                    onClick={() => toggleChapter(book.id, chapter)}
                                                    className={cn(
                                                        "aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all",
                                                        done
                                                            ? colors.chapterDone + " text-white"
                                                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700",
                                                        isLoading && "opacity-50 cursor-not-allowed animate-pulse"
                                                    )}
                                                >
                                                    {chapter}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Year Selector & Global Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5">
                    {[2026, 2027, 2028].map(y => (
                        <button
                            key={y}
                            onClick={() => setSelectedYear(y)}
                            className={cn(
                                "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                                Number(selectedYear) === y
                                    ? "bg-primary text-white shadow-lg"
                                    : "text-zinc-500 hover:text-white"
                            )}
                        >
                            {y}년
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="glass-dark border-white/5 shadow-none overflow-hidden group hover:border-primary/30 transition-all duration-500 rounded-[2rem]">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm text-zinc-300 uppercase tracking-tight mb-2">
                            <Target className="w-4 h-4 text-primary" />
                            {selectedYear}년 진행률
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div className="text-3xl text-white tracking-tight">{progressPercent}%</div>
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                                <Target className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-1000"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-dark border-white/5 shadow-none overflow-hidden group hover:border-orange-500/30 transition-all duration-500 rounded-[2rem]">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm text-zinc-300 uppercase tracking-tight mb-2">
                            <Flame className="w-4 h-4 text-orange-500" />
                            오늘 읽은 장 수
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div className="text-3xl text-white tracking-tight">{todayCount}장</div>
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center transition-all duration-500 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                                <Flame className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-dark border-white/5 shadow-none overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 rounded-[2rem]">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm text-zinc-300 uppercase tracking-tight mb-2">
                            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                            총 통독 수
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div className="text-3xl text-white tracking-tight">{totalReads}독</div>
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center transition-all duration-500 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bible Sections */}
            <div className="space-y-12">
                <section>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <div className="w-2 h-6 bg-indigo-500 rounded-full" />
                        구약 성경 (Old Testament)
                    </h2>
                    {renderBookList(BIBLE_BOOKS.filter(b => b.category === 'Old'), 'indigo')}
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <div className="w-2 h-6 bg-rose-500 rounded-full" />
                        신약 성경 (New Testament)
                    </h2>
                    {renderBookList(BIBLE_BOOKS.filter(b => b.category === 'New'), 'rose')}
                </section>
            </div>
        </div>
    );
}
