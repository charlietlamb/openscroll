import { Logo } from "@openscroll/ui/components/brand/logo";
import { cn } from "@openscroll/ui/lib/utils";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <main className="relative flex min-h-screen flex-1 overflow-hidden [--tick-color:color-mix(in_oklab,theme(colors.border)_40%,transparent)]">
        {/* Left tick lines - scroll down */}
        <div
          className="pointer-events-none absolute -top-[10px] -bottom-[10px] left-0 w-1/2 animate-tick-down"
          style={{
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              var(--tick-color) 0px,
              var(--tick-color) 1px,
              transparent 1px,
              transparent 10px
            )`,
          }}
        />
        {/* Right tick lines - scroll up */}
        <div
          className="pointer-events-none absolute -top-[10px] -bottom-[10px] left-1/2 w-1/2 animate-tick-up"
          style={{
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              var(--tick-color) 0px,
              var(--tick-color) 1px,
              transparent 1px,
              transparent 10px
            )`,
          }}
        />

        {/* Content wrapper - centers content */}
        <div className="relative flex flex-1 justify-center">
          <div className="flex w-full max-w-3xl flex-col border-border border-x bg-background">
            {/* Hero content */}
            <section className="flex flex-col items-start gap-6 px-6 py-24">
              <div className="flex items-center gap-3">
                <Logo className="text-foreground" size={28} />
                <span className="text-foreground text-lg tracking-tight">
                  OpenScroll
                </span>
              </div>
              <h1 className="max-w-xl font-semibold text-3xl text-foreground tracking-tighter md:text-4xl">
                Filter your{" "}
                <span className="inline-flex items-baseline gap-1">
                  <XIcon className="relative top-0.5 inline-block" />
                </span>{" "}
                timeline,
                <br />
                <span className="italic">focus on what matters</span>
              </h1>
              <p className="max-w-md text-muted-foreground leading-relaxed">
                A Chrome extension that filters tweets by age and engagement.
                Hide old posts and low engagement content.
              </p>
              <div className="flex gap-4">
                <a
                  className="flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 font-medium text-background text-sm transition-colors hover:bg-foreground/80"
                  href="https://chrome.google.com/webstore"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <ChromeIcon />
                  Add to Chrome
                </a>
                <a
                  className="flex h-11 items-center justify-center gap-2 rounded-full border border-border px-5 font-medium text-foreground text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  href="https://github.com/charlietlamb/openscroll"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <GitHubIcon />
                  View on GitHub
                </a>
              </div>
            </section>

            {/* Features grid */}
            <section className="grid border-border border-b md:grid-cols-3">
              <Feature
                description="Hide tweets older than your preferred threshold"
                index="01"
                title="Filter by age"
              />
              <Feature
                border
                description="Set minimum views, likes, comments, or reposts"
                index="02"
                title="Engagement filters"
              />
              <Feature
                description="Built-in cooldown to prevent excessive scrolling"
                index="03"
                title="Rate limiting"
              />
            </section>

            {/* Footer */}
            <section className="mt-auto flex items-center justify-center gap-1.5 border-border border-t px-6 py-6 pb-10">
              <span className="text-muted-foreground text-sm">Created by</span>
              <a
                className="text-muted-foreground text-sm underline underline-offset-2 transition-colors hover:text-foreground"
                href="https://x.com/charlietlamb"
                rel="noopener noreferrer"
                target="_blank"
              >
                @charlietlamb
              </a>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function Feature({
  title,
  description,
  index,
  border = false,
}: {
  title: string;
  description: string;
  index: string;
  border?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 border-border border-t px-5 py-8",
        border && "md:border-x"
      )}
    >
      <span className="font-mono text-muted-foreground/60 text-xs">
        {index}
      </span>
      <h3 className="font-medium text-foreground text-sm">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
      <div className="mt-1 h-px w-6 bg-border transition-all group-hover:w-12 group-hover:bg-foreground" />
    </div>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-label="X icon"
      className={className}
      fill="currentColor"
      height="28"
      role="img"
      viewBox="0 0 24 24"
      width="28"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ChromeIcon() {
  return (
    <svg
      aria-label="Google Chrome"
      fill="currentColor"
      height="18"
      role="img"
      viewBox="0 0 24 24"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-5.344 9.257c.206.01.413.016.621.016 6.627 0 12-5.373 12-12 0-1.54-.29-3.011-.818-4.364zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-label="GitHub icon"
      fill="currentColor"
      height="18"
      role="img"
      viewBox="0 0 24 24"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
