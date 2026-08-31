/* Signal Architecture page: evidence-first editorial layout, with motion reserved for inspection moments. */
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, ChevronRight, Menu, Play, ShieldCheck, Sparkles } from "lucide-react";
import GradientWaves from "@/components/GradientWaves";
import ScrollExpand from "@/components/ScrollExpand";
import AnimatedList from "@/components/AnimatedList";
import BlurText from "@/components/BlurText";
import { trpc } from "@/lib/trpc";

const HERO_IMAGE = "/assets/sentinelqa-hero.jpg";
const SIGNAL_IMAGE = "/assets/sentinelqa-signal.jpg";
const TRIAGE_IMAGE = "/assets/sentinelqa-triage.jpg";
const MARK_IMAGE = "/assets/sentinelqa-mark.png";

const defects = [
  { name: "Cancellation after dispatch", tag: "STATE MACHINE", rule: "D-001", detail: "A dispatched order must reject cancellation with a 409 and preserve its state." },
  { name: "Quantity at the boundary", tag: "VALIDATION", rule: "D-002", detail: "The contract accepts quantities from 1 through 20, then rejects the next integer." },
  { name: "Role escalation attempt", tag: "AUTHORIZATION", rule: "D-003", detail: "Only staff may transition delivery status; a user request returns 403." },
  { name: "Malformed model response", tag: "SAFETY CHECK", rule: "D-004", detail: "A suggestion without an observable oracle is quarantined before it can run." },
  { name: "Missing request trace", tag: "OBSERVABILITY", rule: "D-005", detail: "Every response carries a request ID so a failure can be traced through logs." },
];

export default function Home() {
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const overview = trpc.workspace.publicOverview.useQuery();
  const [selectedDefect, setSelectedDefect] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const selected = defects[selectedDefect];
  const goToRun = () => document.querySelector("#quality-run")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container nav">
          <a className="brand" href="#top" aria-label="SentinelQA home"><img className="brand-mark" src={MARK_IMAGE} alt="" /><span className="brand-wordmark">sentinel<span>qa</span></span></a>
          <nav className={`nav-links ${mobileOpen ? "is-open" : ""}`} aria-label="Primary navigation">
            <a href="#coverage" onClick={() => setMobileOpen(false)}>Coverage</a>
            <a href="#quality-run" onClick={() => setMobileOpen(false)}>Quality run</a>
            <a href="#analysis-layer" onClick={() => setMobileOpen(false)}>Analysis layer</a>
            <a href="/case-study" onClick={() => setMobileOpen(false)}>Case study</a>
              <a href="/workspace" onClick={() => setMobileOpen(false)}>Workspace</a>
          </nav>
          <a className="nav-cta" href="/workspace">Open workspace <ArrowUpRight size={14} /></a>
          <button className="mobile-nav-button" type="button" aria-label="Toggle navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen((value) => !value)}><Menu size={22} /></button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-waves"><GradientWaves horizonColor="#7D3BE8" waveColor="#C6FF33" crestColor="#F4F1EB" speed={0.4} amplitude={2.5} waveScale={0.6} waveRatio={0.9} swell={35} turbulence={20} tilt={1.11} zoom={1} height={5.5} fogDepth={15} detail="medium" brightness={1} opacity={1} mouseInteraction parallaxStrength={0.5} grain grainIntensity={0.05} /></div>
          <div className="hero-shade" />
          <div className="container hero-inner">
            <div className="hero-copy">
              <div className="hero-kicker"><span className="status-dot" /><BlurText text="QUALITY ENGINEERING / INSTRUMENTED" delay={36} className="eyebrow" /></div>
              <h1 className="hero-title">Signals surface.<br /><em>The harness</em><br />decides.</h1>
              <p className="hero-lede">SentinelQA turns complex test signals into evidence you can inspect: validated schemas, reproducible runs, and failures with a trail.</p>
              <div className="hero-actions"><a className="primary-btn" href="/workspace">Open the workspace <ArrowDownRight size={15} /></a><a className="ghost-btn" href="#analysis-layer"><Play size={14} /> See the method</a></div>
              <div className="hero-note"><span className="mono">RUN / 04</span> deterministic by default · Ubuntu ready</div>
            </div>
            <div className="hero-orbit">
              <div className="cursor-stage"><img className="orbit-image" src={HERO_IMAGE} alt="Abstract black, violet, and lime quality signal" /><div className="orbit-overlay" /><div className="orbit-meta"><span>LIVE QUALITY SIGNAL</span><span>00:04:28</span></div><div className="orbit-core"><strong>87%</strong><span>application coverage</span></div></div>
            </div>
          </div>
          <div className="hero-scroll"><i />scroll to inspect</div>
        </section>

        <div className="quality-spine" aria-hidden="true"><span>QUALITY RUN</span><i /></div>

        <section className="evidence-bar" aria-label="Project evidence">
          <div className="container evidence-grid">
            <div className="evidence-item"><span className="evidence-value lime">{overview.isLoading ? "--" : String(overview.data?.runs ?? 0).padStart(2, "0")}</span><span className="evidence-label">runs recorded</span></div>
            <div className="evidence-item"><span className="evidence-value">{overview.isLoading ? "--" : String(overview.data?.scenarios ?? 0).padStart(2, "0")}</span><span className="evidence-label">scenarios tracked</span></div>
            <div className="evidence-item"><span className="evidence-value">{overview.isLoading ? "--" : String(overview.data?.findings ?? 0).padStart(2, "0")}</span><span className="evidence-label">findings observed</span></div>
            <div className="evidence-item"><span className="evidence-value">0</span><span className="evidence-label">live model calls in CI</span></div>
          </div>
        </section>

        <section className="section section-dark" id="coverage">
          <div className="container">
            <div className="section-heading"><div className="section-index">01 / Coverage</div><div><h2 className="section-title">Don’t ship a percentage.<br /><span>Ship a proof.</span></h2><p className="section-intro">Code coverage tells you where the runner went. Risk coverage tells you whether the behavior that matters is protected. SentinelQA keeps both in view.</p></div></div>
            <div className="coverage-layout">
              <div className="coverage-card"><div className="card-meta"><span>APPLICATION / CORE</span><span className="mono">PASS</span></div><div className="coverage-number">87<small>%</small></div><p className="coverage-caption">line coverage across the current application surface, with state transitions at 100%.</p></div>
              <div className="metric-rail">
                <div className="metric-row"><span className="metric-name">State machine rules</span><strong className="metric-number">05 / 05</strong><p>illegal transitions return a visible conflict and preserve state</p></div>
                <div className="metric-row"><span className="metric-name">Behavioral checks</span><strong className="metric-number">08</strong><p>unit, API, property, authorization, and validation cases</p></div>
                <div className="metric-row"><span className="metric-name">Provider mode</span><strong className="metric-number">MOCK</strong><p>repeatable evaluation without credentials or network drift</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-lift" id="method">
          <div className="container">
            <div className="section-heading"><div className="section-index">02 / Method</div><div><h2 className="section-title">From signal<br /><span>to proof.</span></h2><p className="section-intro">A test idea is only useful if its assertion is observable, its data is available, and the runner can reproduce it later.</p></div></div>
            <div className="expand-stage"><ScrollExpand src={SIGNAL_IMAGE} alt="Black calibration surface with violet test paths and lime verification beam" title="QUALITY ENGINEERING / INSTRUMENTED" scrollHint="continue" useWindowScroll mediaZoom={1.18}><h3>Make every assertion<br />earn its place.</h3><p>SentinelQA exposes the path from an input to an outcome—then keeps the trace when that outcome fails.</p></ScrollExpand></div>
          </div>
        </section>

        <section className="section section-dark" id="quality-run">
          <div className="container">
            <div className="section-heading"><div className="section-index">03 / Quality run</div><div><h2 className="section-title">The failure<br /><span>is the feature.</span></h2><p className="section-intro">Explore the defect matrix. Each case is a deliberately small break in the system, paired with the exact behavior that should catch it.</p></div></div>
            <div className="run-layout">
              <div><p className="run-statement">A reliable harness makes failure <strong>legible</strong>—with the rule, the oracle, and the next action visible in one place.</p><img className="triage-image" src={TRIAGE_IMAGE} alt="Abstract black corridor with violet channels and a lime signal path" /></div>
              <div className="run-list-wrap"><div className="run-list-header"><span>DEFECT MATRIX / 05 CASES</span><span>↑ ↓ TO INSPECT</span></div><AnimatedList items={defects.map((defect) => defect.name)} onItemSelect={(_, index) => setSelectedDefect(index)} showGradients enableArrowNavigation displayScrollbar /><div className="list-inspector" aria-live="polite"><p className="inspector-line"><span>selected</span><strong>{selected.rule} · {selected.tag}</strong></p><p className="inspector-line"><span>oracle</span>{selected.detail}</p></div></div>
            </div>
          </div>
        </section>

        <section className="analysis-section" id="analysis-layer">
          <div className="container analysis-layout">
            <div><div className="eyebrow">04 / Analysis layer</div><h2 className="analysis-title">The system can suggest.<br />It can’t approve.</h2><p className="analysis-copy">SentinelQA treats generated output as an untrusted proposal. Schema checks, duplicate detection, safety rules, and a human review boundary decide what moves forward.</p><a className="primary-btn" href="#footer">Read the constraints <ChevronRight size={15} /></a></div>
            <div className="analysis-terminal" role="img" aria-label="Example structured quality evaluation output"><div className="terminal-head"><span>sentinelqa / evaluator.py</span><span className="terminal-dots"><i /><i /><i /></span></div><div className="terminal-body"><div className="terminal-line"><span className="prompt">$</span><span>sentinelqa evaluate --provider mock</span></div><div className="terminal-line"><span className="comment">// inspect before execution</span></div><div className="terminal-separator" /><div className="terminal-line"><span className="value">schema_validity:</span><span>1.00</span></div><div className="terminal-line"><span className="value">requirement_coverage:</span><span>0.25</span></div><div className="terminal-line"><span className="value">acceptance_rate:</span><span>1.00</span></div><div className="terminal-success"><span><Check size={14} /> mock provider stable</span><span>HUMAN REVIEW</span></div></div></div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <div className="container"><div className="footer-top"><div><div className="eyebrow"><ShieldCheck size={13} style={{ verticalAlign: "-2px", marginRight: 8 }} /> quality, with receipts</div><h2 className="footer-title">Build faster.<br /><span className="mono" style={{ color: "var(--lime)", fontSize: ".55em", letterSpacing: ".02em" }}>verify harder.</span></h2></div><div className="footer-right"><p>SentinelQA is an applicant-built demonstration of assisted quality engineering: small surface area, explicit evidence, no invented claims.</p><a className="footer-case-link" href="/case-study">Open the full case study <ArrowUpRight size={13} /></a></div></div><div className="footer-bottom"><span>© 2026 SentinelQA</span><span><Sparkles size={11} style={{ verticalAlign: "-1px", marginRight: 6 }} /> Signals surface · the harness decides</span></div></div>
      </footer>
    </div>
  );
}
