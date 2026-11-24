import DitherImage from "@/components/DitherImage";
import { RAP_SHEET } from "@/lib/content";

export default function RapSheet() {
  return <article className="rap" aria-label="Rap sheet">
    <header className="rap-head">
      <span className="mono-label">VICE COAST PD · RECORD #KP-001</span>
      <span className="rap-wanted">WANTED</span>
    </header>
    <div className="rap-grid">
      <div className="rap-mug">
        <DitherImage src="/kiruba-profile.jpg" alt="" size={132} />
        <span className="rap-plate">KIRUBA · 0011</span>
      </div>
      <div className="rap-body">
        <span className="mono-label">CHARGES</span>
        <ul className="rap-charges">{RAP_SHEET.charges.map(c => <li key={c.text}><b>{c.count}</b>{c.text}</li>)}</ul>
        <div className="rap-row">
          <div><span className="mono-label">KNOWN ASSOCIATES</span><p>{RAP_SHEET.associates.join(" · ")}</p></div>
          <div><span className="mono-label">LAST SEEN</span><p>{RAP_SHEET.lastSeen}</p></div>
        </div>
      </div>
    </div>
    <footer className="rap-foot mono-label">If spotted, make an offer. Considered friendly.</footer>
  </article>;
}
