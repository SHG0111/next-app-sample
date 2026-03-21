// /app/actions/deleteAccount.ts
"use server";
import { createClient } from "@supabase/supabase-js";

export async function deleteUserAccount(userId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  try {
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Delete error:", error);
      return { error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Delete error:", err);
    return { error: err.message };
  }
}
