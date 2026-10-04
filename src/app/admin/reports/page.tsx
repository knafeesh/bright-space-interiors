"use client";
import { useState } from "react";
import {
  BarChart2,
  TrendingUp,
  Users,
  Award,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  PieChart,
} from "lucide-react";

export default function ReportsAdminPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const channelBreakdown = [
    { channel: "Website Contact Form", count: 18, share: "38%", conversion: "28%" },
    { channel: "WhatsApp Direct", count: 16, share: "33%", conversion: "44%" },
    { channel: "Direct Phone Inquiries", count: 9, share: "19%", conversion: "55%" },
    { channel: "Instagram Social", count: 5, share: "10%", conversion: "20%" },
  ];

  const serviceDemand = [
    { service: "Residential Interior", leads: 22, percentage: 46 },
    { service: "Turnkey Architecture", leads: 14, percentage: 29 },
    { service: "Commercial Interior", leads: 8, percentage: 17 },
    { service: "Design & 3D Visualization", leads: 4, percentage: 8 },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "32px", fontWeight: 400, color: "var(--charcoal)" }}>
            Analytics & Reports
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Performance metrics, lead acquisition channels, and service interest distribution
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ padding: "8px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px", background: "#FFF" }}
          >
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Year to Date</option>
          </select>
          <button
            onClick={() => alert("Downloading PDF Summary Report...")}
            className="admin-btn admin-btn--outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* Top Highlights */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "20px", marginBottom: "24px" }}>
        <div className="stat-card" style={{ margin: 0 }}>
          <div className="stat-card__label">Average Conversion Rate</div>
          <div className="stat-card__value">36.5%</div>
          <div className="stat-card__change stat-card__change--up" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <ArrowUpRight size={12} /> +4.2% vs previous period
          </div>
        </div>

        <div className="stat-card" style={{ margin: 0 }}>
          <div className="stat-card__label">Top Inquiry Channel</div>
          <div className="stat-card__value" style={{ fontSize: "28px" }}>WhatsApp</div>
          <div className="stat-card__change" style={{ color: "var(--gold)" }}>Highest conversion rate (44%)</div>
        </div>

        <div className="stat-card" style={{ margin: 0 }}>
          <div className="stat-card__label">Most Requested Service</div>
          <div className="stat-card__value" style={{ fontSize: "28px" }}>Residential</div>
          <div className="stat-card__change" style={{ color: "#27AE60" }}>46% of total client inquiries</div>
        </div>
      </div>

      {/* Two Column Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        {/* Channel Performance Table */}
        <div className="admin-table-wrap" style={{ margin: 0 }}>
          <div className="admin-table-header">
            <div className="admin-table-title">Lead Acquisition Channels</div>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Inquiries</th>
                <th>Share</th>
                <th>Conversion</th>
              </tr>
            </thead>
            <tbody>
              {channelBreakdown.map((row) => (
                <tr key={row.channel}>
                  <td style={{ fontWeight: 600, color: "var(--charcoal)" }}>{row.channel}</td>
                  <td>{row.count}</td>
                  <td>{row.share}</td>
                  <td>
                    <span className="status-badge status-badge--won">{row.conversion}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Service Interest Distribution */}
        <div className="admin-table-wrap" style={{ margin: 0, padding: "24px" }}>
          <div className="admin-table-title" style={{ marginBottom: "20px" }}>Service Interest Demand</div>
          {serviceDemand.map((item) => (
            <div key={item.service} style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--charcoal)" }}>{item.service}</span>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{item.leads} leads ({item.percentage}%)</span>
              </div>
              <div style={{ height: "8px", background: "#F0F0F0", borderRadius: "4px" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${item.percentage}%`,
                    background: "linear-gradient(to right, var(--gold-dark), var(--gold))",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
