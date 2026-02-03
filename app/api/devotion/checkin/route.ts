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
    const { id, checkinDate, durationMinutes, memo, planId, plannedStartTime, plannedEndTime, startTime, endTime } = body as {
      id?: string;
      checkinDate: string;
      durationMinutes?: number | null;
      memo?: string | null;
      planId?: string | null;
      plannedStartTime?: string | null;
      plannedEndTime?: string | null;
      startTime?: string | null;
      endTime?: string | null;
    };

    if (!checkinDate) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    let result;
    if (id) {
      // Update existing
      result = await (supabase
        .from("devotion_checkins") as any)
        .update({
          duration_minutes: durationMinutes ?? null,
          memo: memo ?? null,
          plan_id: planId ?? null,
          planned_start_time: plannedStartTime ?? null,
          planned_end_time: plannedEndTime ?? null,
          start_time: startTime ?? null,
          end_time: endTime ?? null,
          updated_by: user.id,
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
    } else {
      // Insert new
      result = await (supabase
        .from("devotion_checkins") as any)
        .insert({
          user_id: user.id,
          checkin_date: checkinDate,
          duration_minutes: durationMinutes ?? null,
          memo: memo ?? null,
          plan_id: planId ?? null,
          planned_start_time: plannedStartTime ?? null,
          planned_end_time: plannedEndTime ?? null,
          start_time: startTime ?? null,
          end_time: endTime ?? null,
          created_by: user.id,
          updated_by: user.id,
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    return NextResponse.json({ success: true, data: result.data });
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error } = await (supabase
      .from("devotion_checkins") as any)
      .delete()
      .eq("user_id", user.id)
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
