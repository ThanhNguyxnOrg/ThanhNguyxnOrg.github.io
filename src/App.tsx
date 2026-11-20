/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Copy,
  Database,
  ExternalLink,
  Eye,
  Layers,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { computeLanguageBreakdown } from './utils/projectLogic';
import { ORG_METADATA, type OrgProject } from './data/orgData';
import {
  getInitialSyncState,
  performLiveOrgSync,
  type SyncTelemetryState,
} from './utils/liveSync';
import FeaturedSection from './components/FeaturedSection';
import JourneyAndStackSection from './components/JourneyAndStackSection';
import ExplorerAndEcosystemSection from './components/ExplorerAndEcosystemSection';
import ProjectDossierModal from './components/ProjectDossierModal';
import CommandPaletteModal from './components/CommandPaletteModal';
import EcosystemBentoPage from './components/EcosystemBentoPage';
import { InteractiveCard3D } from './components/InteractiveCard3D';
import {
  ArchiveMatrixPreview,
  ClosingOrbitalBackdrop,
  DotMatrixBackdrop,
  HeroAmbientBackdrop,
  LanguageSpectrumPreview,
  SectionSeam,
  SpotlightSurface,
} from './components/ArchitecturalDecor';

const LANG_SHORT_MAP: Record<string, string> = {
  TypeScript: 'TS',
  JavaScript: 'JS',
  Python: 'Py',
  PowerShell: 'PS',
  'C++': 'C++',
  Rust: 'Rust',
  Go: 'Go',
  Vue: 'Vue',
  Svelte: 'Svelte',
  Shell: 'Sh',
};

function formatTopLanguageCodes(
  stats: ReturnType<typeof computeLanguageBreakdown>,
  limit = 6,
): string {
  return stats
    .slice(0, limit)
    .map((item) => LANG_SHORT_MAP[item.language] ?? item.language)
    .join(' · ');
}

const OrbitalScene3D = lazy(() => import('./components/OrbitalScene3D'));

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

function OrbitalViewportFallback() {
  return (
    <div className="flex h-[410px] w-full flex-col items-center justify-center rounded-2xl border border-[#1E263B] bg-[#07090F] bg-blueprint-grid sm:h-[480px] lg:h-[552px]">
      <Compass className="size-8 animate-spin text-[#F59E0B]" aria-hidden="true" />
      <p className="mt-3 font-mono text-xs text-[#A3A9BF]">Initializing 3D Astrolabe...</p>
    </div>
  );
}

type ActivePage = 'overview' | 'archive' | 'ecosystem';

function parseHashToPage(hash: string): ActivePage {
  if (hash.startsWith('#/archive')) return 'archive';
  if (hash.startsWith('#/ecosystem')) return 'ecosystem';
  return 'overview';
}

export default function App() {
  const [syncState, setSyncState] = useState<SyncTelemetryState>(() => getInitialSyncState());
  const [activePage, setActivePage] = useState<ActivePage>(() =>
    typeof window !== 'undefined' ? parseHashToPage(window.location.hash) : 'overview',
  );
  const [selected3DSlug, setSelected3DSlug] = useState<string>(() => {
    const initial = getInitialSyncState().projects;
    const flagship =
      initial.find((p) => p.slug === 'blendops') ??
      [...initial].sort((a, b) => b.stars - a.stars)[0];
    return flagship?.slug ?? 'blendops';
  });
  const [dossierProject, setDossierProject] = useState<OrgProject | null>(null);
  const [archiveSearchQuery, setArchiveSearchQuery] = useState<string>('');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [copiedOrgUrl, setCopiedOrgUrl] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Zero-re-render rAF reading progress hairline along header bottom border
  useEffect(() => {
    let rafId = 0;
    const updateProgress = () => {
      rafId = 0;
      const el = progressBarRef.current;
      if (!el) return;
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const ratio = doc.scrollHeight <= window.innerHeight + 2
        ? 0
        : Math.min(1, Math.max(0, window.scrollY / maxScroll));
      el.style.transform = `scaleX(${ratio.toFixed(4)})`;
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [activePage]);

  // Cmd+K / Ctrl+K Command Palette Shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Sync Browser Back / Forward with hash-backed pages
  useEffect(() => {
    const onHashChange = () => {
      setActivePage(parseHashToPage(window.location.hash));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

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
  const liveLanguageStats = computeLanguageBreakdown(activeProjects);
  const topLanguageSummary = formatTopLanguageCodes(liveLanguageStats, 6);
  const topFooterFlagships = [...activeProjects]
    .sort((a, b) => b.stars - a.stars || b.forks - a.forks || b.pushedAt.localeCompare(a.pushedAt))
    .slice(0, 4);

  const handleCycle3DNode = (dir: -1 | 1) => {
    const nextIdx = (selectedIndex + dir + activeProjects.length) % activeProjects.length;
    const nextProj = activeProjects[nextIdx];
    if (nextProj) {
      setSelected3DSlug(nextProj.slug);
    }
  };

  const scrollToElement = (id: string) => {
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: id === 'orbital-lab' ? 'center' : 'start' });
        }
      }, 60);
    });
  };

  const navigateToPage = (page: ActivePage, scrollTargetId?: string) => {
    setMobileNavOpen(false);
    setActivePage(page);

    const nextHash =
      page === 'archive'
        ? '#/archive'
        : page === 'ecosystem'
          ? '#/ecosystem'
          : scrollTargetId
            ? `#${scrollTargetId}`
            : '#/';
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash);
    }

    if (scrollTargetId) {
      scrollToElement(scrollTargetId);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFocusIn3D = (project: OrgProject) => {
    setSelected3DSlug(project.slug);
    if (activePage !== 'overview') {
      navigateToPage('overview', 'orbital-lab');
    } else {
      scrollToElement('orbital-lab');
    }
  };

  const handleSelectLanguageFilter = (language: string) => {
    setArchiveSearchQuery(language);
    navigateToPage('archive');
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
    <div className="min-h-screen w-full overflow-x-clip bg-[#07090F] text-[#F4F5FA]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 border-b border-[#1E263B]/90 bg-[#07090F]/92 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6 lg:gap-8 lg:px-10">
          {/* Zone 1: Single text element Brand Wordmark */}
          <button
            type="button"
            onClick={() => navigateToPage('overview')}
            className="font-display text-base font-bold tracking-tight text-[#F4F5FA] transition-colors hover:text-[#FCD34D] sm:text-lg whitespace-nowrap shrink-0"
          >
            ThanhNguyxnOrg
          </button>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden items-center gap-3 text-xs font-medium text-[#A3A9BF] md:flex lg:gap-7 lg:text-sm"
          >
            <button
              type="button"
              onClick={() => navigateToPage('overview')}
              className={`transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'overview'
                  ? 'text-[#FCD34D] underline decoration-[#F59E0B] underline-offset-8'
                  : 'hover:text-[#F4F5FA] hover:underline hover:underline-offset-8'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => navigateToPage('overview', 'projects')}
              className="transition-colors hover:text-[#F4F5FA] hover:underline hover:underline-offset-8 whitespace-nowrap shrink-0"
            >
              Featured
            </button>
            <button
              type="button"
              onClick={() => navigateToPage('overview', 'journey')}
              className="transition-colors hover:text-[#F4F5FA] hover:underline hover:underline-offset-8 whitespace-nowrap shrink-0"
            >
              Journey
            </button>
            <button
              type="button"
              onClick={() => navigateToPage('ecosystem')}
              className={`transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'ecosystem'
                  ? 'text-[#FCD34D] underline decoration-[#F59E0B] underline-offset-8'
                  : 'hover:text-[#F4F5FA] hover:underline hover:underline-offset-8'
              }`}
            >
              Stack &amp; Sync
            </button>
            <button
              type="button"
              onClick={() => navigateToPage('archive')}
              className={`transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'archive'
                  ? 'text-[#FCD34D] underline decoration-[#F59E0B] underline-offset-8'
                  : 'hover:text-[#F4F5FA] hover:underline hover:underline-offset-8'
              }`}
            >
              Archive
            </button>
          </nav>

          {/* Zone 3: Quick Jump (⌘K) + 1 Primary CTA + Mobile Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              aria-label="Open quick jump and repository search (Command K)"
              className="inline-flex items-center gap-2 rounded-lg border border-[#2D3854] bg-[#0D111C] px-2.5 py-1.5 font-mono text-xs text-[#A3A9BF] transition-colors hover:border-[#F59E0B] hover:text-[#F4F5FA] lg:py-2 whitespace-nowrap shrink-0"
            >
              <Search className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
              <span className="hidden lg:inline">Quick Jump</span>
              <kbd className="hidden rounded border border-[#1E263B] bg-[#07090F] px-1.5 py-0.5 text-[10px] text-[#868CA6] lg:inline">
                ⌘K
              </kbd>
            </button>
            <a
              href={ORG_METADATA.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg bg-[#F59E0B] px-3 py-1.5 text-xs font-semibold text-[#07090F] transition-colors hover:bg-[#FCD34D] sm:inline-flex lg:px-4 lg:py-2 whitespace-nowrap shrink-0"
            >
              GitHub Org
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-expanded={mobileNavOpen}
              aria-label="Toggle navigation menu"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-[#2D3854] bg-[#0D111C] text-[#F4F5FA] md:hidden"
            >
              {mobileNavOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="border-t border-[#1E263B] bg-[#0D111C] px-4 py-4 md:hidden"
          >
            <ul className="flex flex-col gap-2 text-sm font-medium text-[#C9CDE0]">
              <li>
                <button
                  type="button"
                  onClick={() => navigateToPage('overview')}
                  className={`block w-full rounded-lg px-2 py-2 text-left hover:bg-[#141A29] ${
                    activePage === 'overview' ? 'text-[#FCD34D]' : ''
                  }`}
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToPage('overview', 'projects')}
                  className="block w-full rounded-lg px-2 py-2 text-left hover:bg-[#141A29] hover:text-[#FCD34D]"
                >
                  Featured Releases
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToPage('overview', 'journey')}
                  className="block w-full rounded-lg px-2 py-2 text-left hover:bg-[#141A29] hover:text-[#FCD34D]"
                >
                  Second Lives Journey
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToPage('ecosystem')}
                  className={`block w-full rounded-lg px-2 py-2 text-left hover:bg-[#141A29] ${
                    activePage === 'ecosystem' ? 'text-[#FCD34D]' : ''
                  }`}
                >
                  Stack &amp; Live Sync
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToPage('archive')}
                  className={`block w-full rounded-lg px-2 py-2 text-left hover:bg-[#141A29] ${
                    activePage === 'archive' ? 'text-[#FCD34D]' : ''
                  }`}
                >
                  Repository Archive
                </button>
              </li>
              <li>
                <a
                  href={ORG_METADATA.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileNavOpen(false)}
                  className="block rounded-lg px-2 py-2 hover:bg-[#141A29] hover:text-[#FCD34D]"
                >
                  GitHub Org ↗
                </a>
              </li>
            </ul>
          </nav>
        )}
        {/* 2px Zero-Re-Render Reading Progress Hairline */}
        <div
          ref={progressBarRef}
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#38BDF8] will-change-transform"
        />
      </header>

      <main id="top">
        <motion.div
          key={activePage}
          initial={{ opacity: 0.25, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
        {activePage === 'overview' && (
          <>
        {/* HERO SECTION: Split-Screen Editorial Typography + 3D Astrolabe Constellation */}
        <section className="relative overflow-hidden border-b border-[#1E263B]/80 pt-8 pb-14 sm:pt-12 md:pt-14 md:pb-20">
          {/* Subtle Precision Blueprint Grid & Architectural Astrolabe Arcs */}
          <div
            aria-hidden="true"
            className="bg-blueprint-grid pointer-events-none absolute inset-0 opacity-45"
            style={{
              maskImage: 'radial-gradient(ellipse 75% 65% at 32% 40%, black 20%, transparent 80%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 75% 65% at 32% 40%, black 20%, transparent 80%)',
            }}
          />
          <HeroAmbientBackdrop />

          <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
              {/* Left Column: Clean Typographic Hierarchy */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex min-w-0 flex-col justify-center gap-6 lg:col-span-5"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="ThanhNguyxnOrg emblem"
                    width={40}
                    height={30}
                    className="h-7 w-auto shrink-0 rounded-md border border-[#2D3854]"
                  />
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-[#FCD34D]">
                    <span>Independent Practice</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#A3A9BF] tabular-nums">
                      Est. {ORG_METADATA.foundedAt}
                    </span>
                    <span aria-hidden="true" className="hidden sm:inline">
                      ·
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateToPage('ecosystem')}
                      className="inline-flex items-center gap-1.5 text-[#34D399] transition-colors hover:text-[#6EE7B7]"
                    >
                      <span
                        aria-hidden="true"
                        className={`inline-block size-1.5 rounded-full ${
                          syncState.status === 'syncing' ? 'bg-[#F59E0B]' : 'bg-[#34D399]'
                        }`}
                      />
                      <span>
                        {syncState.status === 'syncing' ? 'Syncing telemetry' : 'Live telemetry'}
                      </span>
                    </button>
                  </div>
                </div>

                <h1 className="font-display text-[clamp(2.75rem,4.6vw,4.35rem)] font-extrabold leading-[0.95] tracking-tight text-[#F4F5FA]">
                  <span className="block">Build.</span>
                  <span className="block text-[#C9CDE0]">Explore.</span>
                  <span className="block bg-gradient-to-r from-[#FCD34D] via-[#F59E0B] to-[#38BDF8] bg-clip-text text-transparent">
                    Evolve.
                  </span>
                </h1>

                <p className="max-w-xl text-base leading-relaxed text-[#A3A9BF] sm:text-lg">
                  {ORG_METADATA.subtitle}
                </p>

                {/* Primary CTA + Compact 3D Node Stepper */}
                <div className="flex w-full flex-col items-stretch gap-3 pt-1 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                  <button
                    type="button"
                    onClick={() => navigateToPage('archive')}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#F59E0B] px-5 py-3 text-sm font-semibold text-[#07090F] transition-all hover:bg-[#FCD34D] hover:shadow-[0_0_24px_rgba(245,158,11,0.35)] sm:w-auto whitespace-nowrap shrink-0"
                  >
                    Browse Repositories
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </button>

                  <div className="inline-flex min-w-0 items-center justify-between gap-1 rounded-lg border border-[#2D3854] bg-[#0D111C] p-1 sm:justify-start">
                    <button
                      type="button"
                      onClick={() => handleCycle3DNode(-1)}
                      aria-label="Previous 3D satellite node"
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[#C9CDE0] transition-colors hover:bg-[#141A29] hover:text-[#FCD34D]"
                    >
                      <ChevronLeft className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDossierProject(selected3DProject)}
                      className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-[#F4F5FA] transition-colors hover:text-[#FCD34D] sm:flex-none"
                    >
                      <Eye className="size-4 shrink-0 text-[#F59E0B]" aria-hidden="true" />
                      <span className="truncate">Inspect {selected3DProject.name}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCycle3DNode(1)}
                      aria-label="Next 3D satellite node"
                      className="inline-flex size-8 items-center justify-center rounded-md text-[#C9CDE0] transition-colors hover:bg-[#141A29] hover:text-[#FCD34D]"
                    >
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Interactive Code-Split Three.js Astrolabe Lab */}
              <motion.div
                id="orbital-lab"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="min-w-0 lg:col-span-7"
              >
                <Suspense fallback={<OrbitalViewportFallback />}>
                  <OrbitalScene3D
                    projects={activeProjects}
                    selectedSlug={selected3DProject.slug}
                    onSelectProject={(proj) => setSelected3DSlug(proj.slug)}
                    onOpenDossier={(proj) => setDossierProject(proj)}
                  />
                </Suspense>
              </motion.div>
            </div>

            {/* Full-Width 5-Column Verified Metrics Architectural Grid Below Split */}
            <SpotlightSurface className="mt-10 rounded-2xl">
            <dl className="surface-hairline grid grid-cols-2 overflow-hidden rounded-2xl border border-[#1E263B] sm:grid-cols-3 lg:grid-cols-5">
              <div className="cell-top-beam flex flex-col gap-1 border-r border-b border-[#1E263B] p-5 transition-colors hover:bg-[#111728]/70 sm:p-6 lg:border-b-0">
                <dt className="font-mono text-xs text-[#868CA6]">Public Repositories</dt>
                <dd className="font-display text-3xl font-bold text-[#F4F5FA] tabular-nums">
                  {syncState.totals.repos}
                </dd>
                <dd className="font-mono text-[11px] text-[#FCD34D]">100% open source</dd>
              </div>

              <div className="cell-top-beam flex flex-col gap-1 border-b border-[#1E263B] p-5 transition-colors hover:bg-[#111728]/70 sm:border-r sm:p-6 lg:border-b-0">
                <dt className="font-mono text-xs text-[#868CA6]">Verified GitHub Stars</dt>
                <dd className="font-display text-3xl font-bold text-[#F4F5FA] tabular-nums">
                  {syncState.totals.stars}
                </dd>
                <dd className="font-mono text-[11px] text-[#A3A9BF] tabular-nums">
                  {syncState.totals.forks} forks across org
                </dd>
              </div>

              <div className="cell-top-beam flex flex-col gap-1 border-r border-b border-[#1E263B] p-5 transition-colors hover:bg-[#111728]/70 sm:border-r-0 sm:p-6 lg:border-r lg:border-b-0">
                <dt className="font-mono text-xs text-[#868CA6]">npm Downloads (30d)</dt>
                <dd className="font-display text-3xl font-bold text-[#F4F5FA] tabular-nums">
                  {syncState.totals.downloads30d}
                </dd>
                <dd className="font-mono text-[11px] text-[#FCD34D] tabular-nums">
                  {syncState.totals.packages} published packages
                </dd>
              </div>

              <div className="cell-top-beam flex flex-col gap-1 border-b border-[#1E263B] p-5 transition-colors hover:bg-[#111728]/70 sm:border-r sm:border-b-0 sm:p-6">
                <dt className="font-mono text-xs text-[#868CA6]">Live Pages Demos</dt>
                <dd className="font-display text-3xl font-bold text-[#F4F5FA] tabular-nums">
                  {syncState.totals.demos}
                </dd>
                <dd className="font-mono text-[11px] text-[#A3A9BF]">Zero-config browser apps</dd>
              </div>

              <div className="cell-top-beam col-span-2 flex flex-col gap-1 p-5 transition-colors hover:bg-[#111728]/70 sm:col-span-2 sm:p-6 lg:col-span-1">
                <dt className="font-mono text-xs text-[#868CA6]">Core Languages</dt>
                <dd className="font-display text-3xl font-bold text-[#F4F5FA] tabular-nums">
                  {syncState.totals.languages.length}
                </dd>
                <dd className="truncate font-mono text-[11px] tracking-tight text-[#A3A9BF]">
                  {topLanguageSummary}
                </dd>
              </div>
            </dl>
            </SpotlightSurface>
          </div>
        </section>

        {/* Edge-Faded Editorial Tech Strip */}
        <div
          aria-hidden="true"
          className="overflow-hidden border-b border-[#1E263B]/80 bg-[#090D16] py-3.5"
        >
          <div className="mask-fade-x mx-auto w-full max-w-[1440px] overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-10">
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <span key={i} className="font-mono text-xs text-[#868CA6] whitespace-nowrap">
                  <span className="mr-3 text-[#F59E0B]/80">◆</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <SectionSeam label="01 · FEATURED" />

        {/* Featured Releases Bento Grid (Lead + Top 4 Highlights) */}
        <FeaturedSection
          projects={activeProjects}
          onInspectDossier={(proj) => setDossierProject(proj)}
          onFocusIn3D={handleFocusIn3D}
          onOpenArchive={() => navigateToPage('archive')}
        />

        {/* Principles & Second Lives Timeline */}
        <JourneyAndStackSection
          mode="journey"
          projects={activeProjects}
          onInspectDossier={(proj) => setDossierProject(proj)}
          onFocusIn3D={handleFocusIn3D}
          onSelectLanguageFilter={handleSelectLanguageFilter}
        />

        <SectionSeam glow label="04 · DEEP DIVE" />

        {/* Compact Dedicated-Pages Gateway (with bespoke data-driven architectural previews) */}
        <section
          aria-labelledby="explore-more-heading"
          className="relative overflow-hidden bg-[#090D16] py-20 md:py-24"
        >
          <DotMatrixBackdrop align="center" tint="cyan" />

          <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
            <div className="max-w-2xl">
              <p className="font-mono text-xs text-[#FCD34D]">04. Deep Dive Pages</p>
              <h2
                id="explore-more-heading"
                className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F4F5FA] sm:text-4xl"
              >
                Explore the full index &amp; stack.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#A3A9BF]">
                Overview stays focused on flagship work. Dive into dedicated paginated views for
                full-catalog search, cluster filtering, language breakdown, and live CI/npm
                telemetry.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <InteractiveCard3D className="h-full" maxTilt={3}>
                <SpotlightSurface className="h-full rounded-2xl">
                <article className="surface-hairline surface-hairline-interactive cell-top-beam flex h-full flex-col justify-between gap-6 rounded-2xl border border-[#2D3854]/90 p-6 sm:p-7 hover:border-[#F59E0B]/70">
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between gap-2 font-mono text-xs text-[#FCD34D]">
                      <span className="inline-flex items-center gap-1.5">
                        <Layers className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                        Dedicated Archive Page
                      </span>
                      <span className="text-[#A3A9BF] tabular-nums">
                        {activeProjects.length} repos · {syncState.totals.demos} live demos
                      </span>
                    </div>

                    <ArchiveMatrixPreview projects={activeProjects} />

                    <div>
                      <h3 className="font-display text-2xl font-bold text-[#F4F5FA]">
                        Paginated Repository Archive
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#A3A9BF]">
                        Browse all {activeProjects.length} repositories in paginated Grid, Domain
                        Clusters, or Compact Table views with instant search, topic filters, and
                        impact sorting.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-[#1E263B] pt-4">
                    <span className="font-mono text-[11px] text-[#868CA6]">
                      Search · Topics · Clusters
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateToPage('archive')}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2 text-xs font-semibold text-[#07090F] transition-colors hover:bg-[#FCD34D] whitespace-nowrap shrink-0"
                    >
                      Open Paginated Archive
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </article>
                </SpotlightSurface>
              </InteractiveCard3D>

              <InteractiveCard3D className="h-full" maxTilt={3}>
                <SpotlightSurface className="h-full rounded-2xl">
                <article className="surface-hairline surface-hairline-interactive cell-top-beam flex h-full flex-col justify-between gap-6 rounded-2xl border border-[#2D3854]/90 p-6 sm:p-7 hover:border-[#38BDF8]/70">
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between gap-2 font-mono text-xs text-[#38BDF8]">
                      <span className="inline-flex items-center gap-1.5">
                        <Database className="size-3.5" aria-hidden="true" />
                        Dedicated Stack &amp; Telemetry Page
                      </span>
                      <span className="text-[#34D399] tabular-nums">
                        {syncState.status === 'live' ? 'Live API Synced' : 'CI Snapshot Active'}
                      </span>
                    </div>

                    <LanguageSpectrumPreview
                      stats={liveLanguageStats}
                      totalRepos={activeProjects.length}
                      downloads30d={syncState.totals.downloads30d}
                    />

                    <div>
                      <h3 className="font-display text-2xl font-bold text-[#F4F5FA]">
                        Live Stack, npm Registry &amp; Auto-Sync
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#A3A9BF]">
                        Inspect real-time GitHub language distribution across{' '}
                        {syncState.totals.languages.length} languages, published npm packages (
                        {syncState.totals.downloads30d} downloads/30d), and the 6-hour CI sync
                        pipeline.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-[#1E263B] pt-4">
                    <span className="font-mono text-[11px] text-[#868CA6]">
                      3D Telemetry Core · npm · .yml
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateToPage('ecosystem')}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#2D3854] bg-[#141A29] px-4 py-2 text-xs font-semibold text-[#F4F5FA] transition-colors hover:border-[#38BDF8] hover:text-[#38BDF8] whitespace-nowrap shrink-0"
                    >
                      Explore Stack &amp; Telemetry
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </article>
                </SpotlightSurface>
              </InteractiveCard3D>
            </div>
          </div>
        </section>

        <SectionSeam label="05 · OPEN SOURCE" />

        {/* Closing Conversion / Open Source Spotlight Canvas (v0 / Linear Editorial) */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
            <div className="ambient-cta-glow cad-frame relative overflow-hidden rounded-2xl border border-[#2D3854]/90 p-8 sm:p-12 lg:p-14">
              {/* Subtle architectural diagonal-hatch, orbital wireframe & dot vignette */}
              <div
                aria-hidden="true"
                className="bg-diagonal-hatch pointer-events-none absolute inset-0 opacity-60"
                style={{
                  maskImage: 'radial-gradient(ellipse 65% 80% at 85% 20%, black 0%, transparent 75%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse 65% 80% at 85% 20%, black 0%, transparent 75%)',
                }}
              />
              <ClosingOrbitalBackdrop />
              {/* Crisp top spotlight hairline */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#F59E0B]/70 to-transparent"
              />

              <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div className="max-w-2xl">
                  <p className="font-mono text-xs text-[#FCD34D]">Open Source Workspace</p>
                  <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F4F5FA] sm:text-4xl">
                    Use it. Fork it. Make it better.
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-[#A3A9BF]">
                    Personal engineering practice, best effort. Active repositories get priority
                    review; older experiments are preserved for transparency. Start with an issue
                    on GitHub.
                  </p>
                  <p className="mt-4 font-mono text-[11px] text-[#868CA6] tabular-nums">
                    {syncState.totals.repos} public repos · {syncState.totals.stars} stars ·{' '}
                    {syncState.totals.downloads30d} npm downloads/30d · Auto-synced via{' '}
                    <span className="text-[#34D399]">sync-org-data.yml</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a
                    href={ORG_METADATA.issuesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-5 py-3 text-sm font-semibold text-[#07090F] transition-all hover:bg-[#FCD34D] hover:shadow-[0_0_24px_rgba(245,158,11,0.3)] whitespace-nowrap shrink-0"
                  >
                    Open an Issue
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                  <a
                    href={ORG_METADATA.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#2D3854] bg-[#0D111C]/90 px-5 py-3 text-sm font-medium text-[#F4F5FA] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
                  >
                    Follow on GitHub
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
          </>
        )}

        {activePage === 'archive' && (
          <ExplorerAndEcosystemSection
            mode="archive"
            projects={activeProjects}
            resources={syncState.resources}
            syncState={syncState}
            onTriggerSync={handleManualSync}
            externalQuery={archiveSearchQuery}
            onExternalQueryChange={setArchiveSearchQuery}
            onInspectDossier={(proj) => setDossierProject(proj)}
            onFocusIn3D={handleFocusIn3D}
            onBackToOverview={() => navigateToPage('overview')}
          />
        )}

        {activePage === 'ecosystem' && (
          <EcosystemBentoPage
            projects={activeProjects}
            resources={syncState.resources}
            syncState={syncState}
            onTriggerSync={handleManualSync}
            onSelectLanguageFilter={handleSelectLanguageFilter}
            onBackToOverview={() => navigateToPage('overview')}
            onOpenArchive={() => navigateToPage('archive')}
          />
        )}
        </motion.div>
      </main>

      <div aria-hidden="true" className="hairline-divider-glow" />

      {/* Quiet Editorial Footer */}
      <footer className="bg-[#07090F] py-14">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
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
                  className="inline-flex items-center gap-2 rounded-lg border border-[#2D3854] bg-[#0D111C] px-4 py-2 font-mono text-xs text-[#C9CDE0] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
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
                    <button
                      type="button"
                      onClick={() => navigateToPage('overview', 'orbital-lab')}
                      className="hover:text-[#F4F5FA]"
                    >
                      3D Astrolabe Lab
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigateToPage('overview', 'projects')}
                      className="hover:text-[#F4F5FA]"
                    >
                      Featured Releases
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigateToPage('ecosystem')}
                      className="hover:text-[#F4F5FA]"
                    >
                      Live Stack &amp; Sync
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigateToPage('archive')}
                      className="hover:text-[#F4F5FA]"
                    >
                      Engineering Archive
                    </button>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs text-[#FCD34D]">Flagship Projects</p>
                <ul className="flex flex-col gap-2 text-sm text-[#A3A9BF]">
                  {topFooterFlagships.map((proj) => (
                    <li key={proj.slug}>
                      <a
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#F4F5FA]"
                      >
                        {proj.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs text-[#FCD34D]">Crew &amp; Registry</p>
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

      {/* Project Dossier Modal with Prev/Next Navigation */}
      <ProjectDossierModal
        project={dossierProject}
        projects={activeProjects}
        onSelectProject={(proj) => setDossierProject(proj)}
        onClose={() => setDossierProject(null)}
        onFocusIn3D={handleFocusIn3D}
      />

      {/* Global Command Palette (⌘K) */}
      <CommandPaletteModal
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        projects={activeProjects}
        onNavigatePage={navigateToPage}
        onInspectDossier={(proj) => setDossierProject(proj)}
        onFocusIn3D={handleFocusIn3D}
      />
    </div>
  );
}
