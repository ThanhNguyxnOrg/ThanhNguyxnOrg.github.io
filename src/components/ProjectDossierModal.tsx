import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  Code2,
  Compass,
  Copy,
  ExternalLink,
  GitBranch,
  GitFork,
  Scale,
  Star,
  Terminal,
  X,
} from 'lucide-react';
import type { OrgProject } from '../data/orgData';
import { assessProjectScientifically } from '../utils/projectLogic';
import { ProjectArtwork } from './InteractiveCard3D';

interface ProjectDossierModalProps {
  project: OrgProject | null;
  projects: OrgProject[];
  onSelectProject: (project: OrgProject) => void;
  onClose: () => void;
  onFocusIn3D: (project: OrgProject) => void;
}

export default function ProjectDossierModal({
  project,
  projects,
  onSelectProject,
  onClose,
  onFocusIn3D,
}: ProjectDossierModalProps) {
  const [copiedClone, setCopiedClone] = useState(false);

  const currentIndex = project
    ? projects.findIndex((p) => p.slug === project.slug)
    : -1;
  const prevProject =
    currentIndex >= 0 && projects.length > 1
      ? projects[(currentIndex - 1 + projects.length) % projects.length]
      : null;
  const nextProject =
    currentIndex >= 0 && projects.length > 1
      ? projects[(currentIndex + 1) % projects.length]
      : null;

  useEffect(() => {
    setCopiedClone(false);
  }, [project?.slug]);

  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && prevProject) {
        onSelectProject(prevProject);
      } else if (e.key === 'ArrowRight' && nextProject) {
        onSelectProject(nextProject);
      }
    };
    window.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, prevProject, nextProject, onClose, onSelectProject]);

  const sci = project ? assessProjectScientifically(project) : null;
  const cloneCommand = project ? `git clone ${project.repoUrl}.git` : '';

  const handleCopyClone = async () => {
    if (!cloneCommand) return;
    try {
      await navigator.clipboard.writeText(cloneCommand);
    } catch {
      // Fallback
    }
    setCopiedClone(true);
    window.setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <AnimatePresence>
      {project && sci && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dossier-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090F]/82 p-4 backdrop-blur-sm sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="surface-hairline relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl border border-[#2D3854]"
          >
            {/* Top Sticky Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[#1E263B] bg-[#0D111C]/95 px-6 py-4 backdrop-blur-sm">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#A3A9BF]">
                <span className="text-[#FCD34D]">{project.category}</span>
                <span aria-hidden="true">·</span>
                <span>{project.language}</span>
                <span aria-hidden="true">·</span>
                <span>{sci.cluster}</span>
                {project.license && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{project.license}</span>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close project dossier"
                className="inline-flex size-9 items-center justify-center rounded-lg border border-[#2D3854] bg-[#141A29] text-[#C9CDE0] transition-colors hover:border-[#F59E0B] hover:text-[#F4F5FA]"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Visual Banner */}
            <div className="relative aspect-[2/1] w-full border-b border-[#1E263B]">
              <ProjectArtwork
                title={project.name}
                image={project.image}
                logo={project.logo}
                logoBare={project.logoBare}
                pattern={project.pattern}
                accent={project.accent}
                showLogoOverlay={false}
                className="h-full w-full"
              />
            </div>

            {/* Dossier Content (Hairline Primer Monograph Layout, zero nested cards) */}
            <div className="flex flex-col gap-6 p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2
                    id="dossier-modal-title"
                    className="font-display text-2xl font-bold tracking-tight text-[#F4F5FA] sm:text-3xl"
                  >
                    {project.name}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-[#868CA6]">
                    ThanhNguyxnOrg/{project.name} · Branch: {project.defaultBranch}
                  </p>
                </div>

                <div className="flex items-center gap-5 border-l border-[#1E263B] pl-5">
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px] text-[#868CA6]">Stars</span>
                    <span className="inline-flex items-center gap-1 font-display text-lg font-bold text-[#F4F5FA] tabular-nums">
                      <Star className="size-4 text-[#F59E0B]" aria-hidden="true" />
                      {project.stars}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px] text-[#868CA6]">Forks</span>
                    <span className="inline-flex items-center gap-1 font-display text-lg font-bold text-[#F4F5FA] tabular-nums">
                      <GitFork className="size-4 text-[#FCD34D]" aria-hidden="true" />
                      {project.forks}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description & Origin Story */}
              <div className="flex flex-col gap-4">
                <p className="text-base leading-relaxed text-[#F4F5FA]">{project.description}</p>
                {project.story && (
                  <div className="border-t border-[#1E263B] pt-4">
                    <p className="mb-1.5 font-mono text-xs text-[#FCD34D]">
                      Origin &amp; Evolution Note
                    </p>
                    <p className="text-sm leading-relaxed text-[#C9CDE0]">{project.story}</p>
                  </div>
                )}
              </div>

              {/* Engineering Evaluation Readout (computed from live telemetry) */}
              <div className="border-t border-[#1E263B] pt-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                  <span className="text-[#FCD34D]">Engineering Evaluation · {sci.tier}</span>
                  <span className="text-[#F4F5FA] tabular-nums">
                    Composite Impact: <strong className="text-[#FCD34D]">{sci.score}</strong>/100
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: 'Traction', value: sci.dimensions.traction },
                    { label: 'Readiness', value: sci.dimensions.readiness },
                    { label: 'Architecture', value: sci.dimensions.architecture },
                    { label: 'Velocity', value: sci.dimensions.velocity },
                  ].map((metric) => (
                    <div key={metric.label} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-[#868CA6]">{metric.label}</span>
                        <span className="text-[#F4F5FA] tabular-nums">{metric.value}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#141A29]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#38BDF8]"
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Git Clone Command */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#1E263B] bg-[#07090F] px-3.5 py-2.5">
                <div className="flex min-w-0 items-center gap-2 font-mono text-xs text-[#C9CDE0]">
                  <Terminal className="size-3.5 shrink-0 text-[#F59E0B]" aria-hidden="true" />
                  <code className="truncate">{cloneCommand}</code>
                </div>
                <button
                  type="button"
                  onClick={handleCopyClone}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#2D3854] bg-[#141A29] px-2.5 py-1 font-mono text-xs text-[#F4F5FA] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
                >
                  {copiedClone ? (
                    <>
                      <Check className="size-3 text-[#34D399]" aria-hidden="true" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3 text-[#F59E0B]" aria-hidden="true" />
                      Copy clone
                    </>
                  )}
                </button>
              </div>

              {/* Verified Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 border-y border-[#1E263B] py-4 sm:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#868CA6]">
                    <Code2 className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                    Primary Stack
                  </span>
                  <span className="font-mono text-sm font-medium text-[#F4F5FA]">
                    {project.language}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#868CA6]">
                    <Scale className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                    License
                  </span>
                  <span className="font-mono text-sm font-medium text-[#F4F5FA]">
                    {project.license ?? 'Source Available'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#868CA6]">
                    <Calendar className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                    Created
                  </span>
                  <span className="font-mono text-sm font-medium text-[#F4F5FA] tabular-nums">
                    {project.createdAt.slice(0, 10)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#868CA6]">
                    <GitBranch className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                    Last Pushed
                  </span>
                  <span className="font-mono text-sm font-medium text-[#F4F5FA] tabular-nums">
                    {project.pushedAt.slice(0, 10)}
                  </span>
                </div>
              </div>

              {/* Topics */}
              {project.topics.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-xs text-[#868CA6]">
                    Repository Topics ({project.topics.length})
                  </span>
                  <p className="font-mono text-xs leading-relaxed text-[#A3A9BF]">
                    {project.topics.join(' · ')}
                  </p>
                </div>
              )}

              {/* Primary Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2.5 text-xs font-semibold text-[#07090F] transition-colors hover:bg-[#FCD34D] whitespace-nowrap shrink-0"
                  >
                    Open GitHub Repository
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#2D3854] bg-[#141A29] px-4 py-2.5 text-xs font-semibold text-[#F4F5FA] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
                    >
                      Launch Live Demo
                      <ArrowUpRight className="size-3.5 text-[#FCD34D]" aria-hidden="true" />
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onFocusIn3D(project);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E263B] bg-[#07090F] px-3.5 py-2.5 text-xs font-medium text-[#C9CDE0] transition-colors hover:border-[#F59E0B] hover:text-[#FCD34D] whitespace-nowrap shrink-0"
                >
                  <Compass className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                  Focus in 3D Astrolabe
                </button>
              </div>
            </div>

            {/* Seamless Previous / Next Project Navigation Footer */}
            {prevProject && nextProject && (
              <div className="flex items-center justify-between gap-4 border-t border-[#1E263B] bg-[#090D16] px-6 py-3.5">
                <button
                  type="button"
                  onClick={() => onSelectProject(prevProject)}
                  className="inline-flex min-w-0 items-center gap-2 font-mono text-xs text-[#A3A9BF] transition-colors hover:text-[#FCD34D]"
                >
                  <ArrowLeft className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">Prev: {prevProject.name}</span>
                </button>
                <span className="hidden font-mono text-[11px] text-[#868CA6] tabular-nums sm:inline">
                  {currentIndex + 1} / {projects.length}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectProject(nextProject)}
                  className="inline-flex min-w-0 items-center gap-2 font-mono text-xs text-[#A3A9BF] transition-colors hover:text-[#FCD34D]"
                >
                  <span className="truncate">Next: {nextProject.name}</span>
                  <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
