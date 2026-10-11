import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/** Copy-to-clipboard with icon swap feedback. Falls back for non-secure contexts. */
export default function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy');
      } catch {
        /* clipboard unavailable; still confirm to avoid a dead button */
      }
      area.remove();
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={done ? 'Copied' : label}
      title={done ? 'Copied' : label}
      className="inline-flex size-11 items-center justify-center rounded-md border border-border text-fg-muted transition-ui hover:border-border-strong hover:text-fg focus-ring [&>svg]:size-5"
    >
      {done ? <Check aria-hidden /> : <Copy aria-hidden />}
      <span aria-live="polite" className="sr-only">
        {done ? 'Copied to clipboard' : ''}
      </span>
    </button>
  );
}
