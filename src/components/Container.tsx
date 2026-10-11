import type { ReactNode } from 'react';
import clsx from 'clsx';

/** Page container: 80rem base, 88rem on xl screens and up. Gutters 20 / 32 / 48px at base / md / lg. */
export default function Container({ children, className, as: Tag = 'div', id }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'header' | 'footer' | 'main'; id?: string }) {
  return (
    <Tag id={id} className={clsx('mx-auto w-full max-w-page px-5 md:px-8 lg:px-12 xl:max-w-[88rem]', className)}>
      {children}
    </Tag>
  );
}
