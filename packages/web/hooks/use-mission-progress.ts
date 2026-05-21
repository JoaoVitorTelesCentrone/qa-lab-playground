"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useMissionProgress() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) loadProgress(data.user.id);
      else setLoading(false);
    });
  }, []);

  async function loadProgress(userId: string) {
    const { data } = await supabase
      .from("mission_progress")
      .select("mission_id")
      .eq("user_id", userId)
      .eq("status", "completed");

    if (data) {
      setCompleted(new Set(data.map((r) => Number(r.mission_id))));
    }
    setLoading(false);
  }

  const toggle = useCallback(
    async (missionId: number) => {
      if (!user) return;

      const isCompleted = completed.has(missionId);

      if (isCompleted) {
        await supabase
          .from("mission_progress")
          .delete()
          .eq("user_id", user.id)
          .eq("mission_id", String(missionId));
        setCompleted((prev) => {
          const next = new Set(prev);
          next.delete(missionId);
          return next;
        });
      } else {
        await supabase.from("mission_progress").upsert({
          user_id: user.id,
          mission_id: String(missionId),
          status: "completed",
          completed_at: new Date().toISOString(),
        });
        setCompleted((prev) => new Set([...prev, missionId]));
      }
    },
    [user, completed, supabase]
  );

  return { user, completed, loading, toggle };
}
