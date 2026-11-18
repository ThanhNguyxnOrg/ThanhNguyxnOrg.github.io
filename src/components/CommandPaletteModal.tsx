import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Compass,
  Database,
  Eye,
  Home,
  Layers,
  Search,
  Star,
  X,
} from 'lucide-react';
import type { OrgProject } from '../data/orgData';
import { filterAndSortProjects } from '../utils/projectLogic';

interface CommandPaletteModalProps {
  open: boolean;
  onClose: () => void;
  projects: OrgProject[];
  onNavigatePage: (page: 'overview' | 'archive' | 'ecosystem', scrollTargetId?: string) => void;
  onInspectDossier: (project: OrgProject) => void;
  onFocusIn3D: (project: OrgProject) => void;
}

export default function CommandPaletteModal({
  open,
  onClose,
  projects,
  onNavigatePage,
  onInspectDossier,
  onFocusIn3D,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(0);
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [open]);

  const pageShortcuts = useMemo(
    () => [
      {
        id: 'nav-overview',
        label: 'Overview & 3D Astrolabe Lab',
        hint: 'Page · #/',
        icon: Home,
        run: () => onNavigatePage('overview'),
      },
      {
        id: 'nav-featured',
        label: 'Featured Releases Highlights',
        hint: 'Section · #projects',
        icon: Star,
        run: () => onNavigatePage('overview', 'projects'),
      },
      {
        id: 'nav-archive',
        label: `Paginated Repository Archive (${projects.length})`,
        hint: 'Page · #/archive',
        icon: Layers,
        run: () => onNavigatePage('archive'),
      },
      {
        id: 'nav-ecosystem',
        label: 'Live Stack, npm Registry & Auto-Sync',
        hint: 'Page · #/ecosystem',
        icon: Database,
        run: () => onNavigatePage('ecosystem'),
      },
    ],
    [onNavigatePage, projects.length],
  );

  const filteredShortcuts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pageShortcuts;
    return pageShortcuts.filter(
      (s) => s.label.toLowerCase().includes(q) || s.hint.toLowerCase().includes(q),
    );
  }, [pageShortcuts, query]);

  const matchingProjects = useMemo(() => {
    return filterAndSortProjects(projects, {
      query,
      category: 'all',
      topics: [],
      onlyLiveDemos: false,
      sort: 'scientific',
    }).slice(0, 8);
  }, [projects, query]);

  const totalItems = filteredShortcuts.length + matchingProjects.length;

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown' && totalItems > 0) {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % totalItems);
      } else if (e.key === 'ArrowUp' && totalItems > 0) {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
      } else if (e.key === 'Enter' && totalItems > 0) {
        e.preventDefault();
        if (activeIndex < filteredShortcuts.length) {
          filteredShortcuts[activeIndex]?.run();
          onClose();
        } else {
          const proj = matchingProjects[activeIndex - filteredShortcuts.length];
          if (proj) {
            onInspectDossier(proj);
            onClose();
          }
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, totalItems, activeIndex, filteredShortcuts, matchingProjects, onClose, onInspectDossier]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Quick navigation and repository search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-[#07090F]/80 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="surface-hairline w-full max-w-xl overflow-hidden rounded-2xl border border-[#2D3854] shadow-2xl"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-[#1E263B] bg-[#0D111C] px-4 py-3.5">
              <Search className="size-4 shrink-0 text-[#F59E0B]" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to page, repository, language, or topic..."
                aria-label="Command palette search"
                className="w-full bg-transparent text-sm text-[#F4F5FA] placeholder-[#868CA6] focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close quick jump"
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-[#2D3854] bg-[#141A29] text-[#A3A9BF] transition-colors hover:border-[#F59E0B] hover:text-[#F4F5FA]"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[58vh] overflow-y-auto p-2">
              {filteredShortcuts.length > 0 && (
                <div className="mb-2">
                  <p className="px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#868CA6]">
                    Pages &amp; Views
                  </p>
                  <ul className="flex flex-col gap-0.5">
                    {filteredShortcuts.map((item, idx) => {
                      const Icon = item.icon;
                      const isActive = idx === activeIndex;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onMouseEnter={() => setActiveIndex(idx)}
                            onClick={() => {
                              item.run();
                              onClose();
                            }}
                            className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                              isActive
                                ? 'bg-[#182033] text-[#FCD34D]'
                                : 'text-[#C9CDE0] hover:bg-[#131928]'
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-2.5">
                              <Icon className="size-4 shrink-0 text-[#F59E0B]" aria-hidden="true" />
                              <span className="truncate font-medium">{item.label}</span>
                            </span>
                            <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-[#868CA6]">
                              <span>{item.hint}</span>
                              <ArrowRight className="size-3" aria-hidden="true" />
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div>
                <p className="px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#868CA6]">
                  Repositories ({matchingProjects.length})
                </p>
                {matchingProjects.length === 0 ? (
                  <p className="px-3 py-6 text-center font-mono text-xs text-[#868CA6]">
                    No repositories matching &ldquo;{query}&rdquo;
                  </p>
                ) : (
                  <ul className="flex flex-col gap-0.5">
                    {matchingProjects.map((project, idx) => {
                      const globalIdx = filteredShortcuts.length + idx;
                      const isActive = globalIdx === activeIndex;
                      return (
                        <li
                          key={project.slug}
                          onMouseEnter={() => setActiveIndex(globalIdx)}
                          className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 transition-colors ${
                            isActive ? 'bg-[#182033]' : 'hover:bg-[#131928]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onInspectDossier(project);
                              onClose();
                            }}
                            className="flex min-w-0 flex-1 flex-col text-left"
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`truncate font-display text-sm font-semibold ${
                                  isActive ? 'text-[#FCD34D]' : 'text-[#F4F5FA]'
                                }`}
                              >
                                {project.name}
                              </span>
                              <span className="font-mono text-[11px] text-[#868CA6] tabular-nums">
                                {project.language} · {project.stars}★
                              </span>
                            </span>
                            <span className="truncate text-xs text-[#A3A9BF]">{project.blurb}</span>
                          </button>

                          <div className="flex shrink-0 items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                onFocusIn3D(project);
                                onClose();
                              }}
                              title="Focus node in 3D Astrolabe"
                              className="inline-flex items-center gap-1 rounded-lg border border-[#2D3854] bg-[#0D111C] px-2 py-1 font-mono text-[11px] text-[#C9CDE0] transition-colors hover:border-[#F59E0B] hover:text-[#FCD34D]"
                            >
                              <Compass className="size-3 text-[#F59E0B]" aria-hidden="true" />
                              3D
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onInspectDossier(project);
                                onClose();
                              }}
                              title="Inspect Dossier"
                              className="inline-flex items-center gap-1 rounded-lg bg-[#F59E0B] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#07090F] transition-colors hover:bg-[#FCD34D]"
                            >
                              <Eye className="size-3" aria-hidden="true" />
                              Dossier
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* Footer Hints */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#1E263B] bg-[#090D16] px-4 py-2.5 font-mono text-[11px] text-[#868CA6]">
              <span>↑↓ navigate · Enter open dossier</span>
              <span>Esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
