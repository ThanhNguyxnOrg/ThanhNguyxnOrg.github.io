import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  Calendar,
  Code2,
  Compass,
  ExternalLink,
  GitBranch,
  GitFork,
  Scale,
  Star,
  X,
} from 'lucide-react';
import type { OrgProject } from '../data/orgData';
import { assessProjectScientifically } from '../utils/projectLogic';
import { ProjectArtwork } from './InteractiveCard3D';

interface ProjectDossierModalProps {
  project: OrgProject | null;
  onClose: () => void;
  onFocusIn3D: (project: OrgProject) => void;
}

export default function ProjectDossierModal({
  project,
  onClose,
  onFocusIn3D,
}: ProjectDossierModalProps) {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  const sci = project ? assessProjectScientifically(project) : null;

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
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090F]/85 p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-3xl border border-[#2D3854] bg-gradient-to-b from-[#111726] to-[#0B0F1A] shadow-2xl"
          >
            {/* Top Header Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[#1E263B] bg-[#0D111C]/95 px-6 py-4">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#A3A9BF]">
                <span className="text-[#FCD34D]">{project.category}</span>
                <span aria-hidden="true">·</span>
                <span>{project.language}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#38BDF8]">
                  Index {sci.score}/99 ({sci.tier})
                </span>
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
                className="inline-flex size-9 items-center justify-center rounded-full border border-[#2D3854] bg-[#141A29] text-[#C9CDE0] transition-colors hover:border-[#F59E0B] hover:text-[#F4F5FA]"
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
                pattern={project.pattern}
                accent={project.accent}
                className="h-full w-full"
              />
            </div>

            {/* Dossier Content */}
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
                    ThanhNguyxnOrg/{project.name} · Cluster: {sci.cluster} · Branch:{' '}
                    {project.defaultBranch}
                  </p>
                </div>
                <div className="flex items-center gap-5 rounded-2xl border border-[#1E263B] bg-[#07090F] px-4 py-2.5">
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px] text-[#868CA6]">Stars</span>
                    <span className="inline-flex items-center gap-1 font-display text-lg font-bold text-[#F4F5FA] tabular-nums">
                      <Star className="size-4 text-[#F59E0B]" aria-hidden="true" />
                      {project.stars}
                    </span>
                  </div>
                  <div className="h-7 w-px bg-[#1E263B]" />
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px] text-[#868CA6]">Forks</span>
                    <span className="inline-flex items-center gap-1 font-display text-lg font-bold text-[#F4F5FA] tabular-nums">
                      <GitFork className="size-4 text-[#FCD34D]" aria-hidden="true" />
                      {project.forks}
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Description & Hand-Written Story */}
              <div className="flex flex-col gap-3">
                <p className="text-base leading-relaxed text-[#F4F5FA]">{project.description}</p>
                {project.story && (
                  <div className="rounded-2xl border border-[#1E263B] bg-[#141A29]/60 p-4">
                    <p className="mb-1 font-mono text-xs text-[#FCD34D]">Origin & Evolution Note</p>
                    <p className="text-sm leading-relaxed text-[#C9CDE0]">{project.story}</p>
                  </div>
                )}
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
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-xs text-[#868CA6]">
                    Repository Topics ({project.topics.length})
                  </span>
                  <p className="font-mono text-xs leading-relaxed text-[#A3A9BF]">
                    {project.topics.join(' · ')}
                  </p>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-5 py-2.5 text-sm font-semibold text-[#07090F] transition-colors hover:bg-[#FCD34D] whitespace-nowrap shrink-0"
                  >
                    Open GitHub Repository
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[#2D3854] bg-[#141A29] px-5 py-2.5 text-sm font-semibold text-[#F4F5FA] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
                    >
                      Launch Live Demo
                      <ArrowUpRight className="size-4 text-[#FCD34D]" aria-hidden="true" />
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onFocusIn3D(project);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#1E263B] bg-[#07090F] px-4 py-2.5 text-xs font-medium text-[#C9CDE0] transition-colors hover:border-[#F59E0B] hover:text-[#FCD34D] whitespace-nowrap shrink-0"
                >
                  <Compass className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                  Focus in 3D Astrolabe
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
