import {
  contentGroups,
  featureBacklog,
  lanes,
  prioritySignals,
  relevanceRules,
  sourceRegistry,
  workflowSteps,
} from "@/data/policy-radar";

const statusCounts = sourceRegistry.reduce<Record<string, number>>((counts, source) => {
  counts[source.status] = (counts[source.status] ?? 0) + 1;
  return counts;
}, {});

const activeSources = sourceRegistry.filter((source) => source.status === "Live-ready");
const candidateSources = sourceRegistry.filter((source) => source.status !== "Live-ready");

export default function Home() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Policy Radar / version 1 website concept</p>
          <h1>A calm, curated tracker for India tech policy and U.S.-India strategic technology.</h1>
          <p className="hero__lead">
            Built around verified source lanes first: official feeds where they are dependable, candidate
            sources where they add range, and clear labels so a broken or permission-risky source never
            quietly pollutes the reader experience.
          </p>
          <div className="hero__actions">
            <a href="#lanes">Explore lanes</a>
            <a href="#sources" className="ghost-link">
              Source registry
            </a>
          </div>
        </div>
        <aside className="briefing-card" aria-label="Today briefing preview">
          <div className="briefing-card__top">
            <span>Today&apos;s signal</span>
            <strong>Prototype</strong>
          </div>
          <h2>Show less, explain more.</h2>
          <p>
            V1 defaults to clean lanes, source badges, and candidate-source quarantine. Actual live
            ingestion should only turn on after each source passes a fetch and terms check.
          </p>
          <div className="metric-grid">
            <div>
              <strong>{sourceRegistry.length}</strong>
              <span>mapped sources</span>
            </div>
            <div>
              <strong>{activeSources.length}</strong>
              <span>live-ready</span>
            </div>
            <div>
              <strong>{lanes.length}</strong>
              <span>curated lanes</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="control-strip" aria-label="Dashboard controls">
        <div>
          <span className="label">Default view</span>
          <strong>Blended by priority</strong>
        </div>
        <div>
          <span className="label">Analysis handling</span>
          <strong>Separate column</strong>
        </div>
        <div>
          <span className="label">Government material</span>
          <strong>Dedicated tab</strong>
        </div>
        <button type="button">Refresh preview</button>
      </section>

      <section className="section-heading" id="priority">
        <p className="eyebrow">High-priority first</p>
        <h2>The home feed blends sources, but never blurs what type of source each item is.</h2>
      </section>

      <section className="priority-board" aria-label="Blended priority feed">
        <div className="priority-main">
          {prioritySignals.slice(0, 4).map((signal, index) => (
            <a href={signal.url} className="priority-card" key={signal.title} target="_blank" rel="noreferrer">
              <span className="rank">0{index + 1}</span>
              <div>
                <div className="signal-card__meta">
                  <span>{signal.importance}</span>
                  <span>{signal.contentGroup}</span>
                  <span>{signal.lane}</span>
                </div>
                <h3>{signal.title}</h3>
                <p>{signal.summary}</p>
              </div>
            </a>
          ))}
        </div>
        <aside className="analysis-column">
          <p className="eyebrow">Analysis column</p>
          <h3>Newsletters, op-eds, explainers, and think-tank context live here.</h3>
          {prioritySignals
            .filter((signal) => signal.contentGroup === "Analysis")
            .map((signal) => (
              <a href={signal.url} key={signal.title} target="_blank" rel="noreferrer">
                <strong>{signal.title}</strong>
                <span>{signal.source}</span>
              </a>
            ))}
        </aside>
      </section>

      <section className="content-tabs" aria-label="Content categories">
        {contentGroups.map((group) => (
          <article key={group.name}>
            <span>{group.name}</span>
            <p>{group.description}</p>
          </article>
        ))}
      </section>

      <section className="section-heading" id="lanes">
        <p className="eyebrow">Curated feeds</p>
        <h2>Topic lanes that behave like a briefing desk, not a raw RSS dump.</h2>
      </section>

      <section className="lane-grid">
        {lanes.map((lane) => (
          <article className={`lane lane--${lane.accent}`} key={lane.name}>
            <div className="lane__header">
              <div>
                <span>{lane.signals.length} signals</span>
                <h3>{lane.name}</h3>
              </div>
              <button type="button">Follow</button>
            </div>
            <p>{lane.description}</p>
            <div className="signal-stack">
              {lane.signals.map((signal) => (
                <a href={signal.url} className="signal-card" key={signal.title} target="_blank" rel="noreferrer">
                  <div className="signal-card__meta">
                    <span>{signal.importance}</span>
                    <span>{signal.sourceKind}</span>
                    <span>{signal.stage}</span>
                  </div>
                  <h4>{signal.title}</h4>
                  <p>{signal.summary}</p>
                  <div className="why">
                    <strong>Why it matters</strong>
                    <span>{signal.whyItMatters}</span>
                  </div>
                  <div className="source-line">
                    <span>{signal.source}</span>
                    <span>Open source</span>
                  </div>
                </a>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="split-section">
        <article className="panel">
          <p className="eyebrow">How v1 avoids junk</p>
          <h2>Candidate sources are quarantined until proven healthy.</h2>
          <div className="workflow">
            {workflowSteps.map((step, index) => (
              <div className="workflow__step" key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="panel panel--warm">
          <p className="eyebrow">Rubric rules</p>
          <h2>Relevant beats exhaustive.</h2>
          <div className="rule-list">
            {relevanceRules.map((rule) => (
              <p key={rule}>{rule}</p>
            ))}
          </div>
        </article>
      </section>

      <section className="section-heading" id="sources">
        <p className="eyebrow">Source registry</p>
        <h2>Every source has a role, status, and use rule.</h2>
      </section>

      <section className="source-summary">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status}>
            <strong>{count}</strong>
            <span>{status}</span>
          </div>
        ))}
      </section>

      <section className="source-grid">
        {activeSources.map((source) => (
          <a className="source-card source-card--ready" href={source.url} key={source.name} target="_blank" rel="noreferrer">
            <div>
              <span>{source.kind}</span>
              <strong>{source.status}</strong>
            </div>
            <h3>{source.name}</h3>
            <p>{source.coverage}</p>
            <small>{source.use}</small>
          </a>
        ))}
      </section>

      <details className="candidate-drawer">
        <summary>Candidate and permission-sensitive sources for broader news, newsletters, and analysis</summary>
        <div className="source-grid">
          {candidateSources.map((source) => (
            <a className="source-card" href={source.url} key={source.name} target="_blank" rel="noreferrer">
              <div>
                <span>{source.kind}</span>
                <strong>{source.status}</strong>
              </div>
              <h3>{source.name}</h3>
              <p>{source.coverage}</p>
              <small>{source.use}</small>
            </a>
          ))}
        </div>
      </details>

      <section className="backlog">
        <div>
          <p className="eyebrow">Next features</p>
          <h2>Build order after the static v1 shell.</h2>
        </div>
        <ul>
          {featureBacklog.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
