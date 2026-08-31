/* Signal Architecture case study: an evidence ledger, not a second marketing page. */
import { ArrowLeft, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const rows = [
  ["Application", "FastAPI + typed Pydantic contracts"],
  ["Automation", "pytest, API clients, Hypothesis, Playwright-ready"],
  ["Review boundary", "Structured output, safety validation, quarantine, human review"],
  ["Runtime", "Ubuntu-compatible commands with deterministic mock provider"],
];

export default function CaseStudy() {
  const overview = trpc.workspace.publicOverview.useQuery();
  return (
    <div className="case-page">
      <header className="site-header"><div className="container nav"><Link className="brand" href="/" aria-label="Back to SentinelQA home"><img className="brand-mark" src="/assets/sentinelqa-mark.png" alt="" /><span className="brand-wordmark">sentinel<span>qa</span></span></Link><Link className="nav-cta" href="/">Back to system <ArrowUpRight size={14} /></Link></div></header>
      <main className="case-main"><div className="container">
        <Link className="case-back" href="/"><ArrowLeft size={14} /> Back to the run</Link>
        <div className="eyebrow" style={{ marginTop: 45 }}>CASE STUDY / SENTINELQA-01</div>
        <h1 className="case-title">A test idea is not<br /><em>evidence yet.</em></h1>
        <p className="case-lede">SentinelQA is a small order API wrapped in a quality engineering system: deterministic tests first, assisted coverage second, and a review boundary around every generated suggestion.</p><div className="live-activity"><span className="panel-kicker">LIVE WORKSPACE ACTIVITY</span><strong>{overview.isLoading ? "Loading…" : `${overview.data?.runs ?? 0} runs recorded`}</strong><span>{overview.data?.scenarios ?? 0} scenarios · {overview.data?.findings ?? 0} findings</span></div>
        <div className="case-grid">
          <section className="case-panel accent"><div className="eyebrow">01 / System brief</div><h2>Quality engineering<br />as the product.</h2><p>The business domain stays intentionally narrow so the engineering evidence stays visible. An order has a finite state machine, role-specific actions, validation boundaries, and dependency failures—enough surface area to test what matters.</p><table className="case-table"><tbody>{rows.map(([label, value]) => <tr key={label}><th>{label}</th><td>{value}</td></tr>)}</tbody></table></section>
          <section className="case-panel"><div className="eyebrow">02 / Current signal</div><div className="case-stat"><span>Application coverage</span><strong>87%</strong></div><div className="case-stat"><span>Tests passing</span><strong>08</strong></div><div className="case-stat"><span>Defects mapped</span><strong>05</strong></div><div className="case-stat"><span>Live model calls in CI</span><strong>00</strong></div><div className="case-callout"><Check size={15} style={{ verticalAlign: "-3px", marginRight: 8, color: "var(--lime)" }} /> The mock provider keeps evaluation reproducible. Live model calls stay optional and never gate the build.</div></section>
          <section className="case-panel"><div className="eyebrow">03 / The rule</div><h2>Signals surface.<br />The harness decides.</h2><p>Suggestions must have a target, preconditions, input, observable expected result, and oracle. Schema failures, duplicate IDs, unavailable data, and unsafe operations are rejected or quarantined before execution.</p></section>
          <section className="case-panel"><div className="eyebrow">04 / Portfolio proof</div><h2>Show the failure<br />with its trail.</h2><p>Every request can carry a correlation ID. Failed tests retain the rule, response, and next investigation step so a reviewer can trace the difference between a red build and a useful diagnosis.</p><div className="case-callout"><ShieldCheck size={15} style={{ verticalAlign: "-3px", marginRight: 8, color: "var(--violet-soft)" }} /> Built for the interview conversation: coverage vs. behavior, repeatable vs. live evaluation, and automation that can be trusted.</div></section>
        </div>
        <div style={{ marginTop: 76 }}><Link className="primary-btn" href="/">Return to the live system <ArrowUpRight size={15} /></Link></div>
      </div></main>
    </div>
  );
}
