"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PortfolioRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/projects");
  }, [router]);

  return (
    <div style={{ padding: "40px", textAlign: "center", color: "#C5A880" }}>
      Redirecting to Projects Management...
    </div>
  );
}
