import Link from "next/link";
import { curatedItems, type ContentGroup, type FeedItem, type Topic } from "@/data/policy-radar";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const navItems = [
  { label: "All", href: "/" },
  { label: "India-US", href: "/?topic=U.S.-India" },
  { label: "Semiconductors", href: "/?topic=Semiconductors" },
  { label: "AI & Digital", href: "/?topic=AI%20governance" },
  { label: "Digital Competition", href: "/?topic=Digital%20competition" },
  { label: "Cybersecurity", href: "/?topic=Cybersecurity" },
  { label: "Telecom", href: "/?topic=Telecom" },
  { label: "Newsletters", href: "/?group=Analysis" },
  { label: "Official", href: "/?group=Government%20statements" },
];

const groupFilters: Array<{ label: string; value: "All" | ContentGroup }> = [
  { label: "All", value: "All" },
  { label: "Government statements", value: "Government statements" },
  { label: "News developments", value: "News developments" },
  { label: "Analysis", value: "Analysis" },
];

const discoveryItems: FeedItem[] = [
  {
    id: "discovery-google-semicon",
    title: "Live discovery: India semiconductor policy and ISM developments",
    source: "Google News query",
    sourceKind: "Open index",
    group: "News developments",
    topics: ["Semiconductors", "U.S.-India"],
    link: "https://news.google.com/search?q=%22India%20Semiconductor%20Mission%22%20OR%20India%20semiconductor%20policy",
    summary:
      "A discovery query for recent reporting on ISM, fabs, semiconductor incentives, packaging, and supply-chain movement. Use as a lead finder, not as the source of truth.",
    priority: 62,
  },
  {
    id: "discovery-google-tech-policy",
    title: "Live discovery: India data protection, AI governance and digital competition",
    source: "Google News query",
    sourceKind: "Open index",
    group: "News developments",
    topics: ["India tech policy", "AI governance", "Digital competition"],
    link: "https://news.google.com/search?q=India%20%22data%20protection%22%20OR%20%22AI%20governance%22%20OR%20%22digital%20competition%22",
    summary:
      "A discovery query for current reporting around DPDP, AI advisories, platform rules, digital competition and regulatory movement.",
    priority: 61,
  },
  {
    id: "discovery-google-us-india",
    title: "Live discovery: U.S.-India strategic technology, iCET and trade",
    source: "Google News query",
    sourceKind: "Open index",
    group: "News developments",
    topics: ["U.S.-India", "Semiconductors"],
    link: "https://news.google.com/search?q=US%20India%20iCET%20technology%20semiconductor%20trade",
    summary:
      "A discovery query for U.S.-India technology cooperation, iCET, defense technology, trade and semiconductor diplomacy.",
    priority: 60,
  },
];

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function tabHref(group: "All" | ContentGroup, query: string) {
  const params = new URLSearchParams();
  if (group !== "All") params.set("group", group);
  if (query) params.set("q", query);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

function sourceBadge(item: FeedItem) {
  if (item.group === "Government statements") return "GOV";
  if (item.group === "Analysis") return "ANALYSIS";
  if (item.sourceKind === "Open index") return "DISCOVERY";
  return "NEWS";
}

function cardClass(item: FeedItem) {
  if (item.group === "Government statements") return "card card--gov";
  if (item.group === "Analysis") return "card card--analysis";
  if (item.sourceKind === "Open index") return "card card--discovery";
  return "card card--news";
}

function filterItems(items: FeedItem[], group: string, topic: string, query: string) {
  const q = query.toLowerCase();
  return items.filter((item) => {
    const groupMatch = !group || group === "All" || item.group === group;
    const topicMatch = !topic || item.topics.includes(topic as Topic);
    const queryMatch =
      !q ||
      `${item.title} ${item.summary} ${item.source} ${item.topics.join(" ")}`.toLowerCase().includes(q);

    return groupMatch && topicMatch && queryMatch;
  });
}

function activeNav(label: string, group: string, topic: string) {
  if (label === "All") return !group && !topic;
  if (label === "Official") return group === "Government statements";
  if (label === "Newsletters") return group === "Analysis";
  if (label === "India-US") return topic === "U.S.-India";
  if (label === "AI & Digital") return topic === "AI governance";
  return topic === label;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const group = firstParam(params.group) ?? "";
  const topic = firstParam(params.topic) ?? "";
  const query = firstParam(params.q) ?? "";

  const filteredCore = filterItems(curatedItems, group, topic, query);
  const filteredDiscovery = filterItems(discoveryItems, group, topic, query);
  const items = [...filteredCore, ...filteredDiscovery].sort((a, b) => b.priority - a.priority);
  const heroItem = items[0] ?? curatedItems[0];
  const officialItems = items.filter((item) => item.group === "Government statements").slice(0, 6);
  const analysisItems = items.filter((item) => item.group === "Analysis").slice(0, 6);
  const viewDiscoveryItems = items.filter((item) => item.sourceKind === "Open index").slice(0, 6);

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark">PR</span>
          <span>
            <strong>PolicyRadar</strong>
            <small>India Policy Intelligence</small>
          </span>
        </Link>
        <div className="topbar-meta">
          <span>Curated v1</span>
          <a href="/api/feeds" target="_blank" rel="noreferrer">
            Live feed JSON
          </a>
        </div>
      </header>

      <nav className="nav-row" aria-label="Policy categories">
        {navItems.map((item) => (
          <Link className={activeNav(item.label, group, topic) ? "active" : ""} href={item.href} key={item.label}>
            {item.label}
          </Link>
        ))}
      </nav>

      <section className="filter-row" aria-label="Search and source filters">
        <form action="/" className="search-form">
          {group ? <input type="hidden" name="group" value={group} /> : null}
          {topic ? <input type="hidden" name="topic" value={topic} /> : null}
          <input name="q" defaultValue={query} placeholder="Search DPDP, iCET, TRAI, semiconductors..." />
          <button type="submit">Search</button>
        </form>
        <div className="tab-row">
          {groupFilters.map((filter) => (
            <Link
              className={(filter.value === "All" ? !group : group === filter.value) ? "active" : ""}
              href={tabHref(filter.value, query)}
              key={filter.value}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="hero-grid">
        <article className="lead-card">
          <div className="kicker">
            <span>{sourceBadge(heroItem)}</span>
            <span>{heroItem.source}</span>
          </div>
          <h1>{heroItem.title}</h1>
          <p>{heroItem.summary}</p>
          <div className="topic-list">
            {heroItem.topics.map((itemTopic) => (
              <Link href={`/?topic=${encodeURIComponent(itemTopic)}`} key={itemTopic}>
                {itemTopic}
              </Link>
            ))}
          </div>
          <a className="source-link" href={heroItem.link} target="_blank" rel="noreferrer">
            Open source
          </a>
        </article>

        <aside className="brief-panel">
          <span className="panel-label">Briefing shape</span>
          <strong>{items.length}</strong>
          <p>
            Curated official and analysis sources first. Discovery queries are separated and treated as leads,
            not authoritative source material.
          </p>
        </aside>
      </section>

      <section className="dashboard-grid">
        <section className="feed-column">
          <div className="section-heading">
            <span>{items.length} matches</span>
            <h2>Priority feed</h2>
          </div>
          <div className="card-grid">
            {items.map((item) => (
              <a className={cardClass(item)} href={item.link} target="_blank" rel="noreferrer" key={item.id}>
                <div className="card-meta">
                  <span>{item.source}</span>
                  <strong>{sourceBadge(item)}</strong>
                </div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <div className="card-footer">
                  {item.topics.slice(0, 2).map((itemTopic) => (
                    <span key={itemTopic}>{itemTopic}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>

        <aside className="rail">
          {officialItems.length > 0 ? (
            <section className="rail-card">
              <div className="rail-title">
                <span>Government statements</span>
                <strong>{officialItems.length}</strong>
              </div>
              {officialItems.map((item) => (
                <a href={item.link} target="_blank" rel="noreferrer" key={item.id}>
                  <strong>{item.title}</strong>
                  <span>{item.source}</span>
                </a>
              ))}
            </section>
          ) : null}

          {analysisItems.length > 0 ? (
            <section className="rail-card">
              <div className="rail-title">
                <span>Analysis</span>
                <strong>{analysisItems.length}</strong>
              </div>
              {analysisItems.map((item) => (
                <a href={item.link} target="_blank" rel="noreferrer" key={item.id}>
                  <strong>{item.title}</strong>
                  <span>{item.source}</span>
                </a>
              ))}
            </section>
          ) : null}

          {viewDiscoveryItems.length > 0 ? (
            <section className="rail-card rail-card--soft">
              <div className="rail-title">
                <span>Discovery layer</span>
                <strong>{viewDiscoveryItems.length}</strong>
              </div>
              {viewDiscoveryItems.map((item) => (
                <a href={item.link} target="_blank" rel="noreferrer" key={item.id}>
                  <strong>{item.title}</strong>
                  <span>{item.source}</span>
                </a>
              ))}
            </section>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
