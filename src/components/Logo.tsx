import clsx from 'clsx';

/**
 * TNORG mark: the real cropped org logo. Decorative here: always paired
 * with the wordmark label next to it.
 */
export function LogoMark({ className, title = 'TNORG' }: { className?: string; title?: string }) {
  return (
    <img
      src="/logo.png"
      alt=""
      title={title}
      width={44}
      height={33}
      className={clsx('h-8 w-auto shrink-0 rounded-[8px] border border-border bg-black', className)}
    />
  );
}

export default function Logo({ className, showDescriptor = false }: { className?: string; showDescriptor?: boolean }) {
  return (
    <span className={clsx('inline-flex items-center gap-2.5', className)}>
      <LogoMark title="" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-title font-bold tracking-tight text-fg">TNORG</span>
        {showDescriptor && <span className="mt-1 font-mono text-micro uppercase text-fg-subtle">ThanhNguyxnOrg</span>}
      </span>
      <span className="sr-only">TNORG home</span>
    </span>
  );
}
