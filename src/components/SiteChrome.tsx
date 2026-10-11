import SiteNav, { type NavItem } from './SiteNav';
import SiteFooter, { type FooterColumn } from './SiteFooter';
import { GitHubMark } from './BrandIcons';

/**
 * Composition seam between Astro pages and React islands. Astro cannot pass
 * its own JSX elements as props to framework components, so every JSX prop
 * (action buttons, social icons) is constructed here, in React-land.
 * Callers pass plain data only.
 */

const GITHUB_URL = 'https://github.com/ThanhNguyxnOrg';

function GitHubAction() {
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-md bg-primary-fill px-4 text-body-sm font-semibold text-on-primary transition-ui hover:bg-primary-fill-hover focus-ring"
    >
      <GitHubMark className="size-4" /> GitHub
    </a>
  );
}

/** Interactive header island (mobile menu needs JS). Server-renders its HTML. */
export function SiteHeader({ items }: { items: NavItem[] }) {
  return <SiteNav items={items} action={<GitHubAction />} />;
}

/** Static footer. No client directive: zero JavaScript. */
export function SiteFooterBlock({
  tagline,
  legal,
  columns,
}: {
  tagline: string;
  legal: string;
  columns: FooterColumn[];
}) {
  return (
    <SiteFooter
      tagline={tagline}
      legal={legal}
      columns={columns}
      socials={[{ label: 'GitHub', href: GITHUB_URL, icon: <GitHubMark /> }]}
    />
  );
}
