import { Button, CTASection, GitHubMark } from '../components';
import { ArrowRight } from 'lucide-react';

/** Closing band: support tiers plus the two actions that matter. One per page. */
export default function CTA() {
  return (
    <div className="mx-auto w-full max-w-page px-5 py-20 md:px-8 md:py-28 lg:px-12">
      <CTASection
        title="Use it. Fork it. Make it better."
        description="Personal workspace, best effort. Active work gets priority review; archives may not update. Start with an issue."
        actions={
          <>
            <Button size="lg" href="https://github.com/ThanhNguyxnOrg/.github/issues" target="_blank" rel="noopener noreferrer" iconEnd={<ArrowRight />}>
              Open an issue
            </Button>
            <Button size="lg" variant="ghost" href="https://github.com/ThanhNguyxnOrg" target="_blank" rel="noopener noreferrer" iconStart={<GitHubMark className="size-4" />}>
              Follow on GitHub
            </Button>
            <Button size="lg" variant="ghost" href="#archive">
              Browse the index
            </Button>
          </>
        }
      />
    </div>
  );
}
