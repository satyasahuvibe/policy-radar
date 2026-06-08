export type ContentGroup = "Government statements" | "News developments" | "Analysis";
export type Topic =
  | "India tech policy"
  | "Semiconductors"
  | "U.S.-India"
  | "AI governance"
  | "Digital competition"
  | "Cybersecurity"
  | "Telecom";

export type SourceKind = "Official" | "Regulator" | "News" | "Analysis" | "Open index";

export type FeedSource = {
  id: string;
  name: string;
  url: string;
  kind: SourceKind;
  group: ContentGroup;
  topics: Topic[];
  keywords: string[];
  mustInclude?: string[];
  excludeKeywords?: string[];
};

export type FeedItem = {
  id: string;
  title: string;
  source: string;
  sourceKind: SourceKind;
  group: ContentGroup;
  topics: Topic[];
  link: string;
  publishedAt?: string;
  summary: string;
  priority: number;
};

export const topicList: Topic[] = [
  "India tech policy",
  "Semiconductors",
  "U.S.-India",
  "AI governance",
  "Digital competition",
  "Cybersecurity",
  "Telecom",
];

export const feedSources: FeedSource[] = [
  {
    id: "trai",
    name: "TRAI",
    url: "https://trai.gov.in/rss-feeds",
    kind: "Regulator",
    group: "Government statements",
    topics: ["Telecom", "India tech policy"],
    keywords: ["consultation", "recommendation", "telecom", "spectrum", "ott", "digital", "broadband"],
  },
  {
    id: "ustr",
    name: "USTR",
    url: "https://ustr.gov/rss.xml",
    kind: "Official",
    group: "Government statements",
    topics: ["U.S.-India", "Semiconductors"],
    keywords: ["india", "technology", "trade", "digital", "semiconductor", "tariff"],
    mustInclude: ["india"],
  },
  {
    id: "google-semiconductors",
    name: "Google News: India semiconductors",
    url: "https://news.google.com/rss/search?q=(%22India%20Semiconductor%20Mission%22%20OR%20India%20semiconductor%20policy)%20when:30d&hl=en-IN&gl=IN&ceid=IN:en",
    kind: "Open index",
    group: "News developments",
    topics: ["Semiconductors", "U.S.-India"],
    keywords: ["india", "semiconductor", "chip", "fab", "micron", "ism", "icet", "supply chain"],
  },
  {
    id: "google-tech-policy",
    name: "Google News: India tech policy",
    url: "https://news.google.com/rss/search?q=India%20(%22tech%20policy%22%20OR%20%22data%20protection%22%20OR%20%22AI%20governance%22%20OR%20%22digital%20competition%22)%20when:30d&hl=en-IN&gl=IN&ceid=IN:en",
    kind: "Open index",
    group: "News developments",
    topics: ["India tech policy", "AI governance", "Digital competition"],
    keywords: ["india", "policy", "data protection", "ai", "digital competition", "platform", "meity"],
  },
  {
    id: "google-us-india",
    name: "Google News: U.S.-India strategic tech",
    url: "https://news.google.com/rss/search?q=(U.S.%20India%20OR%20US%20India)%20(iCET%20OR%20technology%20OR%20semiconductor%20OR%20defense%20tech%20OR%20trade)%20when:30d&hl=en-US&gl=US&ceid=US:en",
    kind: "Open index",
    group: "News developments",
    topics: ["U.S.-India", "Semiconductors"],
    keywords: ["india", "u.s.", "us", "technology", "icet", "semiconductor", "trade", "defense"],
  },
  {
    id: "tech-policy-press",
    name: "Tech Policy Press",
    url: "https://www.techpolicy.press/rss/",
    kind: "Analysis",
    group: "Analysis",
    topics: ["AI governance", "India tech policy", "Digital competition"],
    keywords: ["india", "ai", "platform", "data", "governance", "digital", "policy"],
  },
];

export const fallbackItems: FeedItem[] = [
  {
    id: "fallback-dpdp",
    title: "Track DPDP Rules, IT Rules, AI advisories, and platform obligations",
    source: "MeitY policy documents",
    sourceKind: "Official",
    group: "Government statements",
    topics: ["India tech policy", "AI governance"],
    link: "https://www.meity.gov.in/documents/act-and-policies?page=1",
    summary:
      "Official policy-document stream for India's core digital regulation areas: data protection, intermediary rules, online gaming, AI and synthetic media notices.",
    priority: 59,
  },
  {
    id: "fallback-semicon",
    title: "Monitor India Semiconductor Mission announcements and project updates",
    source: "India Semiconductor Mission",
    sourceKind: "Official",
    group: "Government statements",
    topics: ["Semiconductors"],
    link: "https://ism.gov.in/",
    summary:
      "Primary landing source for ISM schemes, approved projects, investor-support notices, and semiconductor ecosystem updates.",
    priority: 58,
  },
  {
    id: "fallback-trai",
    title: "Watch TRAI consultations and recommendations for telecom and digital infrastructure",
    source: "TRAI",
    sourceKind: "Regulator",
    group: "Government statements",
    topics: ["Telecom", "India tech policy"],
    link: "https://trai.gov.in/rss-feeds",
    summary:
      "Telecom policy often moves through consultations before rules change. This stream tracks papers, recommendations, and response deadlines.",
    priority: 57,
  },
  {
    id: "fallback-us-india",
    title: "Compare Indian and U.S. official language on strategic technology cooperation",
    source: "MEA and USTR",
    sourceKind: "Official",
    group: "Government statements",
    topics: ["U.S.-India", "Semiconductors"],
    link: "https://ustr.gov/archive/Meta_Content/RSS/Section_Index.html",
    summary:
      "U.S.-India technology ties need paired reading: Indian diplomatic statements, U.S. trade language, and follow-up analysis.",
    priority: 56,
  },
  {
    id: "fallback-analysis",
    title: "Read analysis separately from official announcements",
    source: "Free newsletters, think tanks, explainers, and op-eds",
    sourceKind: "Analysis",
    group: "Analysis",
    topics: ["India tech policy", "U.S.-India", "Semiconductors"],
    link: "https://www.techpolicy.press/",
    summary:
      "Analysis is useful, but it should not masquerade as an official update. The dashboard keeps commentary in its own column.",
    priority: 55,
  },
];
