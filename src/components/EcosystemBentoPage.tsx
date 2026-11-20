import { lazy, Suspense, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  GitBranch,
  Layers,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import {
  MIGRATION_DOC,
  STACK_DOC,
  type EcoResource,
  type OrgProject,
} from '../data/orgData';
import { computeLanguageBreakdown } from '../utils/projectLogic';
import { WORKFLOW_YAML_SNIPPET, type SyncTelemetryState } from '../utils/liveSync';

const TelemetryCube3D = lazy(() => import('./TelemetryCube3D'));

interface EcosystemBentoPageProps {
  projects: OrgProject[];
  resources: EcoResource[];
  syncState: SyncTelemetryState;
  onTriggerSync: () => void;
  onSelectLanguageFilter: (language: string) => void;
  onBackToOverview: () => void;
  onOpenArchive: () => void;
}

function CubeViewportFallback() {
  return (
    <div className="flex h-[340px] w-full flex-col items-center justify-center rounded-xl border border-[#1E263B] bg-[#07090F] sm:h-[370px]">
      <Cpu className="size-7 text-[#F59E0B]" aria-hidden="true" />
      <p className="mt-2 font-mono text-xs text-[#A3A9BF]">Loading 3D Telemetry Core...</p>
    </div>
  );
}

export default function EcosystemBentoPage({
  projects,
  resources,
  syncState,
  onTriggerSync,
  onSelectLanguageFilter,
  onBackToOverview,
  onOpenArchive,
}: EcosystemBentoPageProps) {
  const [activeDocTab, setActiveDocTab] = useState<'stack' | 'migration'>('stack');
  const [copiedPkg, setCopiedPkg] = useState<string | null>(null);
  const [copiedYaml, setCopiedYaml] = useState<boolean>(false);

  const languageStats = computeLanguageBreakdown(projects);

  const handleCopyCommand = async (pkgName: string) => {
    try {
      await navigator.clipboard.writeText(`npm i ${pkgName}`);
    } catch {
      // Fallback
    }
    setCopiedPkg(pkgName);
    window.setTimeout(() => {
      setCopiedPkg((curr) => (curr === pkgName ? null : curr));
    }, 2000);
  };

  const handleCopyWorkflowYaml = async () => {
    try {
      await navigator.clipboard.writeText(WORKFLOW_YAML_SNIPPET);
    } catch {
      // Fallback
    }
    setCopiedYaml(true);
    window.setTimeout(() => setCopiedYaml(false), 2000);
  };

  const statusLabel =
    syncState.status === 'syncing'
      ? 'Syncing APIs'
      : syncState.status === 'live'
        ? 'Live API Synced'
        : syncState.status === 'cached'
          ? 'Live Cache Active'
          : 'CI Snapshot Active';

  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-bento-heading"
      className="border-b border-[#1E263B]/80 bg-[#07090F] pb-20"
    >
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-[#1E263B]/80 bg-[#07090F] py-4">
        <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={onBackToOverview}
            className="inline-flex items-center gap-2 rounded-lg border border-[#2D3854] bg-[#0D111C] px-3.5 py-1.5 font-mono text-xs font-medium text-[#C9CDE0] transition-colors hover:border-[#F59E0B] hover:text-[#FCD34D] whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
            Back to Overview
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-[#868CA6]">
              Stack, npm Registry &amp; Auto-Sync
            </span>
            <button
              type="button"
              onClick={onOpenArchive}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2D3854] bg-[#0D111C] px-3 py-1.5 font-mono text-xs text-[#FCD34D] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
            >
              Open Archive
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        {/* Subtle Architectural Blueprint Grid Underlay (matches Overview hero DNA) */}
        <div
          aria-hidden="true"
          className="bg-blueprint-grid pointer-events-none absolute inset-x-0 top-0 h-[320px] opacity-40"
          style={{
            maskImage: 'radial-gradient(ellipse 70% 80% at 28% 20%, black 15%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 80% at 28% 20%, black 15%, transparent 80%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 left-1/4 h-[320px] w-[540px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(245, 158, 11, 0.28) 0%, rgba(56, 189, 248, 0.1) 55%, transparent 100%)',
          }}
        />
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 pt-10 sm:px-6 md:pt-14 lg:px-10">
        {/* Asymmetric Hero Header (matching obsidian hairline developer reference) */}
        <div className="flex flex-col justify-between gap-6 pb-10 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h1
              id="ecosystem-bento-heading"
              className="font-display text-[clamp(2rem,3.6vw,3.15rem)] font-bold leading-[1.08] tracking-tight text-[#F4F5FA] [text-wrap:balance]"
            >
              <span className="font-normal text-[#C9CDE0]">Live stack &amp; </span>
              <span>telemetry</span>
              <span className="block">for every repository.</span>
            </h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-[#868CA6]">
              <span className="text-[#34D399]">{statusLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#C9CDE0]">{syncState.sourceLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{syncState.lastSyncedAt}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onTriggerSync}
              disabled={syncState.status === 'syncing'}
              className="inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-5 py-2.5 text-sm font-semibold text-[#07090F] transition-colors hover:bg-[#FCD34D] disabled:opacity-60 whitespace-nowrap shrink-0"
            >
              <RefreshCw
                className={`size-4 ${syncState.status === 'syncing' ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              {syncState.status === 'syncing' ? 'Syncing APIs...' : 'Sync Live Telemetry'}
            </button>
          </div>
        </div>

        {/* Row 1: Interactive 3D Telemetry Cube + Live Sync Terminal */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Bento Card 1: 3D Telemetry Server Core (from user's 3D concept) */}
          <article className="surface-hairline flex min-w-0 flex-col justify-between rounded-2xl border border-[#1E263B] p-5 sm:p-6 lg:col-span-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-[#F59E0B]" aria-hidden="true" />
                <h2 className="font-display text-base font-semibold text-[#F4F5FA]">
                  Telemetry Core Unit
                </h2>
              </div>
              <span className="font-mono text-xs text-[#34D399]">{statusLabel}</span>
            </div>

            <Suspense fallback={<CubeViewportFallback />}>
              <TelemetryCube3D
                syncStatus={syncState.status}
                repoCount={syncState.totals.repos}
                packageCount={syncState.totals.packages}
              />
            </Suspense>

            <dl className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#1E263B] pt-4 font-mono text-xs">
              <div className="flex items-baseline gap-2">
                <dt className="text-[#868CA6]">Indexed:</dt>
                <dd className="font-semibold text-[#F4F5FA] tabular-nums">
                  {syncState.totals.repos} repos · {syncState.totals.stars} stars
                </dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="text-[#868CA6]">npm 30d:</dt>
                <dd className="font-semibold text-[#FCD34D] tabular-nums">
                  {syncState.totals.downloads30d} downloads
                </dd>
              </div>
            </dl>
          </article>

          {/* Bento Card 2: Auto-Sync Pipeline Terminal */}
          <article className="surface-hairline flex min-w-0 flex-col justify-between rounded-2xl border border-[#1E263B] p-5 sm:p-6 lg:col-span-6">
            <div>
              <div className="flex items-center justify-between gap-3 border-b border-[#1E263B] pb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="size-4 text-[#F59E0B]" aria-hidden="true" />
                  <h2 className="font-display text-base font-semibold text-[#F4F5FA]">
                    Auto-Sync Pipeline
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleCopyWorkflowYaml}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#2D3854] bg-[#141A29] px-3 py-1 font-mono text-xs text-[#F4F5FA] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
                >
                  {copiedYaml ? (
                    <>
                      <Check className="size-3.5 text-[#34D399]" aria-hidden="true" />
                      Copied .yml
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                      Copy Workflow
                    </>
                  )}
                </button>
              </div>

              {/* Crisp Monospace Pipeline Output */}
              <div className="mt-4 font-mono text-xs">
                <p className="text-[#868CA6]">
                  <span className="text-[#F59E0B]">$</span> npm run sync --org ThanhNguyxnOrg
                </p>
                <ul className="mt-3 divide-y divide-[#1E263B]/80">
                  {syncState.checks.map((chk) => (
                    <li
                      key={chk.id}
                      className="flex items-start justify-between gap-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#F4F5FA]">{chk.name}</p>
                        <p className="mt-0.5 truncate text-[11px] text-[#868CA6]">
                          {chk.endpoint}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#A3A9BF]">{chk.detail}</p>
                      </div>
                      <span className="shrink-0 font-mono text-[11px] font-semibold text-[#34D399]">
                        OK
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <details className="group mt-3 border-t border-[#1E263B] pt-3">
                <summary className="flex cursor-pointer select-none items-center gap-2 font-mono text-xs font-medium text-[#C9CDE0] transition-colors hover:text-[#FCD34D]">
                  <Code2 className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                  <span>Inspect .github/workflows/sync-org-data.yml</span>
                </summary>
                <pre className="obsidian-scroll mt-3 max-h-44 overflow-auto rounded-lg border border-[#1E263B] bg-[#07090F] p-3 font-mono text-[11px] leading-relaxed text-[#C9CDE0]">
                  <code>{WORKFLOW_YAML_SNIPPET}</code>
                </pre>
              </details>
            </div>

            {/* Bottom Prompt Strip (inspired by amber command bar in reference) */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#1E263B] pt-4 font-mono text-xs">
              <button
                type="button"
                onClick={onTriggerSync}
                disabled={syncState.status === 'syncing'}
                className="inline-flex items-center gap-2 rounded-md bg-[#F59E0B] px-3 py-1.5 font-semibold text-[#07090F] transition-colors hover:bg-[#FCD34D] disabled:opacity-60 whitespace-nowrap shrink-0"
              >
                <span>sync-org-data --live</span>
              </button>
              <span className="text-[#868CA6] tabular-nums">
                {syncState.latencyMs !== null
                  ? `Last fetch: ${syncState.latencyMs}ms`
                  : 'Scheduled every 6h via GitHub Actions'}
              </span>
            </div>
          </article>
        </div>

        {/* Row 2: Live Language Distribution + Architecture & Migration Monograph */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Bento Card 3: Interactive Language Breakdown */}
          <article className="surface-hairline flex min-w-0 flex-col justify-between rounded-2xl border border-[#1E263B] p-5 sm:p-6 lg:col-span-6">
            <div>
              <div className="flex items-center justify-between gap-3 border-b border-[#1E263B] pb-4">
                <div className="flex items-center gap-2">
                  <Layers className="size-4 text-[#F59E0B]" aria-hidden="true" />
                  <h2 className="font-display text-base font-semibold text-[#F4F5FA]">
                    Language Distribution
                  </h2>
                </div>
                <span className="font-mono text-xs text-[#868CA6] tabular-nums">
                  {languageStats.length} languages · {projects.length} repos
                </span>
              </div>

              <ul
                className="mt-4 flex flex-col gap-2.5"
                aria-label="Languages by repository count"
              >
                {languageStats.map((stat) => (
                  <li key={stat.language}>
                    <button
                      type="button"
                      onClick={() => onSelectLanguageFilter(stat.language)}
                      className="group flex w-full flex-col gap-1.5 rounded-lg p-1.5 text-left transition-colors hover:bg-[#141A29]"
                    >
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="font-medium text-[#F4F5FA] group-hover:text-[#FCD34D]">
                          {stat.language}
                        </span>
                        <span className="text-[#A3A9BF] tabular-nums">
                          {stat.count} {stat.count === 1 ? 'repo' : 'repos'}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#141A29]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${stat.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#38BDF8]"
                        />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 border-t border-[#1E263B] pt-4 font-mono text-xs text-[#868CA6]">
              Select any language bar to jump into the Archive filtered by that stack.
            </div>
          </article>

          {/* Bento Card 4: Architecture & Migration Monograph */}
          <article className="surface-hairline flex min-w-0 flex-col justify-between rounded-2xl border border-[#1E263B] p-5 sm:p-6 lg:col-span-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E263B] pb-4">
                <div className="flex items-center gap-2">
                  <GitBranch className="size-4 text-[#F59E0B]" aria-hidden="true" />
                  <h2 className="font-display text-base font-semibold text-[#F4F5FA]">
                    Architecture &amp; Migration
                  </h2>
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-[#1E263B] bg-[#07090F] p-0.5">
                  <button
                    type="button"
                    onClick={() => setActiveDocTab('stack')}
                    className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors whitespace-nowrap shrink-0 ${
                      activeDocTab === 'stack'
                        ? 'bg-[#1E263B] font-semibold text-[#FCD34D]'
                        : 'text-[#868CA6] hover:text-[#F4F5FA]'
                    }`}
                  >
                    Live Stack
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDocTab('migration')}
                    className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors whitespace-nowrap shrink-0 ${
                      activeDocTab === 'migration'
                        ? 'bg-[#1E263B] font-semibold text-[#FCD34D]'
                        : 'text-[#868CA6] hover:text-[#F4F5FA]'
                    }`}
                  >
                    Migration Note
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <AnimatePresence mode="wait">
                  {activeDocTab === 'stack' ? (
                    <motion.div
                      key="bento-stack"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                      className="flex flex-col gap-5"
                    >
                      <div>
                        <p className="font-mono text-xs text-[#FCD34D]">{STACK_DOC.origin}</p>
                        <h3 className="mt-1 font-display text-xl font-bold text-[#F4F5FA]">
                          {STACK_DOC.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#A3A9BF]">
                          {STACK_DOC.lead}
                        </p>
                      </div>

                      <div className="grid gap-4 border-t border-[#1E263B] pt-4 sm:grid-cols-2">
                        {STACK_DOC.layers.map((layer, idx) => (
                          <div key={layer.name} className="flex flex-col gap-1">
                            <p className="font-mono text-xs font-medium text-[#F59E0B]">
                              0{idx + 1}. {layer.name}
                            </p>
                            <p className="text-xs leading-relaxed text-[#C9CDE0]">
                              {layer.detail}
                            </p>
                          </div>
                        ))}
                      </div>

                      <blockquote className="border-t border-[#1E263B] pt-4 font-display text-sm font-semibold text-[#F4F5FA]">
                        “{STACK_DOC.mindset}”
                      </blockquote>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="bento-migration"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                      className="flex flex-col gap-5"
                    >
                      <div>
                        <p className="font-mono text-xs text-[#FCD34D]">
                          {MIGRATION_DOC.origin}
                        </p>
                        <h3 className="mt-1 font-display text-xl font-bold text-[#F4F5FA]">
                          {MIGRATION_DOC.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#A3A9BF]">
                          {MIGRATION_DOC.lead}
                        </p>
                      </div>

                      <div className="grid gap-4 border-t border-[#1E263B] pt-4 sm:grid-cols-2">
                        <div>
                          <p className="font-mono text-xs font-medium text-[#F59E0B]">
                            01. Why Migration Matters
                          </p>
                          <ul className="mt-2 flex flex-col gap-1.5 text-xs text-[#C9CDE0]">
                            {MIGRATION_DOC.whyMatters.map((w) => (
                              <li key={w}>· {w}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-mono text-xs font-medium text-[#F59E0B]">
                            02. Forms of Rebuild
                          </p>
                          <ul className="mt-2 flex flex-col gap-1.5 text-xs text-[#C9CDE0]">
                            {MIGRATION_DOC.forms.map((f) => (
                              <li key={f}>· {f}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <blockquote className="border-t border-[#1E263B] pt-4 font-display text-sm font-semibold text-[#F4F5FA]">
                        “{MIGRATION_DOC.closing}”
                      </blockquote>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#1E263B] pt-4 font-mono text-xs">
              <span className="text-[#868CA6]">Source: ThanhNguyxnOrg/.github</span>
              <a
                href="https://github.com/ThanhNguyxnOrg/.github"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#FCD34D] hover:underline whitespace-nowrap"
              >
                Read Org Docs
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>

        {/* Row 3: Full-Width Registry, Bots & Crew Ledger Table (matching Audit Logs table in reference) */}
        <article className="surface-hairline cad-frame mt-6 overflow-hidden rounded-2xl border border-[#1E263B]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E263B] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <Download className="size-4 text-[#F59E0B]" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold text-[#F4F5FA]">
                Published Registry, Automation &amp; Crew Ledger
              </h2>
            </div>
            <span className="font-mono text-xs text-[#868CA6] tabular-nums">
              {syncState.totals.packages} npm packages · {resources.length} verified entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#1E263B] bg-[#090D16] font-mono text-[11px] text-[#868CA6]">
                  <th scope="col" className="px-5 py-3 font-medium sm:px-6">
                    Entity
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Kind
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Telemetry / Role
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium sm:px-6">
                    Install &amp; Link
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E263B]/80 text-xs">
                {resources.map((res) => (
                  <tr
                    key={res.label}
                    className="transition-colors hover:bg-[#141A29]/55"
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <p className="font-display text-sm font-semibold text-[#F4F5FA]">
                        {res.label}
                      </p>
                      <p className="mt-0.5 max-w-md text-xs text-[#A3A9BF]">
                        {res.description}
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top font-mono text-[#FCD34D] whitespace-nowrap">
                      {res.kind}
                    </td>
                    <td className="px-4 py-4 align-top font-mono text-[#C9CDE0] tabular-nums whitespace-nowrap">
                      {res.version ? (
                        <span>
                          {res.version}
                          {typeof res.downloads === 'number'
                            ? ` · ${res.downloads} / 30d`
                            : ''}
                        </span>
                      ) : (
                        <span className="text-[#868CA6]">Verified org entry</span>
                      )}
                    </td>
                    <td className="px-5 py-4 align-top sm:px-6">
                      <div className="flex items-center justify-end gap-2">
                        {res.packageName && (
                          <button
                            type="button"
                            onClick={() => handleCopyCommand(res.packageName!)}
                            aria-label={`Copy install command for ${res.packageName}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#2D3854] bg-[#07090F] px-2.5 py-1.5 font-mono text-[11px] text-[#FCD34D] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
                          >
                            {copiedPkg === res.packageName ? (
                              <>
                                <Check className="size-3 text-[#34D399]" aria-hidden="true" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="size-3" aria-hidden="true" />
                                npm i {res.packageName}
                              </>
                            )}
                          </button>
                        )}
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-[#2D3854] bg-[#141A29] px-3 py-1.5 font-mono text-[11px] font-medium text-[#F4F5FA] transition-colors hover:border-[#F59E0B] hover:text-[#FCD34D] whitespace-nowrap shrink-0"
                        >
                          Open
                          <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
      </div>
    </section>
  );
}
