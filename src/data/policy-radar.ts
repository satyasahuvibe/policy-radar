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

export const curatedItems: FeedItem[] = [
  {
    id: "gov-meity-policy-documents",
    title: "MeitY policy documents: DPDP, IT Rules, online gaming, AI and digital governance",
    source: "Ministry of Electronics and IT",
    sourceKind: "Official",
    group: "Government statements",
    topics: ["India tech policy", "AI governance"],
    link: "https://www.meity.gov.in/documents/act-and-policies?page=1",
    summary:
      "Primary official source for India's core digital regulation documents, including data protection, intermediary rules, online gaming and AI-related advisories.",
    priority: 96,
  },
  {
    id: "gov-ism",
    title: "India Semiconductor Mission: schemes, investor support, and project announcements",
    source: "India Semiconductor Mission",
    sourceKind: "Official",
    group: "Government statements",
    topics: ["Semiconductors"],
    link: "https://ism.gov.in/",
    summary:
      "Official mission hub for semiconductor incentives, investor support, approved projects and ecosystem announcements.",
    priority: 95,
  },
  {
    id: "reg-trai-consultations",
    title: "TRAI consultations and recommendations: telecom, spectrum, broadband, satellite and OTT",
    source: "TRAI",
    sourceKind: "Regulator",
    group: "Government statements",
    topics: ["Telecom", "India tech policy"],
    link: "https://trai.gov.in/rss-feeds",
    summary:
      "Regulator feed for consultation papers, recommendations and policy signals across telecom and digital infrastructure.",
    priority: 92,
  },
  {
    id: "gov-mea-us-india",
    title: "MEA bilateral releases: U.S.-India diplomacy, iCET, Quad and strategic technology",
    source: "Ministry of External Affairs",
    sourceKind: "Official",
    group: "Government statements",
    topics: ["U.S.-India", "Semiconductors"],
    link: "https://www.mea.gov.in/rss-feeds.htm",
    summary:
      "Indian official releases and briefings for bilateral policy, strategic technology cooperation, Quad and high-level diplomacy.",
    priority: 90,
  },
  {
    id: "gov-ustr-india",
    title: "USTR India track: trade, tariffs, market access, digital trade and supply chains",
    source: "USTR",
    sourceKind: "Official",
    group: "Government statements",
    topics: ["U.S.-India", "Semiconductors"],
    link: "https://ustr.gov/rss.xml",
    summary:
      "U.S. official trade feed filtered for India relevance, useful for comparing American trade language with Indian official statements.",
    priority: 88,
  },
  {
    id: "analysis-carnegie-india-tech",
    title: "Carnegie India: technology policy, iCET, semiconductors and digital public infrastructure",
    source: "Carnegie India",
    sourceKind: "Analysis",
    group: "Analysis",
    topics: ["India tech policy", "U.S.-India", "Semiconductors", "AI governance"],
    link: "https://carnegieindia.org/",
    summary:
      "Research and commentary on strategic technology, India-U.S. cooperation, digital public infrastructure and AI governance.",
    priority: 87,
  },
  {
    id: "analysis-orf-tech",
    title: "ORF technology and strategic affairs analysis",
    source: "Observer Research Foundation",
    sourceKind: "Analysis",
    group: "Analysis",
    topics: ["India tech policy", "U.S.-India", "AI governance", "Cybersecurity"],
    link: "https://www.orfonline.org/",
    summary:
      "Analysis stream for Indian foreign policy, strategic technology, cyber governance and digital economy debates.",
    priority: 84,
  },
  {
    id: "analysis-iff",
    title: "Internet Freedom Foundation: privacy, surveillance, AI and platform governance",
    source: "Internet Freedom Foundation",
    sourceKind: "Analysis",
    group: "Analysis",
    topics: ["India tech policy", "AI governance", "Digital competition", "Cybersecurity"],
    link: "https://internetfreedom.in/",
    summary:
      "Civil-society analysis and campaign updates on data protection, internet freedom, surveillance, digital rights and platform accountability.",
    priority: 82,
  },
  {
    id: "analysis-prs",
    title: "PRS Legislative Research: bills, standing committees and monthly policy review",
    source: "PRS Legislative Research",
    sourceKind: "Analysis",
    group: "Analysis",
    topics: ["India tech policy", "Digital competition", "Telecom"],
    link: "https://prsindia.org/",
    summary:
      "Legislative explainers and bill tracking to connect policy announcements with Parliament, committees and statutory changes.",
    priority: 80,
  },
  {
    id: "news-medianama-linkout",
    title: "MediaNama link-out stream for Indian technology policy developments",
    source: "MediaNama",
    sourceKind: "News",
    group: "News developments",
    topics: ["India tech policy", "Digital competition", "AI governance"],
    link: "https://www.medianama.com/",
    summary:
      "High-signal Indian tech-policy reporting source. V1 links out rather than ingesting full content because reuse terms need care.",
    priority: 78,
  },
  {
    id: "news-rest-of-world",
    title: "Rest of World: India tech industry, platforms and governance context",
    source: "Rest of World",
    sourceKind: "News",
    group: "News developments",
    topics: ["India tech policy", "AI governance", "Digital competition"],
    link: "https://restofworld.org/region/south-asia/",
    summary:
      "Reporting source for technology companies, platforms, workers, users and digital economy shifts in South Asia.",
    priority: 76,
  },
  {
    id: "news-indian-express-explained",
    title: "Indian Express Explained: plain-English policy and geopolitics explainers",
    source: "Indian Express Explained",
    sourceKind: "News",
    group: "News developments",
    topics: ["India tech policy", "U.S.-India", "AI governance"],
    link: "https://indianexpress.com/section/explained/",
    summary:
      "Readable explainers for public policy, courts, technology, geopolitics and legislation. Useful context alongside official documents.",
    priority: 74,
  },
];

export const fallbackItems = curatedItems;
