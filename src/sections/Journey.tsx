import { Reveal, SectionHeader, Timeline, TimelineItem } from '../components';
import TimelineBeam from './TimelineBeam';

export type JourneyStop = {
  date: string;
  title: string;
  description: string;
  tags?: string[];
  current?: boolean;
};

/** Second-life journey: dated stops, oldest first. Dates are the sequence. */
export default function Journey({ stops }: { stops: JourneyStop[] }) {
  return (
    <section id="journey" aria-labelledby="journey-title" className="scroll-mt-20 border-t border-border">
      <div className="relative mx-auto w-full max-w-page px-5 py-20 md:px-8 md:py-28 lg:px-12">
        <TimelineBeam />
        <SectionHeader
          title={<span id="journey-title">Second lives.</span>}
          description="Where each project came from, and what it became. Thin histories stay thin: nothing here is invented."
        />
        <Reveal className="mt-14 max-w-reading">
          <Timeline>
            {stops.map((s) => (
              <div data-reveal key={`${s.date}-${s.title}`}>
                <TimelineItem date={s.date} title={s.title} description={s.description} tags={s.tags} current={s.current} />
              </div>
            ))}
          </Timeline>
        </Reveal>
      </div>
    </section>
  );
}
