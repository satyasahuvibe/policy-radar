export type SourceStatus = "Live-ready" | "Candidate" | "Needs permission";
export type SourceKind =
  | "Official"
  | "Regulator"
  | "Legislative"
  | "Gazette"
  | "Think tank"
  | "Newsletter"
  | "Media"
  | "Open index";

export type Source = {
  name: string;
  kind: SourceKind;
  status: SourceStatus;
  coverage: string;
  use: string;
  url: string;
};

export type Signal = {
  title: string;
  topic: string;
  source: string;
  sourceKind: SourceKind;
  contentGroup: "Government statements" | "Analysis" | "News developments";
  importance: "Major" | "Notable" | "Routine";
  priority: number;
  stage: string;
  summary: string;
  whyItMatters: string;
  url: string;
};

export type Lane = {
  name: string;
  description: string;
  accent: string;
  signals: Signal[];
};

export const sourceRegistry: Source[] = [
  {
    name: "PIB filtered ministry feed",
    kind: "Official",
    status: "Live-ready",
    coverage: "MeitY, NITI Aayog, Commerce, External Affairs, Cabinet, semiconductors, AI, DPDP, digital economy.",
    use: "RSS is available, but v1 should only show items after keyword and ministry filtering.",
    url: "https://www.pib.gov.in/ViewRss.aspx?lang=1&reg=20",
  },
  {
    name: "MEA RSS feeds",
    kind: "Official",
    status: "Live-ready",
    coverage: "U.S.-India bilateral documents, press releases, media briefings, foreign policy statements.",
    use: "Use press releases and bilateral documents with India/U.S./technology/iCET/Quad filters.",
    url: "https://www.mea.gov.in/rss-feeds.htm",
  },
  {
    name: "TRAI RSS feeds",
    kind: "Regulator",
    status: "Live-ready",
    coverage: "Telecom, spectrum, consultation papers, recommendations, digital infrastructure.",
    use: "Good v1 source because official RSS exists and items map cleanly to consultation or regulator update.",
    url: "https://trai.gov.in/rss-feeds",
  },
  {
    name: "RBI RSS feeds",
    kind: "Regulator",
    status: "Live-ready",
    coverage: "Payments, fintech, digital currency, KYC, financial cyber resilience.",
    use: "Use only topic-filtered press releases, notifications, speeches, and publications.",
    url: "https://www.rbi.org.in/Scripts/rss.aspx",
  },
  {
    name: "SEBI RSS feed",
    kind: "Regulator",
    status: "Live-ready",
    coverage: "Market infrastructure, fintech platforms, cybersecurity circulars, investor protection.",
    use: "RSS endpoint is published; classify into circular, order, press release, and consultation.",
    url: "https://www.sebi.gov.in/rss.html",
  },
  {
    name: "Sansad legislation pages",
    kind: "Legislative",
    status: "Candidate",
    coverage: "Bills, status changes, introduced text PDFs, ministry ownership, assent details.",
    use: "Promising structured source, but v1 should verify stable endpoints before live automation.",
    url: "https://sansad.in/ls/legislation/bills",
  },
  {
    name: "eGazette",
    kind: "Gazette",
    status: "Candidate",
    coverage: "Final notifications, rules, acts, ministry notifications, official legal publication.",
    use: "High-value, but needs cautious parsing and ministry/topic filters to avoid legal noise.",
    url: "https://egazette.gov.in/",
  },
  {
    name: "CERT-In advisories",
    kind: "Official",
    status: "Candidate",
    coverage: "Cyber advisories, vulnerabilities, cyber readiness guidance.",
    use: "Noisy for policy, useful when severity or regulatory guidance terms appear.",
    url: "https://www.cert-in.org.in/s2cMainServlet?pageid=PUBADVLIST",
  },
  {
    name: "CCI press releases",
    kind: "Regulator",
    status: "Candidate",
    coverage: "Digital competition, platform conduct, antitrust orders, merger approvals.",
    use: "Good for Big Tech and digital markets, but feed generation should be tested before live use.",
    url: "https://www.cci.gov.in/public/antitrust/press-release",
  },
  {
    name: "Google News query feeds",
    kind: "Open index",
    status: "Candidate",
    coverage: "Current news developments across India tech policy, semiconductor investments, U.S.-India relations.",
    use: "Good discovery layer, not source of truth. Always link to original publisher and dedupe hard.",
    url: "https://news.google.com/rss/search?q=india+semiconductor+policy",
  },
  {
    name: "GDELT",
    kind: "Open index",
    status: "Candidate",
    coverage: "Global news search, event/entity context, multilingual discovery.",
    use: "Useful second layer for coverage breadth; do not mix with primary-source feed without labels.",
    url: "https://www.gdeltproject.org/",
  },
  {
    name: "Carnegie India",
    kind: "Think tank",
    status: "Candidate",
    coverage: "India technology policy, AI, iCET, U.S.-India strategic technology.",
    use: "Use as analysis/source-link layer after feed and terms verification.",
    url: "https://carnegieindia.org/",
  },
  {
    name: "ORF",
    kind: "Think tank",
    status: "Candidate",
    coverage: "Tech policy, foreign policy, strategic technology, digital public infrastructure.",
    use: "Useful analysis layer; verify feed, tags, and reuse terms before automation.",
    url: "https://www.orfonline.org/",
  },
  {
    name: "Tech Policy Press",
    kind: "Newsletter",
    status: "Candidate",
    coverage: "Global tech policy, platform governance, AI regulation, digital rights.",
    use: "Useful for comparative context; confirm RSS/newsletter access and reuse terms.",
    url: "https://www.techpolicy.press/",
  },
  {
    name: "Lawfare",
    kind: "Newsletter",
    status: "Candidate",
    coverage: "U.S. national security, cyber, export controls, platform law, foreign policy.",
    use: "Good U.S. context source if filtered to India, technology, export controls, and China.",
    url: "https://www.lawfaremedia.org/",
  },
  {
    name: "Rest of World India technology coverage",
    kind: "Media",
    status: "Candidate",
    coverage: "India technology industry, platforms, labor, startups, governance, digital public infrastructure.",
    use: "Useful narrative/news layer if feed access and reuse terms check out; otherwise link-out discovery only.",
    url: "https://restofworld.org/region/south-asia/",
  },
  {
    name: "Indian Express Explained",
    kind: "Media",
    status: "Candidate",
    coverage: "Plain-English explainers on policy, economics, technology, geopolitics, and legislation.",
    use: "Good readability model and discovery source; verify feed and only link/excerpt within allowed limits.",
    url: "https://indianexpress.com/section/explained/",
  },
  {
    name: "The Hindu BusinessLine technology and policy coverage",
    kind: "Media",
    status: "Candidate",
    coverage: "Business, telecom, electronics, technology industry, trade, and policy news.",
    use: "Potential news-development layer; verify RSS/category feeds and avoid full-content reuse unless permitted.",
    url: "https://www.thehindubusinessline.com/",
  },
  {
    name: "Economic Times technology coverage",
    kind: "Media",
    status: "Candidate",
    coverage: "Startups, technology companies, digital policy, platform economy, semiconductors, telecom.",
    use: "Useful for developments and market reaction, but likely needs strict link-out handling and deduping.",
    url: "https://economictimes.indiatimes.com/tech",
  },
  {
    name: "Moneycontrol technology coverage",
    kind: "Media",
    status: "Candidate",
    coverage: "Indian tech companies, policy-impact news, cybersecurity advisories, startups, markets.",
    use: "Useful current-news layer; verify feed behavior and show as publisher-linked cards only.",
    url: "https://www.moneycontrol.com/technology/",
  },
  {
    name: "Inc42 policy and startup coverage",
    kind: "Media",
    status: "Candidate",
    coverage: "Indian startups, funding, platform regulation, fintech, policy impact on digital business.",
    use: "Good for industry-side impact; verify free access, feed availability, and reuse terms before ingestion.",
    url: "https://inc42.com/",
  },
  {
    name: "The Diplomat South Asia and technology context",
    kind: "Media",
    status: "Candidate",
    coverage: "Geopolitics, U.S.-India, China, security, technology strategy, regional policy.",
    use: "Good context layer for U.S.-India and strategic tech; verify feed/category access.",
    url: "https://thediplomat.com/",
  },
  {
    name: "Takshashila Institution analysis",
    kind: "Newsletter",
    status: "Candidate",
    coverage: "Indian public policy, geopolitics, technology, defense, economic strategy.",
    use: "Free analysis/newsletter-style context if feed/newsletter archives are usable; verify terms first.",
    url: "https://takshashila.org.in/",
  },
  {
    name: "Data Governance Network",
    kind: "Think tank",
    status: "Candidate",
    coverage: "Data governance, privacy, digital economy, platform policy, India-focused research.",
    use: "Good research layer for data protection and governance, pending feed/source-terms verification.",
    url: "https://datagovernance.org/",
  },
  {
    name: "MediaNama",
    kind: "Media",
    status: "Needs permission",
    coverage: "India technology policy, privacy, platform regulation, competition, consultations.",
    use: "Valuable but terms restrict reuse. Treat as link-out or permissioned source, not full-content ingestion.",
    url: "https://www.medianama.com/",
  },
];

export const lanes: Lane[] = [
  {
    name: "India Tech Policy",
    description: "Rules, consultations, digital rights, data protection, AI governance, and platform regulation.",
    accent: "terra",
    signals: [
      {
        title: "Draft and final rule tracker for DPDP, IT Rules, online gaming, and AI advisories",
        topic: "Data and platform regulation",
        source: "MeitY policy pages + PIB filtered feed",
        sourceKind: "Official",
        contentGroup: "Government statements",
        importance: "Major",
        priority: 96,
        stage: "V1 feed lane",
        summary:
          "The lane is designed to surface only policy documents, consultation notices, final rules, and ministry explanations instead of every ministry update.",
        whyItMatters:
          "This keeps the feed focused on legal and compliance changes that actually affect companies, users, and researchers.",
        url: "https://www.meity.gov.in/documents/act-and-policies?page=1",
      },
      {
        title: "Digital competition and Big Tech conduct watchlist",
        topic: "Digital markets",
        source: "CCI + PRS + filtered media discovery",
        sourceKind: "Regulator",
        contentGroup: "Government statements",
        importance: "Notable",
        priority: 82,
        stage: "Candidate automation",
        summary:
          "Track competition orders, press releases, bill movement, committee reports, and serious news developments around app stores, payments, e-commerce, and platforms.",
        whyItMatters:
          "Digital competition stories rarely live in one place; a good dashboard should group the regulator, bill, and analysis trail together.",
        url: "https://www.cci.gov.in/public/antitrust/press-release",
      },
    ],
  },
  {
    name: "Semiconductor Radar",
    description: "India Semiconductor Mission, fabs, packaging, supply chains, investment, export controls, and iCET.",
    accent: "gold",
    signals: [
      {
        title: "ISM project and incentive monitor",
        topic: "Semiconductor industrial policy",
        source: "PIB + ISM + NITI + Google News query layer",
        sourceKind: "Official",
        contentGroup: "News developments",
        importance: "Major",
        priority: 94,
        stage: "V1 feed lane",
        summary:
          "Follow approved plants, investor-support announcements, scheme changes, state incentives, and policy roadmaps.",
        whyItMatters:
          "The raw government signal is sparse, while news developments are scattered. The dashboard should connect official announcements with follow-up reporting.",
        url: "https://ism.gov.in/",
      },
      {
        title: "U.S.-India semiconductor and export-control context",
        topic: "Strategic technology",
        source: "USTR + Commerce + CSIS + ITIF + Carnegie",
        sourceKind: "Think tank",
        contentGroup: "Analysis",
        importance: "Notable",
        priority: 86,
        stage: "Candidate source pack",
        summary:
          "Track iCET, commercial dialogue, supply chain cooperation, export controls, and think-tank analysis of India readiness.",
        whyItMatters:
          "India semiconductor policy is inseparable from geopolitics and U.S.-China technology controls.",
        url: "https://itif.org/publications/2024/02/14/india-semiconductor-readiness/",
      },
    ],
  },
  {
    name: "U.S.-India Track",
    description: "Diplomacy, trade, strategic tech, defense technology, commercial dialogue, and critical minerals.",
    accent: "blue",
    signals: [
      {
        title: "Bilateral statement and trade negotiation feed",
        topic: "U.S.-India relations",
        source: "MEA RSS + USTR RSS + Commerce pages",
        sourceKind: "Official",
        contentGroup: "Government statements",
        importance: "Major",
        priority: 91,
        stage: "Live-ready source pack",
        summary:
          "Pair Indian official statements with U.S. trade and commerce updates to prevent one-sided reading.",
        whyItMatters:
          "For U.S.-India policy, the dashboard should make it easy to compare both governments' public language.",
        url: "https://ustr.gov/archive/Meta_Content/RSS/Section_Index.html",
      },
      {
        title: "Strategic technology analysis stream",
        topic: "iCET and defense tech",
        source: "Carnegie + CSIS + Brookings + ORF",
        sourceKind: "Think tank",
        contentGroup: "Analysis",
        importance: "Notable",
        priority: 78,
        stage: "Candidate source pack",
        summary:
          "Curate longer analysis and newsletters into a separate lane so daily official updates do not drown out interpretation.",
        whyItMatters:
          "This is where the dashboard becomes more useful than a government feed reader.",
        url: "https://www.csis.org/analysis/sustaining-momentum-us-india-technology-ties",
      },
    ],
  },
  {
    name: "Consultations & Deadlines",
    description: "Open consultations, comment windows, draft rules, regulator papers, and submission links.",
    accent: "green",
    signals: [
      {
        title: "Open consultation queue",
        topic: "Public participation",
        source: "MeitY + TRAI + RBI + SEBI + filtered PIB",
        sourceKind: "Regulator",
        contentGroup: "Government statements",
        importance: "Major",
        priority: 89,
        stage: "Core v1 feature",
        summary:
          "A dedicated queue for items containing consultation, draft, comments invited, stakeholder feedback, deadline, or public notice.",
        whyItMatters:
          "This is the part ordinary feeds fail at: they do not preserve the action deadline in a visible way.",
        url: "https://trai.gov.in/rss-feeds",
      },
    ],
  },
  {
    name: "AI, Cyber & Telecom",
    description: "AI governance, cybersecurity advisories, telecom regulation, spectrum, fintech rails, and platform safety.",
    accent: "slate",
    signals: [
      {
        title: "AI governance and synthetic-content rule watch",
        topic: "AI governance",
        source: "MeitY + PIB + analysis/news candidate layer",
        sourceKind: "Official",
        contentGroup: "Government statements",
        importance: "Major",
        priority: 88,
        stage: "Core v1 feature",
        summary:
          "Track AI advisories, synthetic media rules, consultation notices, safety obligations, and official clarifications.",
        whyItMatters:
          "AI policy is likely to move through advisories, draft rules, and consultations before it becomes clean legislation.",
        url: "https://www.meity.gov.in/",
      },
      {
        title: "Cyber and telecom regulator watch",
        topic: "Cybersecurity and telecom",
        source: "CERT-In + TRAI + RBI + SEBI",
        sourceKind: "Regulator",
        contentGroup: "Government statements",
        importance: "Notable",
        priority: 81,
        stage: "Candidate automation",
        summary:
          "Surface only high-severity cyber guidance, telecom consultations, digital infrastructure updates, and finance-sector cyber circulars.",
        whyItMatters:
          "This prevents vulnerability bulletins and routine telecom releases from overwhelming actual policy movement.",
        url: "https://www.cert-in.org.in/s2cMainServlet?pageid=PUBADVLIST",
      },
    ],
  },
];

export const prioritySignals = lanes
  .flatMap((lane) => lane.signals.map((signal) => ({ ...signal, lane: lane.name })))
  .sort((a, b) => b.priority - a.priority);

export const contentGroups = [
  {
    name: "Government statements",
    description: "Official announcements, regulator releases, bills, consultations, gazette notifications, speeches, and public documents.",
  },
  {
    name: "News developments",
    description: "Free news discovery and publisher-linked developments, used to catch what official sources do not explain clearly.",
  },
  {
    name: "Analysis",
    description: "Free newsletters, think-tank pieces, op-eds, explainers, and expert commentary kept separate from official source material.",
  },
] as const;

export const relevanceRules = [
  "The default feed is blended and sorted by priority, not by source type.",
  "Official sources, news, and analysis are visually separated so users can tell what they are reading.",
  "Newsletters and op-eds belong in Analysis unless they are reporting a concrete new development.",
  "China, EU, Japan, Korea, Taiwan, and global semiconductor controls appear only when directly relevant to India or U.S.-India policy.",
  "Candidate sources never enter the public feed until fetch health, terms, and duplicate behavior are checked.",
];

export const workflowSteps = [
  "Collect only from enabled sources.",
  "Filter by topic, ministry, agency, jurisdiction, and document type.",
  "Deduplicate repeated announcements across official, media, and analysis sources.",
  "Label every item by source kind and confidence.",
  "Show source links prominently; extract full text only where allowed.",
  "Keep candidates invisible from the public feed until they pass a source-health check.",
];

export const featureBacklog = [
  "Manual refresh button with source-health report.",
  "Scheduled refresh through GitHub Actions rather than relying on Vercel Hobby cron.",
  "Saved watchlists for DPDP, ISM, iCET, digital competition, telecom, and cyber.",
  "Reader pane with original link, metadata, related developments, and permitted excerpt.",
  "Source comparison view: India official, U.S. official, news, analysis.",
  "Consultation deadline strip with calendar export.",
  "Weekly briefing generated from only verified items.",
  "Admin source manager with status, parse method, allowed-use notes, and last successful fetch.",
];
