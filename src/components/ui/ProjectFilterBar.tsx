"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import { getVisibleFilterTabs } from "@/lib/project-categories";

interface ProjectFilterBarProps {
  projects: Array<{ categories?: string[]; category?: string }>;
  activeFilter: string;
  onFilterChange: (category: string) => void;
  idPrefix?: string;
}

export default function ProjectFilterBar({
  projects,
  activeFilter,
  onFilterChange,
  idPrefix = "filter",
}: ProjectFilterBarProps) {
  const visibleTabs = useMemo(() => getVisibleFilterTabs(projects), [projects]);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const scrollToTab = useCallback((tab: string) => {
    const btn = buttonRefs.current[tab];
    if (btn) {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      btn.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, []);

  const handleTabClick = (tab: string) => {
    if (tab === activeFilter) return;
    onFilterChange(tab);
    scrollToTab(tab);
  };

  // Keep active tab visible on mount or external changes
  useEffect(() => {
    if (activeFilter && activeFilter !== "ALL") {
      scrollToTab(activeFilter);
    }
  }, [activeFilter, scrollToTab]);

  return (
    <div
      className="project-filter-bar-wrapper"
      ref={containerRef}
      role="region"
      aria-label="Project categories"
    >
      <div
        className="project-filter-bar"
        role="group"
        aria-label="Project category filters"
      >
        {visibleTabs.map((tab) => {
          const isActive = activeFilter.toUpperCase() === tab;
          const slugId = tab.toLowerCase().replace(/[^a-z0-9]+/g, "-");

          return (
            <button
              key={tab}
              ref={(el) => {
                buttonRefs.current[tab] = el;
              }}
              type="button"
              className={`project-filter-tab${isActive ? " project-filter-tab--active" : ""}`}
              onClick={() => handleTabClick(tab)}
              aria-pressed={isActive}
              id={`${idPrefix}-${slugId}`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
