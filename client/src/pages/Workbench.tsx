import { useMemo, useState } from "react";
import { Activity, ArrowLeft, CheckCircle2, LogIn, Pencil, Play, Plus, ShieldAlert, Trash2, XCircle } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

const blankStep: { name: string; method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; path: string; expectedStatus: number; requestBody: string; assertion: string } = { name: "Create order", method: "POST", path: "/orders", expectedStatus: 201, requestBody: "{ \"quantity\": 1 }", assertion: "Response returns a persisted order id" };

export default function Workbench() {
  const { user, loading: authLoading, error: authError, isAuthenticated, logout } = useAuth();
  const utils = trpc.useUtils();
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingScenarioId, setEditingScenarioId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [name, setName] = useState("Order lifecycle smoke test");
  const [description, setDescription] = useState("A repeatable baseline for checking an order through a valid state transition.");
  const [step, setStep] = useState(blankStep);
  const [assertionId, setAssertionId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [draftValidation, setDraftValidation] = useState<{ valid: boolean; issues: string[]; previewStatus: number } | null>(null);

  const assertionsQuery = trpc.workspace.listAssertions.useQuery(undefined, { enabled: isAuthenticated });
  const scenariosQuery = trpc.workspace.listScenarios.useQuery(undefined, { enabled: isAuthenticated });
  const runsQuery = trpc.workspace.listRuns.useQuery(undefined, { enabled: isAuthenticated });
  const runQuery = trpc.workspace.getRun.useQuery({ runId: selectedRunId ?? 0 }, { enabled: Boolean(selectedRunId) && isAuthenticated });
  const createScenario = trpc.workspace.createScenario.useMutation({ onSuccess: async () => { setShowCreate(false); setEditingScenarioId(null); setSuccessMessage("Scenario saved. Select it from the library to run it."); await utils.workspace.listScenarios.invalidate(); } });
  const updateScenario = trpc.workspace.updateScenario.useMutation({ onSuccess: async () => { setShowCreate(false); setEditingScenarioId(null); setSuccessMessage("Scenario updated."); await utils.workspace.listScenarios.invalidate(); } });
  const validateDraftMutation = trpc.workspace.validateDraft.useMutation({ onSuccess: setDraftValidation });
  const deleteScenario = trpc.workspace.deleteScenario.useMutation({ onSuccess: async () => { setSelectedScenarioId(null); setSuccessMessage("Scenario deleted."); await Promise.all([utils.workspace.listScenarios.invalidate(), utils.workspace.listRuns.invalidate()]); } });
  const runScenario = trpc.workspace.runScenario.useMutation({ onSuccess: async (result) => { setSelectedRunId(result.runId); setSuccessMessage(`Run #${result.runId.toString().padStart(4, "0")} completed: ${result.status}.`); await utils.workspace.listRuns.invalidate(); await utils.workspace.getRun.invalidate({ runId: result.runId }); } });

  const scenarios = scenariosQuery.data ?? [];
  const runs = runsQuery.data ?? [];
  const selectedScenario = useMemo(() => scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? scenarios[0], [scenarios, selectedScenarioId]);
  const latestRun = runs[0];

  const openEditor = (scenario: (typeof scenarios)[number]) => {
    const firstStep = scenario.steps[0];
    setEditingScenarioId(scenario.id);
    setName(scenario.name);
    setDescription(scenario.description);
    if (firstStep) {
      setStep({ name: firstStep.name, method: firstStep.method, path: firstStep.path, expectedStatus: firstStep.expectedStatus, requestBody: firstStep.requestBody ?? "", assertion: firstStep.assertion });
      setAssertionId(firstStep.assertionId ?? null);
    }
    setDraftValidation(null);
    setShowCreate(true);
  };

  const submitScenario = () => {
    if (editingScenarioId) updateScenario.mutate({ id: editingScenarioId, name, description, assertionId: assertionId ?? undefined, steps: [step] });
    else createScenario.mutate({ name, description, assertionId: assertionId ?? undefined, steps: [step] });
  };

  if (authLoading) {
    return <div className="workspace-gate"><div className="gate-card"><div className="eyebrow"><Activity size={14} /> CHECKING SESSION</div><h1>Preparing the<br /><em>workspace.</em></h1><p>Loading your secure quality workspace.</p></div></div>;
  }

  if (!isAuthenticated) {
    return <div className="workspace-gate"><div className="gate-card"><div className="eyebrow"><ShieldAlert size={14} /> PRIVATE WORKSPACE</div><h1>Run the checks.<br /><em>Keep the evidence.</em></h1><p>Sign in to create test scenarios, execute the deterministic runner, and keep a history of every finding.</p><button className="primary-btn" type="button" onClick={() => startLogin()}><LogIn size={15} /> Sign in to continue</button><Link className="ghost-btn" href="/"><ArrowLeft size={14} /> Back to overview</Link></div></div>;
  }

  return (
    <div className="workspace-page">
      <header className="workspace-header"><div className="container workspace-nav"><Link className="brand" href="/"><span className="brand-mark text-mark">S</span><span className="brand-wordmark">sentinel<span>qa</span></span></Link><div className="workspace-user"><span>{user?.name ?? user?.email ?? "Workspace user"}</span><button type="button" onClick={() => logout()}>Log out</button></div></div></header>
      <main className="container workspace-main">
        {authError && <p className="error-state workspace-alert">{authError.message}</p>}
        {successMessage && <p className="success-state workspace-alert">{successMessage}</p>}
        {scenariosQuery.error && <p className="error-state workspace-alert">Scenario library could not load: {scenariosQuery.error.message}</p>}
        {runsQuery.error && <p className="error-state workspace-alert">Run history could not load: {runsQuery.error.message}</p>}
        {assertionsQuery.error && <p className="error-state workspace-alert">Assertion catalog could not load: {assertionsQuery.error.message}</p>}
        {deleteScenario.error && <p className="error-state workspace-alert">Scenario could not be deleted: {deleteScenario.error.message}</p>}
        <div className="workspace-intro"><div><div className="eyebrow"><Activity size={14} /> LIVE WORKSPACE</div><h1>Build a check.<br /><em>Run the proof.</em></h1><p>Create small, observable scenarios against the order domain. The runner evaluates each step, saves the result, and keeps the failure trail available for review.</p></div><button className="primary-btn" type="button" onClick={() => setShowCreate(true)}><Plus size={15} /> New scenario</button></div>
        <div className="workspace-grid">
          <section className="workspace-panel scenario-panel"><div className="panel-heading"><div><span className="panel-kicker">SCENARIO LIBRARY</span><h2>Your checks</h2></div><span className="count-badge">{scenarios.length.toString().padStart(2, "0")}</span></div>{scenariosQuery.isLoading ? <p className="empty-state">Loading scenarios…</p> : scenarios.length === 0 ? <div className="empty-state"><p>No scenarios yet.</p><button className="ghost-btn" type="button" onClick={() => setShowCreate(true)}>Create your first check <Plus size={14} /></button></div> : <div className="scenario-list">{scenarios.map((scenario) => <div className="scenario-row-wrap" key={scenario.id}><button className={`scenario-row ${selectedScenario?.id === scenario.id ? "is-selected" : ""}`} type="button" onClick={() => setSelectedScenarioId(scenario.id)}><span><strong>{scenario.name}</strong><small>{scenario.steps.length} step{scenario.steps.length === 1 ? "" : "s"} · {scenario.description}</small></span><Play size={14} /></button><button className="edit-button" type="button" aria-label={`Edit ${scenario.name}`} onClick={() => openEditor(scenario)}><Pencil size={14} /></button>{confirmDeleteId === scenario.id ? <button className="delete-button confirm" type="button" aria-label={`Confirm delete ${scenario.name}`} onClick={() => { deleteScenario.mutate({ id: scenario.id }); setConfirmDeleteId(null); }}>Confirm</button> : <button className="delete-button" type="button" aria-label={`Delete ${scenario.name}`} onClick={() => setConfirmDeleteId(scenario.id)}><Trash2 size={14} /></button>}</div>)}</div>}</section>
          <section className="workspace-panel run-panel"><div className="panel-heading"><div><span className="panel-kicker">EXECUTION CONSOLE</span><h2>{selectedScenario?.name ?? "Select a scenario"}</h2></div>{selectedScenario && <button className="run-button" type="button" disabled={runScenario.isPending} onClick={() => runScenario.mutate({ scenarioId: selectedScenario.id })}><Play size={14} /> {runScenario.isPending ? "Running…" : "Run now"}</button>}</div>{selectedScenario ? <div className="step-stack">{selectedScenario.steps.map((item, index) => <div className="step-card" key={item.id}><span className="step-index">0{index + 1}</span><div><div className="step-topline"><strong>{item.name}</strong><span className="method-pill">{item.method}</span></div><code>{item.path}</code><p>{item.assertion}</p></div></div>)}</div> : <p className="empty-state">Select a scenario from the library to inspect its steps.</p>}{runScenario.error && <p className="error-state">{runScenario.error.message}</p>}</section>
          <section className="workspace-panel history-panel"><div className="panel-heading"><div><span className="panel-kicker">RUN HISTORY</span><h2>Recent evidence</h2></div><span className="count-badge">{runs.length.toString().padStart(2, "0")}</span></div>{runsQuery.isLoading ? <p className="empty-state">Loading run history…</p> : runsQuery.error ? <p className="error-state empty-state">Run history could not load: {runsQuery.error.message}</p> : runs.length === 0 ? <p className="empty-state">Run a scenario to create your first evidence record.</p> : <div className="run-list">{runs.map((run) => <button className={`run-row ${selectedRunId === run.id ? "is-selected" : ""}`} key={run.id} type="button" onClick={() => setSelectedRunId(run.id)}><span className={`run-status ${run.status}`} aria-hidden="true">{run.status === "passed" ? <CheckCircle2 size={16} /> : run.status === "blocked" ? <ShieldAlert size={16} /> : <XCircle size={16} />}</span><span><strong>Run #{run.id.toString().padStart(4, "0")}</strong><small>{run.summary}</small></span><time>{new Date(run.finishedAt).toLocaleString()}</time></button>)}</div>}</section>
          <section className="workspace-panel findings-panel"><div className="panel-heading"><div><span className="panel-kicker">INSPECTION TRAIL</span><h2>{runQuery.data ? `Run #${runQuery.data.id.toString().padStart(4, "0")}` : "Choose a run"}</h2></div>{runQuery.data && <span className={`status-label ${runQuery.data.status}`}>{runQuery.data.status}</span>}</div>{runQuery.isLoading ? <p className="empty-state">Loading inspection trail…</p> : runQuery.error ? <p className="error-state empty-state">Finding details could not load: {runQuery.error.message}</p> : runQuery.data ? <div className="finding-list">{runQuery.data.findings.map((finding) => <article className="finding-card" key={finding.id}><div className="finding-header"><span className={`severity ${finding.severity}`}>{finding.severity}</span><strong>{finding.title}</strong></div><div className="finding-columns"><div><span>Expected</span><p>{finding.expected}</p></div><div><span>Observed</span><p>{finding.actual}</p></div><div><span>Next action</span><p>{finding.recommendation}</p></div></div></article>)}</div> : <p className="empty-state">Select a completed run to inspect expected behavior, observed output, and the next action.</p>}</section>
        </div>
      </main>
      {showCreate && <div className="modal-backdrop" role="presentation"><div className="scenario-modal" role="dialog" aria-modal="true" aria-labelledby="scenario-title"><div className="modal-header"><div><span className="panel-kicker">{editingScenarioId ? "EDIT SCENARIO" : "NEW SCENARIO"}</span><h2 id="scenario-title">{editingScenarioId ? "Refine the check" : "Define the check"}</h2></div><button className="icon-button" type="button" aria-label="Close" onClick={() => setShowCreate(false)}>×</button></div><label>Scenario name<input value={name} onChange={(event) => setName(event.target.value)} /></label><label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label><div className="modal-step-heading"><span className="panel-kicker">FIRST STEP</span><span>One observable action to start</span></div><label>Step name<input value={step.name} onChange={(event) => setStep({ ...step, name: event.target.value })} /></label><label>Assertion definition<select value={assertionId ?? "new"} onChange={(event) => { const value = event.target.value; const nextId = value === "new" ? null : Number(value); setAssertionId(nextId); const selected = assertionsQuery.data?.find((item) => item.id === nextId); if (selected) setStep({ ...step, assertion: selected.expression }); }}><option value="new">Create a new definition</option>{(assertionsQuery.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><div className="form-grid"><label>Method<select value={step.method} onChange={(event) => setStep({ ...step, method: event.target.value as typeof step.method })}><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option></select></label><label>Expected status<input type="number" value={step.expectedStatus} onChange={(event) => setStep({ ...step, expectedStatus: Number(event.target.value) })} /></label></div><label>Path<input value={step.path} onChange={(event) => setStep({ ...step, path: event.target.value })} /></label><label>Assertion<input value={step.assertion} onChange={(event) => { setAssertionId(null); setStep({ ...step, assertion: event.target.value }); }} /></label><button className="ghost-btn modal-submit" type="button" disabled={validateDraftMutation.isPending} onClick={() => validateDraftMutation.mutate(step)}>{validateDraftMutation.isPending ? "Checking…" : "Validate draft"}</button>{draftValidation && <div className={`draft-validation ${draftValidation.valid ? "valid" : "invalid"}`}>{draftValidation.valid ? `Draft is executable. Preview response: HTTP ${draftValidation.previewStatus}.` : draftValidation.issues.join(" ")}</div>}<button className="primary-btn modal-submit" type="button" disabled={createScenario.isPending || updateScenario.isPending} onClick={submitScenario}>{createScenario.isPending || updateScenario.isPending ? "Saving…" : editingScenarioId ? "Save changes" : "Save scenario"}</button>{(createScenario.error || updateScenario.error) && <p className="error-state">{createScenario.error?.message ?? updateScenario.error?.message}</p>}</div></div>}
    </div>
  );
}
