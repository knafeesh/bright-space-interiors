"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LeadsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/enquiries");
  }, [router]);

  return (
    <div style={{ padding: "40px", textAlign: "center", color: "#C5A880" }}>
      Redirecting to Customer Enquiries...
    </div>
  );
}
