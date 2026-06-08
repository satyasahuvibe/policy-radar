import { curatedItems, feedSources, type FeedItem, type FeedSource, type Topic } from "@/data/policy-radar";

export const dynamic = "force-dynamic";

const MAX_ITEMS_PER_SOURCE = 8;

function stripCdata(value: string) {
  return value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function decodeEntities(value: string) {
  return stripCdata(value)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\u00e2\u0080\u0099/g, "'")
    .replace(/\u00e2\u0080\u0098/g, "'")
    .replace(/\u00e2\u0080\u009c|\u00e2\u0080\u009d/g, '"')
    .replace(/\u00e2\u0080\u0093|\u00e2\u0080\u0094/g, "-")
    .replace(/â/g, "'")
    .replace(/â|â/g, '"')
    .replace(/â|â/g, "-")
    .replace(/Â/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readableSummary(value: string) {
  const clean = decodeEntities(value).trim();

  if (clean.length <= 360) return clean;
  return `${clean.slice(0, 357).trim()}...`;
}

function getTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function getLink(block: string) {
  const rssLink = getTag(block, "link");
  if (rssLink) return rssLink;

  const atomLink = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i);
  return atomLink ? decodeEntities(atomLink[1]) : "";
}

function inferTopics(text: string, source: FeedSource): Topic[] {
  const lower = text.toLowerCase();
  const topics = new Set<Topic>(source.topics);

  if (/(semiconductor|chip|fab|osat|atmp|micron|ism|electronics manufacturing)/.test(lower)) {
    topics.add("Semiconductors");
  }
  if (/(u\.s\.|us-|united states|america|icet|ustr|bilateral|quad)/.test(lower)) {
    topics.add("U.S.-India");
  }
  if (/(artificial intelligence|\bai\b|synthetic|deepfake|compute|model)/.test(lower)) {
    topics.add("AI governance");
  }
  if (/(competition|antitrust|app store|platform|e-commerce|digital market)/.test(lower)) {
    topics.add("Digital competition");
  }
  if (/(cyber|cert-in|vulnerability|security|ransomware|incident)/.test(lower)) {
    topics.add("Cybersecurity");
  }
  if (/(telecom|spectrum|broadband|trai|satellite communication|ott)/.test(lower)) {
    topics.add("Telecom");
  }

  return Array.from(topics);
}

function scoreItem(text: string, source: FeedSource) {
  const lower = text.toLowerCase();
  let score = source.group === "Government statements" ? 60 : 45;

  const strongWords = [
    "draft",
    "consultation",
    "rules",
    "bill",
    "gazette",
    "approved",
    "cabinet",
    "semiconductor",
    "data protection",
    "artificial intelligence",
    "u.s.",
    "united states",
    "icet",
    "competition",
    "cyber",
    "spectrum",
  ];

  for (const word of strongWords) {
    if (lower.includes(word)) score += 5;
  }

  if (source.keywords.some((keyword) => lower.includes(keyword.toLowerCase()))) score += 12;
  return Math.min(score, 99);
}

function isRelevant(text: string, source: FeedSource) {
  const lower = text.toLowerCase();
  if (source.mustInclude?.some((keyword) => !lower.includes(keyword.toLowerCase()))) {
    return false;
  }
  if (source.excludeKeywords?.some((keyword) => lower.includes(keyword.toLowerCase()))) {
    return false;
  }
  return source.keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
}

async function fetchSource(source: FeedSource): Promise<FeedItem[]> {
  const response = await fetch(source.url, {
    headers: {
      "user-agent": "PolicyRadar/1.0 (+https://policy-radar-eta.vercel.app)",
      accept: "application/rss+xml, application/xml, text/xml, */*",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`${source.name} returned ${response.status}`);
  }

  const xml = await response.text();
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? xml.match(/<entry[\s\S]*?<\/entry>/gi) ?? [];

  const parsedItems: Array<FeedItem | null> = blocks.map((block, index) => {
      const title = getTag(block, "title");
      const link = getLink(block);
      const rawSummary = getTag(block, "description") || getTag(block, "summary") || getTag(block, "content");
      const summary = readableSummary(rawSummary);
      const publishedAt = getTag(block, "pubDate") || getTag(block, "published") || getTag(block, "updated");
      const text = `${title} ${summary}`;

      if (!title || !link || !isRelevant(text, source)) return null;

      return {
        id: `${source.id}-${index}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 90),
        title,
        source: source.name,
        sourceKind: source.kind,
        group: source.group,
        topics: inferTopics(text, source),
        link,
        publishedAt,
        summary: summary || "Open the original source for full details.",
        priority: scoreItem(text, source),
      } satisfies FeedItem;
    });

  return parsedItems.filter((item): item is FeedItem => Boolean(item)).slice(0, MAX_ITEMS_PER_SOURCE);
}

function dedupe(items: FeedItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.link.replace(/^https?:\/\/(www\.)?/, "").split("?")[0].toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function GET() {
  const results = await Promise.allSettled(feedSources.map(fetchSource));
  const liveItems = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  const failedSources = results
    .map((result, index) => (result.status === "rejected" ? feedSources[index].name : null))
    .filter(Boolean);

  const items = dedupe([...curatedItems, ...liveItems]).sort((a, b) => b.priority - a.priority);

  return Response.json({
    generatedAt: new Date().toISOString(),
    failedSources,
    items,
  });
}
