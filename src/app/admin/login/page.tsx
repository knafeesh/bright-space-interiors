"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // If logged in, redirect to admin root
    const auth = localStorage.getItem("bs_admin_authenticated") === "true";
    if (auth) {
      router.replace("/admin");
    }
  }, [router]);

  return null;
}
