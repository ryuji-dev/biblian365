import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { checkinDate, durationMinutes, memo, planId } = body as {
      checkinDate: string;
      durationMinutes?: number | null;
      memo?: string | null;
      planId?: string | null;
    };

    if (!checkinDate) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    // Upsert checkin
    const { data, error } = await (supabase
      .from("devotion_checkins") as any)
      .upsert({
        user_id: user.id,
        checkin_date: checkinDate,
        duration_minutes: durationMinutes ?? null,
        memo: memo ?? null,
        plan_id: planId ?? null,
        created_by: user.id,
        updated_by: user.id,
      }, {
        onConflict: 'user_id,checkin_date'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Checkin Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const { error } = await (supabase
      .from("devotion_checkins") as any)
      .delete()
      .eq("user_id", user.id)
      .eq("checkin_date", date);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
