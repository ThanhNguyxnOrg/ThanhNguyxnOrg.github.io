/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Menu,
  RefreshCw,
  X,
} from 'lucide-react';
import { ORG_METADATA, type OrgProject } from './data/orgData';
import {
  getInitialSyncState,
  performLiveOrgSync,
  type SyncTelemetryState,
} from './utils/liveSync';
import OrbitalScene3D from './components/OrbitalScene3D';
import FeaturedSection from './components/FeaturedSection';
import JourneyAndStackSection from './components/JourneyAndStackSection';
import ExplorerAndEcosystemSection from './components/ExplorerAndEcosystemSection';
import ProjectDossierModal from './components/ProjectDossierModal';

const MARQUEE_ITEMS = [
  'TypeScript & React 19',
  'Three.js GLSL Shaders & Spatial WebGL',
  'Claude Code & Blender MCP',
  'Rust & Tauri Systems',
  'C++23 & NASM SSE2 DSP',
  'Go WinTun Network Relays',
  'Python & Django Channels',
  'Zero-Touch GitHub & npm Auto-Sync (.yml)',
];

export default function App() {
  const [syncState, setSyncState] = useState<SyncTelemetryState>(() => getInitialSyncState());
  const [selected3DSlug, setSelected3DSlug] = useState<string>(
    () => getInitialSyncState().projects[0]?.slug ?? 'blendops',
  );
  const [dossierProject, setDossierProject] = useState<OrgProject | null>(null);
  const [archiveSearchQuery, setArchiveSearchQuery] = useState<string>('');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [copiedOrgUrl, setCopiedOrgUrl] = useState<boolean>(false);

  // Automatic Live Sync on initial mount + 5-minute interval + tab visibility focus
  useEffect(() => {
    let mounted = true;
    const runSync = async (force = false) => {
      if (!mounted) return;
      if (force) {
        setSyncState((prev) => ({ ...prev, status: 'syncing' }));
      }
      const next = await performLiveOrgSync(force);
      if (mounted) {
        setSyncState(next);
      }
    };

    runSync(false);
    const interval = window.setInterval(() => {
      runSync(true);
    }, 5 * 60 * 1000);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        runSync(false);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      mounted = false;
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const handleManualSync = async () => {
    setSyncState((prev) => ({ ...prev, status: 'syncing' }));
    const next = await performLiveOrgSync(true);
    setSyncState(next);
  };

  const activeProjects = syncState.projects;
  const selectedIndex = Math.max(
    0,
    activeProjects.findIndex((p) => p.slug === selected3DSlug),
  );
  const selected3DProject = activeProjects[selectedIndex] ?? activeProjects[0];

  const handleCycle3DNode = (dir: -1 | 1) => {
    const nextIdx = (selectedIndex + dir + activeProjects.length) % activeProjects.length;
    const nextProj = activeProjects[nextIdx];
    if (nextProj) {
      setSelected3DSlug(nextProj.slug);
    }
  };

  const handleFocusIn3D = (project: OrgProject) => {
    setSelected3DSlug(project.slug);
    const heroEl = document.getElementById('orbital-lab');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSelectLanguageFilter = (language: string) => {
    setArchiveSearchQuery(language);
    const archiveEl = document.getElementById('archive');
    if (archiveEl) {
      archiveEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyOrgUrl = async () => {
    try {
      await navigator.clipboard.writeText(ORG_METADATA.githubUrl);
    } catch {
      // Fallback
    }
    setCopiedOrgUrl(true);
    window.setTimeout(() => setCopiedOrgUrl(false), 2000);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#07090F] text-[#F4F5FA]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 border-b border-[#1E263B]/80 bg-[#07090F]/95">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:gap-8 sm:px-6 lg:px-10">
          {/* Zone 1: Single text element Brand Wordmark */}
          <a
            href="#top"
            className="font-display text-lg font-bold tracking-tight text-[#F4F5FA] whitespace-nowrap shrink-0"
          >
            ThanhNguyxnOrg
          </a>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden items-center gap-7 text-sm font-medium text-[#A3A9BF] md:flex"
          >
            <a
              href="#projects"
              className="transition-colors hover:text-[#F4F5FA] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Featured
            </a>
            <a
              href="#principles"
              className="transition-colors hover:text-[#F4F5FA] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Principles
            </a>
            <a
              href="#journey"
              className="transition-colors hover:text-[#F4F5FA] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Journey
            </a>
            <a
              href="#stack"
              className="transition-colors hover:text-[#F4F5FA] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Live Stack
            </a>
            <a
              href="#archive"
              className="transition-colors hover:text-[#F4F5FA] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Full Index
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action (+ Mobile Menu Button on small screens) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={ORG_METADATA.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B] px-4 py-2 text-xs font-semibold text-[#07090F] transition-all hover:bg-[#FCD34D] hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] whitespace-nowrap shrink-0"
            >
              Explore GitHub
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-expanded={mobileNavOpen}
              aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex size-9 items-center justify-center rounded-full border border-[#2D3854] bg-[#0D111C] text-[#F4F5FA] md:hidden"
            >
              {mobileNavOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Disclosure Menu */}
        {mobileNavOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="border-t border-[#1E263B] bg-[#0D111C] px-6 py-4 md:hidden"
          >
            <ul className="flex flex-col gap-3 text-sm font-medium text-[#C9CDE0]">
              {[
                { label: 'Featured', href: '#projects' },
                { label: 'Principles', href: '#principles' },
                { label: 'Journey', href: '#journey' },
                { label: 'Live Stack', href: '#stack' },
                { label: 'Full Index', href: '#archive' },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="block py-1.5 hover:text-[#FCD34D]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main id="top">
        {/* HERO SECTION: Split-Screen Editorial Typography + 3D Astrolabe Constellation */}
        <section className="relative overflow-hidden border-b border-[#1E263B]/80 pt-8 pb-14 sm:pt-12 md:pt-14 md:pb-20">
          {/* Ambient radial light aura behind hero */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/4 h-[520px] w-[720px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(56, 189, 248, 0.08) 55%, transparent 100%)',
            }}
          />

          <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
              {/* Left Column: Focused Editorial Typographic Hierarchy & Primary Actions */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="flex min-w-0 flex-col justify-center gap-6 lg:col-span-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <img
                      src="/logo.png"
                      alt="ThanhNguyxnOrg emblem"
                      width={40}
                      height={30}
                      className="h-7 w-auto shrink-0 rounded-md border border-[#2D3854]"
                    />
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-xs text-[#FCD34D]">
                      <span>INDEPENDENT PRACTICE</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#A3A9BF]">EST. {ORG_METADATA.foundedAt}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleManualSync}
                    title="Trigger live GitHub & npm sync"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#1E263B] bg-[#0D111C] px-2.5 py-1 font-mono text-[11px] text-[#34D399] transition-colors hover:border-[#F59E0B] hover:text-[#FCD34D] tabular-nums"
                  >
                    <RefreshCw
                      className={`size-3 ${syncState.status === 'syncing' ? 'animate-spin' : ''}`}
                      aria-hidden="true"
                    />
                    {syncState.status === 'live' ? 'LIVE SYNCED' : 'AUTO-SYNC ON'}
                  </button>
                </div>

                <h1 className="font-display text-[clamp(2.65rem,4.6vw,4.35rem)] font-extrabold leading-[0.95] tracking-tight text-[#F4F5FA]">
                  <span className="block">Build.</span>
                  <span className="block text-[#C9CDE0]">Explore.</span>
                  <span className="block bg-gradient-to-r from-[#FCD34D] via-[#F59E0B] to-[#38BDF8] bg-clip-text text-transparent">
                    Evolve.
                  </span>
                </h1>

                <p className="max-w-xl text-base leading-relaxed text-[#A3A9BF] sm:text-lg">
                  {ORG_METADATA.subtitle}
                </p>

                {/* Primary & Secondary Decision Actions + Compact 3D Node Stepper */}
                <div className="flex w-full flex-col items-stretch gap-3 pt-1 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                  <a
                    href="#projects"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F59E0B] px-6 py-3 text-sm font-semibold text-[#07090F] transition-all hover:bg-[#FCD34D] hover:shadow-[0_0_24px_rgba(245,158,11,0.4)] sm:w-auto whitespace-nowrap shrink-0"
                  >
                    Browse {syncState.totals.repos} Repositories
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>

                  <div className="inline-flex items-center justify-between gap-1 rounded-full border border-[#2D3854] bg-[#0D111C] p-1 sm:justify-start">
                    <button
                      type="button"
                      onClick={() => handleCycle3DNode(-1)}
                      aria-label="Previous 3D satellite node"
                      className="inline-flex size-8 items-center justify-center rounded-full text-[#C9CDE0] transition-colors hover:bg-[#141A29] hover:text-[#FCD34D]"
                    >
                      <ChevronLeft className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDossierProject(selected3DProject)}
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-[#F4F5FA] transition-colors hover:text-[#FCD34D] whitespace-nowrap shrink-0"
                    >
                      <Eye className="size-4 text-[#F59E0B]" aria-hidden="true" />
                      <span>Inspect {selected3DProject.name}</span>
                      <span className="font-mono text-[11px] text-[#868CA6] tabular-nums">
                        ({String(selectedIndex + 1).padStart(2, '0')}/{activeProjects.length})
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCycle3DNode(1)}
                      aria-label="Next 3D satellite node"
                      className="inline-flex size-8 items-center justify-center rounded-full text-[#C9CDE0] transition-colors hover:bg-[#141A29] hover:text-[#FCD34D]"
                    >
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Interactive Three.js 3D Astrolabe & Constellation Lab */}
              <motion.div
                id="orbital-lab"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="min-w-0 lg:col-span-7"
              >
                <OrbitalScene3D
                  projects={activeProjects}
                  selectedSlug={selected3DProject.slug}
                  onSelectProject={(proj) => setSelected3DSlug(proj.slug)}
                  onOpenDossier={(proj) => setDossierProject(proj)}
                />
              </motion.div>
            </div>

            {/* Full-Width 5-Column Live Verified Metrics Row Below the Hero Split */}
            <dl className="mt-10 grid grid-cols-2 gap-4 rounded-3xl border border-[#1E263B] bg-gradient-to-r from-[#0D111C] via-[#111726] to-[#0D111C] p-6 shadow-xl sm:grid-cols-3 lg:grid-cols-5">
              <div className="flex flex-col gap-1 border-r border-[#1E263B] pr-4 last:border-r-0">
                <dt className="font-mono text-xs text-[#868CA6]">Public Repositories</dt>
                <dd className="font-display text-3xl font-bold text-[#F4F5FA] tabular-nums">
                  {syncState.totals.repos}
                </dd>
                <dd className="font-mono text-[11px] text-[#FCD34D]">100% open source</dd>
              </div>

              <div className="flex flex-col gap-1 border-r border-[#1E263B] pr-4 last:border-r-0">
                <dt className="font-mono text-xs text-[#868CA6]">Verified GitHub Stars</dt>
                <dd className="font-display text-3xl font-bold text-[#F4F5FA] tabular-nums">
                  {syncState.totals.stars}
                </dd>
                <dd className="font-mono text-[11px] text-[#A3A9BF]">
                  {syncState.totals.forks} forks across org
                </dd>
              </div>

              <div className="flex flex-col gap-1 border-r border-[#1E263B] pr-4 last:border-r-0">
                <dt className="font-mono text-xs text-[#868CA6]">npm Downloads (30d)</dt>
                <dd className="font-display text-3xl font-bold text-[#F4F5FA] tabular-nums">
                  {syncState.totals.downloads30d}
                </dd>
                <dd className="font-mono text-[11px] text-[#FCD34D]">
                  {syncState.totals.packages} published packages
                </dd>
              </div>

              <div className="flex flex-col gap-1 border-r border-[#1E263B] pr-4 last:border-r-0">
                <dt className="font-mono text-xs text-[#868CA6]">Live Pages Demos</dt>
                <dd className="font-display text-3xl font-bold text-[#F4F5FA] tabular-nums">
                  {syncState.totals.demos}
                </dd>
                <dd className="font-mono text-[11px] text-[#A3A9BF]">Zero-config browser apps</dd>
              </div>

              <div className="flex flex-col gap-1">
                <dt className="font-mono text-xs text-[#868CA6]">Core Languages</dt>
                <dd className="font-display text-3xl font-bold text-[#F4F5FA] tabular-nums">
                  {syncState.totals.languages.length}
                </dd>
                <dd className="font-mono text-[11px] text-[#A3A9BF]">
                  TS · JS · Py · Rust · C++ · Go
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Subtle Editorial Marquee Divider */}
        <div
          aria-hidden="true"
          className="overflow-hidden border-b border-[#1E263B]/80 bg-[#0A0E18] py-3.5"
        >
          <div className="animate-marquee flex w-max items-center gap-10">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="font-mono text-xs text-[#868CA6] whitespace-nowrap">
                <span className="mr-3 text-[#F59E0B]">◆</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Releases Bento Grid */}
        <FeaturedSection
          projects={activeProjects}
          onInspectDossier={(proj) => setDossierProject(proj)}
          onFocusIn3D={handleFocusIn3D}
        />

        {/* Principles, Second Lives Timeline & Live Stack */}
        <JourneyAndStackSection
          projects={activeProjects}
          onInspectDossier={(proj) => setDossierProject(proj)}
          onFocusIn3D={handleFocusIn3D}
          onSelectLanguageFilter={handleSelectLanguageFilter}
        />

        {/* Full Scientific Repository Index & Auto-Synced Ecosystem */}
        <ExplorerAndEcosystemSection
          projects={activeProjects}
          resources={syncState.resources}
          syncState={syncState}
          onTriggerSync={handleManualSync}
          externalQuery={archiveSearchQuery}
          onExternalQueryChange={setArchiveSearchQuery}
          onInspectDossier={(proj) => setDossierProject(proj)}
          onFocusIn3D={handleFocusIn3D}
        />

        {/* Closing Conversion / Open Source Callout */}
        <section className="border-b border-[#1E263B]/80 py-20 md:py-24">
          <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-10">
            <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-[#2D3854] bg-gradient-to-r from-[#101625] via-[#0D111C] to-[#111726] p-8 shadow-2xl sm:p-12 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="font-mono text-xs text-[#FCD34D]">OPEN SOURCE WORKSPACE</p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F4F5FA] sm:text-4xl">
                  Use it. Fork it. Make it better.
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#A3A9BF]">
                  Personal engineering practice, best effort. Active repositories get priority
                  review; older experiments are preserved for transparency. Start with an issue on
                  GitHub.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href={ORG_METADATA.issuesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-6 py-3.5 text-sm font-semibold text-[#07090F] transition-all hover:bg-[#FCD34D] hover:shadow-[0_0_24px_rgba(245,158,11,0.35)] whitespace-nowrap shrink-0"
                >
                  Open an Issue
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
                <a
                  href={ORG_METADATA.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#2D3854] bg-[#141A29] px-5 py-3.5 text-sm font-medium text-[#F4F5FA] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
                >
                  Follow on GitHub
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-[#07090F] py-14">
        <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-10">
          <div className="grid gap-10 border-b border-[#1E263B] pb-12 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-5">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt=""
                  width={36}
                  height={27}
                  className="h-7 w-auto rounded-md"
                />
                <span className="font-display text-lg font-bold text-[#F4F5FA]">
                  ThanhNguyxnOrg
                </span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-[#A3A9BF]">
                Independent technology practice building developer tools, AI workflows, and open
                source utilities in the open.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyOrgUrl}
                  className="inline-flex items-center gap-2 rounded-full border border-[#2D3854] bg-[#0D111C] px-4 py-2 font-mono text-xs text-[#C9CDE0] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
                >
                  {copiedOrgUrl ? (
                    <>
                      <Check className="size-3.5 text-[#34D399]" aria-hidden="true" />
                      Copied github.com/ThanhNguyxnOrg
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                      Copy Organization URL
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs text-[#FCD34D]">Portal Sections</p>
                <ul className="flex flex-col gap-2 text-sm text-[#A3A9BF]">
                  <li>
                    <a href="#orbital-lab" className="hover:text-[#F4F5FA]">
                      3D Astrolabe Lab
                    </a>
                  </li>
                  <li>
                    <a href="#projects" className="hover:text-[#F4F5FA]">
                      Featured Releases
                    </a>
                  </li>
                  <li>
                    <a href="#journey" className="hover:text-[#F4F5FA]">
                      Second Lives Timeline
                    </a>
                  </li>
                  <li>
                    <a href="#archive" className="hover:text-[#F4F5FA]">
                      Scientific Index
                    </a>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs text-[#FCD34D]">Flagship Projects</p>
                <ul className="flex flex-col gap-2 text-sm text-[#A3A9BF]">
                  <li>
                    <a
                      href="https://github.com/ThanhNguyxnOrg/blendops"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F4F5FA]"
                    >
                      blendops
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/ThanhNguyxnOrg/lumeo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F4F5FA]"
                    >
                      lumeo
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/ThanhNguyxnOrg/apidex-hub"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F4F5FA]"
                    >
                      apidex-hub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/ThanhNguyxnOrg/SkillGauge"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F4F5FA]"
                    >
                      SkillGauge
                    </a>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs text-[#FCD34D]">Crew & Registry</p>
                <ul className="flex flex-col gap-2 text-sm text-[#A3A9BF]">
                  <li>
                    <a
                      href="https://github.com/RealThanhNguyxn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F4F5FA]"
                    >
                      RealThanhNguyxn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/ThanhNguyxn07"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F4F5FA]"
                    >
                      ThanhNguyxn07
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.npmjs.com/package/archpulse"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F4F5FA]"
                    >
                      npm: archpulse
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.npmjs.com/package/production-backend-kit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F4F5FA]"
                    >
                      npm: production-backend-kit
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-2 font-mono text-xs text-[#868CA6] sm:flex-row">
            <span>© {new Date().getFullYear()} ThanhNguyxnOrg · Open source under MIT License</span>
            <span>Crew: RealThanhNguyxn · ThanhNguyxn07 · ThanhNguyxnAgent</span>
          </div>
        </div>
      </footer>

      {/* Project Dossier Modal */}
      <ProjectDossierModal
        project={dossierProject}
        onClose={() => setDossierProject(null)}
        onFocusIn3D={handleFocusIn3D}
      />
    </div>
  );
}
