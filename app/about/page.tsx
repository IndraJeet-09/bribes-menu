import Link from "next/link";
import { ArrowLeft, ShieldAlert, BookOpen, Compass, Scale } from "lucide-react";

export const metadata = {
  title: "About & Methodology | The Unofficial Fine Menu",
  description:
    "The philosophy, methodology, and context behind The Unofficial Fine Menu — a modern, satirical, crowdsourced index of reported informal costs in India.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Navigation */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>BACK TO HOME</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="space-y-4 pb-8 border-b border-border">
        <div className="font-mono text-xs uppercase tracking-widest text-muted">
          CONTEXT & PHILOSOPHY
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
          "You know what you did.
          <br />
          We know what people say it costs."
        </h1>
        <p className="font-sans text-lg text-muted max-w-xl">
          An internet culture project cataloguing the informal economy of Indian roadside negotiations and desk-to-desk paperwork.
        </p>
      </div>

      {/* Editorial Content Blocks */}
      <div className="space-y-10 font-sans text-muted-dark leading-relaxed">
        {/* Section 1: The Premise */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            1. Why This Exists
          </h2>
          <p>
            Every resident in India who has driven a scooter, transferred a vehicle registration, registered a tenancy deed, or held a wedding after 10:00 PM knows the disparity between statutory gazettes and street reality.
          </p>
          <p>
            Official fine charts exist on government transport portals. But what happens in reality when someone forgets their helmet at 9:00 PM in Connaught Place, Koramangala, or Gomti Nagar?
          </p>
          <p>
            <strong>The Unofficial Fine Menu</strong> exists as an artistic and comedic mirror to document this unspoken, hyper-localized pricing system that everyone knows, nobody officially publishes, and everyone ends up debating with two hands behind their back.
          </p>
        </section>

        {/* Section 2: Methodology */}
        <section className="space-y-3 pt-6 border-t border-border/60">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            2. Data & Methodology
          </h2>
          <p>
            The numbers displayed across this index are calculated through:
          </p>
          <ul className="list-disc pl-5 space-y-2 font-sans text-sm">
            <li>
              <strong>Crowdsourced Anecdotes:</strong> Discussions across Indian regional forums, Reddit communities (r/india, r/bangalore, r/delhi, r/mumbai), and direct public submissions.
            </li>
            <li>
              <strong>Documented Journalism:</strong> Investigation reports and survey figures published by transparency non-profits and investigative media.
            </li>
            <li>
              <strong>Normalization & Outlier Rejection:</strong> Extreme outliers (e.g., zero-cost warnings or astronomical claims) are trimmed to establish a realistic <em>Typical Reported</em> median alongside minimum and maximum boundaries.
            </li>
          </ul>
        </section>

        {/* Section 3: Legal & Ethical Clarity */}
        <section className="space-y-3 pt-6 border-t border-border/60">
          <div className="flex items-center gap-2 text-foreground">
            <Scale className="h-5 w-5" />
            <h2 className="font-serif text-2xl font-bold">
              3. Legal & Entertainment Disclaimer
            </h2>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <p className="font-mono text-xs leading-relaxed text-muted-dark">
              This website is created purely for educational, comedic, and cultural commentary. 
              Nothing on this website constitutes legal counsel, statutory advisory, or an encouragement to solicit, offer, or accept a bribe.
            </p>
            <p className="font-mono text-xs leading-relaxed text-muted-dark">
              Bribery is an offence under the Prevention of Corruption Act, 1988 in India. Always demand an official e-challan or printed receipt and adhere to legitimate dispute mechanisms.
            </p>
          </div>
        </section>

        {/* Section 4: What's Next */}
        <section className="space-y-3 pt-6 border-t border-border/60">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            4. Architecture & Future Roadmap
          </h2>
          <p>
            This first edition is designed to be lightweight, instant, and static. In upcoming editions, we plan to introduce verified city-by-city breakdown heatmaps, historical inflation indexers for fines, and anonymous verification mechanisms.
          </p>
        </section>
      </div>

      {/* CTA Box */}
      <div className="rounded-xl border border-foreground bg-foreground text-background p-6 sm:p-8 text-center space-y-3">
        <h3 className="font-serif text-2xl font-bold">
          Explore the Menu
        </h3>
        <p className="font-sans text-xs sm:text-sm text-neutral-300 max-w-md mx-auto">
          Start typing any violation or browse all 25 categories to see what people are saying across the country.
        </p>
        <div className="pt-2">
          <Link
            href="/browse"
            className="inline-block font-mono text-xs px-5 py-2.5 rounded bg-background text-foreground font-semibold hover:bg-neutral-200 transition-colors"
          >
            BROWSE FULL DIRECTORY
          </Link>
        </div>
      </div>
    </div>
  );
}
