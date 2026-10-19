"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DesignIdeasRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/categories");
  }, [router]);

  return (
    <div style={{ padding: "40px", textAlign: "center", color: "#C5A880" }}>
      Redirecting to Categories & Design Ideas...
    </div>
  );
}
