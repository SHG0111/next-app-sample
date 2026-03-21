"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../../supabase/client";
import SpinnerLoading from "./loading";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role");
  console.log(role);
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase handles the callback automatically
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data?.session) {
          localStorage.setItem("user", JSON.stringify(data.session.user));
          localStorage.setItem("userRole", role || "user");

          router.push("/");
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        router.push("/login");
      }
    };

    handleCallback();
  }, [router, role]);

  return <SpinnerLoading />;
}
