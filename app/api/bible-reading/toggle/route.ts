import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { bookId, chapter, year: providedYear, all } = await req.json();
        const year = providedYear || new Date().getFullYear();

        if (!bookId) {
            return NextResponse.json({ error: "Missing bookId" }, { status: 400 });
        }

        if (all) {
            // Bulk toggle logic: For simplicity, "all" means "mark all chapters as read"
            // Get book details to know how many chapters
            const bible = await import("@/lib/constants/bible");
            const book = bible.BIBLE_BOOKS.find(b => b.id === bookId);
            if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });

            // Create array of records to insert
            const records = Array.from({ length: book.chapters }, (_, i) => ({
                user_id: user.id,
                book_id: bookId,
                chapter: i + 1,
                year,
                completed_at: new Date().toISOString()
            }));

            // Use upsert to avoid duplicate errors while marking all as read
            const { error } = await (supabase
                .from("user_bible_progress") as any)
                .upsert(records, { onConflict: 'user_id,book_id,chapter,year' });

            if (error) throw error;
            return NextResponse.json({ success: true, action: 'bulk_added' });
        }

        if (!chapter) {
            return NextResponse.json({ error: "Missing chapter" }, { status: 400 });
        }

        // Check if it already exists
        const { data: existing } = await (supabase
            .from("user_bible_progress") as any)
            .select("id")
            .eq("user_id", user.id)
            .eq("book_id", bookId)
            .eq("chapter", chapter)
            .eq("year", year)
            .single();

        if (existing) {
            // If exists, delete (toggle off)
            const { error } = await (supabase
                .from("user_bible_progress") as any)
                .delete()
                .eq("id", existing.id);

            if (error) throw error;
            return NextResponse.json({ success: true, action: 'removed' });
        } else {
            // If not exists, insert (toggle on)
            const { data, error } = await (supabase
                .from("user_bible_progress") as any)
                .insert({
                    user_id: user.id,
                    book_id: bookId,
                    chapter: chapter,
                    year: year,
                    completed_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json({ success: true, action: 'added', data });
        }
    } catch (error: any) {
        console.error("Bible toggle error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
