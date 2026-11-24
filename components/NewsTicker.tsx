import { NEWS } from "@/lib/content";

/** In-world TV news crawl. Content is duplicated once for a seamless CSS loop. */
export default function NewsTicker() {
  const items = NEWS.map((n, i) => <li key={i}><span className="news-dot" aria-hidden="true">◆</span>{n}</li>);
  return <div className="news" role="region" aria-label="Vice Coast News headlines">
    <div className="news-badge"><span className="news-live"><i /> LIVE</span><b>VCN</b><small>Vice Coast News</small></div>
    <div className="news-track">
      <ul className="news-list">{items}</ul>
      <ul className="news-list" aria-hidden="true">{NEWS.map((n, i) => <li key={i}><span className="news-dot">◆</span>{n}</li>)}</ul>
    </div>
  </div>;
}
