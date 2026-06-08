"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  fallbackItems,
  topicList,
  type ContentGroup,
  type FeedItem,
  type SourceKind,
  type Topic,
} from "@/data/policy-radar";

const groups: Array<"All" | ContentGroup> = ["All", "Government statements", "News developments", "Analysis"];
const sourceKinds: Array<"All" | SourceKind> = ["All", "Official", "Regulator", "News", "Analysis", "Open index"];
const timeWindows = [
  { label: "6h", hours: 6 },
  { label: "24h", hours: 24 },
  { label: "3d", hours: 72 },
  { label: "1w", hours: 168 },
  { label: "All time", hours: null },
];

function formatDate(value?: string) {
  if (!value) return "Source link";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Source link";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function relativeDate(value?: string) {
  if (!value) return "Source link";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Source link";
  const diff = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function readingTime(summary: string) {
  const words = summary.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 180))} min read`;
}

function groupClass(group: ContentGroup) {
  if (group === "Government statements") return "badge-gov";
  if (group === "Analysis") return "badge-analysis";
  return "badge-news";
}

function sourceLabel(sourceKind: SourceKind) {
  if (sourceKind === "Open index") return "News";
  return sourceKind;
}

function isWithinWindow(item: FeedItem, hours: number | null) {
  if (!hours || !item.publishedAt) return true;
  const date = new Date(item.publishedAt);
  if (Number.isNaN(date.getTime())) return false;
  return Date.now() - date.getTime() <= hours * 60 * 60 * 1000;
}

export function PolicyDashboard() {
  const [items, setItems] = useState<FeedItem[]>(fallbackItems);
  const [activeGroup, setActiveGroup] = useState<"All" | ContentGroup>("All");
  const [activeTopic, setActiveTopic] = useState<"All" | Topic>("All");
  const [activeSourceKind, setActiveSourceKind] = useState<"All" | SourceKind>("All");
  const [activeWindow, setActiveWindow] = useState<(typeof timeWindows)[number]>(timeWindows[4]);
  const [query, setQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string>("Local starter set");
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const refreshFeeds = async () => {
    startTransition(async () => {
      const response = await fetch("/api/feeds", { cache: "no-store" });
      const data = (await response.json()) as {
        generatedAt: string;
        failedSources: string[];
        items: FeedItem[];
      };
      setItems(data.items);
      setFailedSources(data.failedSources);
      setLastUpdated(formatDate(data.generatedAt));
    });
  };

  useEffect(() => {
    void refreshFeeds();
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const groupMatch = activeGroup === "All" || item.group === activeGroup;
      const topicMatch = activeTopic === "All" || item.topics.includes(activeTopic);
      const sourceMatch = activeSourceKind === "All" || item.sourceKind === activeSourceKind;
      const timeMatch = isWithinWindow(item, activeWindow.hours);
      const queryMatch =
        !normalizedQuery ||
        `${item.title} ${item.summary} ${item.source} ${item.topics.join(" ")}`
          .toLowerCase()
          .includes(normalizedQuery);

      return groupMatch && topicMatch && sourceMatch && timeMatch && queryMatch;
    });
  }, [activeGroup, activeSourceKind, activeTopic, activeWindow.hours, items, query]);

  const featuredItems = filteredItems.slice(0, 4);
  const analysisItems = items.filter((item) => item.group === "Analysis").slice(0, 5);
  const governmentItems = items.filter((item) => item.group === "Government statements").slice(0, 5);
  const newsItems = items.filter((item) => item.group === "News developments").slice(0, 5);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">PR</div>
          <div>
            <strong>PolicyRadar</strong>
            <span>India Policy Intelligence</span>
          </div>
        </div>
        <div className="topbar-actions">
          <span>Updated {lastUpdated}</span>
          <button type="button" onClick={refreshFeeds} disabled={isPending}>
            {isPending ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      <nav className="primary-nav" aria-label="Primary categories">
        <button type="button" className={activeGroup === "All" ? "active" : ""} onClick={() => setActiveGroup("All")}>
          All
        </button>
        {topicList.map((topic) => (
          <button
            type="button"
            className={activeTopic === topic ? "active" : ""}
            onClick={() => {
              setActiveTopic(topic);
              setActiveGroup("All");
            }}
            key={topic}
          >
            {topic}
          </button>
        ))}
        <button
          type="button"
          className={activeGroup === "Analysis" ? "active" : ""}
          onClick={() => setActiveGroup("Analysis")}
        >
          Analysis
        </button>
        <button
          type="button"
          className={activeGroup === "Government statements" ? "active" : ""}
          onClick={() => setActiveGroup("Government statements")}
        >
          Official
        </button>
      </nav>

      <section className="filter-bar" aria-label="Feed controls">
        <label className="search">
          <span>Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles..."
          />
        </label>

        <div className="source-pills" aria-label="Source type filters">
          {sourceKinds.map((kind) => (
            <button
              type="button"
              className={activeSourceKind === kind ? `active ${kind === "All" ? "" : `source-${kind.toLowerCase().replace(" ", "-")}`}` : ""}
              onClick={() => setActiveSourceKind(kind)}
              key={kind}
            >
              {kind === "All" ? "All sources" : sourceLabel(kind)}
            </button>
          ))}
        </div>

        <div className="time-pills" aria-label="Time filters">
          {timeWindows.map((window) => (
            <button
              type="button"
              className={activeWindow.label === window.label ? "active" : ""}
              onClick={() => setActiveWindow(window)}
              key={window.label}
            >
              {window.label}
            </button>
          ))}
        </div>
      </section>

      <section className="content-tabs" aria-label="Content type tabs">
          {groups.map((group) => (
            <button
              type="button"
              className={activeGroup === group ? "active" : ""}
              onClick={() => setActiveGroup(group)}
              key={group}
            >
              {group}
            </button>
          ))}
      </section>

      {failedSources.length > 0 ? (
        <section className="source-note">
          Some feeds did not respond during this refresh: {failedSources.join(", ")}. The dashboard is still showing
          working sources and safe fallbacks.
        </section>
      ) : null}

      <section className="dashboard-grid">
        <section className="briefing-panel">
          <div className="section-title">
            <span>{filteredItems.length} items</span>
            <h1>Priority Brief</h1>
          </div>
          <div className="featured-grid">
            {featuredItems.map((item) => (
              <a href={item.link} target="_blank" rel="noreferrer" className="article-card featured-card" key={item.id}>
                <div className="card-meta">
                  <span className="source-name">{item.source}</span>
                  <span className={`type-badge ${groupClass(item.group)}`}>{sourceLabel(item.sourceKind)}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <div className="article-footer">
                  <span>{relativeDate(item.publishedAt)}</span>
                  <span>{readingTime(item.summary)}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="section-title compact-title">
            <span>Live feed</span>
            <h2>Latest matched developments</h2>
          </div>
          <div className="feed-grid">
            {filteredItems.slice(4).map((item) => (
              <a href={item.link} target="_blank" rel="noreferrer" className="article-card" key={item.id}>
                <div className="card-meta">
                  <span className="source-name">{item.source}</span>
                  <span className={`type-badge ${groupClass(item.group)}`}>{sourceLabel(item.sourceKind)}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <div className="article-footer">
                  <span>{relativeDate(item.publishedAt)}</span>
                  <span>{formatDate(item.publishedAt)}</span>
                </div>
              </a>
            ))}
          </div>
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              No items match these filters yet. Try All time, All sources, or another topic.
            </div>
          ) : null}
        </section>

        <aside className="right-rail">
          <section className="rail-panel">
            <div className="rail-heading">
              <span>Government Statements</span>
              <strong>{governmentItems.length}</strong>
            </div>
            {governmentItems.map((item) => (
              <a href={item.link} key={item.id} target="_blank" rel="noreferrer" className="rail-link">
                <strong>{item.title}</strong>
                <span>{item.source} · {relativeDate(item.publishedAt)}</span>
              </a>
            ))}
          </section>

          <section className="rail-panel">
            <div className="rail-heading">
              <span>News Developments</span>
              <strong>{newsItems.length}</strong>
            </div>
            {newsItems.map((item) => (
              <a href={item.link} key={item.id} target="_blank" rel="noreferrer" className="rail-link">
                <strong>{item.title}</strong>
                <span>{item.source} · {relativeDate(item.publishedAt)}</span>
              </a>
            ))}
          </section>

          <section className="rail-panel">
            <div className="rail-heading">
              <span>Analysis</span>
              <strong>{analysisItems.length}</strong>
            </div>
            {analysisItems.map((item) => (
              <a href={item.link} key={item.id} target="_blank" rel="noreferrer" className="rail-link">
                <strong>{item.title}</strong>
                <span>{item.source} · {relativeDate(item.publishedAt)}</span>
              </a>
            ))}
          </section>
        </aside>
      </section>
    </main>
  );
}
