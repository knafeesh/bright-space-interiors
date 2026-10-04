"use client";

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  project: string;
  location: string;
  budget: string;
  source: string;
  status: string;
  assigned: string;
  date: string;
  tags: string[];
  notes: string;
}

const STORAGE_KEY = "brightspace_leads";

export function getStoredLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

export async function fetchServerLeads(): Promise<Lead[]> {
  try {
    const res = await fetch("/api/leads", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (typeof window !== "undefined" && Array.isArray(data)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      return data;
    }
  } catch (err) {
    console.warn("Could not fetch server leads, falling back to local storage:", err);
  }
  return getStoredLeads();
}

export async function saveNewLead(lead: Omit<Lead, "id" | "date"> & { id?: number; date?: string }): Promise<Lead> {
  const fullLead: Lead = {
    ...lead,
    id: lead.id || Date.now(),
    date: lead.date || new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
  };

  // Immediate local cache update
  if (typeof window !== "undefined") {
    try {
      const existing = getStoredLeads();
      const updated = [fullLead, ...existing.filter((l) => l.id !== fullLead.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("leadsUpdated"));
    } catch (err) {
      console.error(err);
    }
  }

  // Server sync
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullLead),
    });
    if (res.ok) {
      const saved = await res.json();
      return saved;
    }
  } catch (err) {
    console.warn("Server POST /api/leads failed, retained in local storage:", err);
  }

  return fullLead;
}

export async function updateStoredLeadStatus(id: number, status: string): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const existing = getStoredLeads();
      const updated = existing.map((l) => (l.id === id ? { ...l, status } : l));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("leadsUpdated"));
    } catch (err) {
      console.error(err);
    }
  }

  try {
    await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  } catch (err) {
    console.warn("Server update lead status failed:", err);
  }
}

export async function deleteStoredLead(id: number): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const existing = getStoredLeads();
      const updated = existing.filter((l) => l.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("leadsUpdated"));
    } catch (err) {
      console.error(err);
    }
  }

  try {
    await fetch(`/api/leads?id=${id}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn("Server delete lead failed:", err);
  }
}

export async function addStoredLeadNote(id: number, note: string): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const existing = getStoredLeads();
      const updated = existing.map((l) => {
        if (l.id === id) {
          const timestamp = new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
          const existingNotes = l.notes ? `${l.notes}\n[${timestamp}]: ${note}` : `[${timestamp}]: ${note}`;
          return { ...l, notes: existingNotes };
        }
        return l;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("leadsUpdated"));
    } catch (err) {
      console.error(err);
    }
  }

  try {
    await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, note }),
    });
  } catch (err) {
    console.warn("Server add lead note failed:", err);
  }
}
