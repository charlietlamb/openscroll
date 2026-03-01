import { Logo } from "@openscroll/ui/components/brand/logo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans dark:bg-zinc-950">
      <main className="flex min-h-screen flex-1">
        {/* Left gutter with ticks */}
        <BorderLine position="left" />

        {/* Left spacing */}
        <div className="hidden w-6 flex-shrink-0 border-zinc-200 border-x md:block dark:border-zinc-800" />

        {/* Content */}
        <div className="w-full max-w-3xl">
          {/* Hero content */}
          <section className="flex flex-col items-start gap-6 border-zinc-200 border-b px-6 py-24 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <Logo className="text-zinc-900 dark:text-zinc-50" size={32} />
              <span className="font-semibold text-xl text-zinc-900 dark:text-zinc-50">
                OpenScroll
              </span>
            </div>
            <h1 className="max-w-xl font-semibold text-3xl text-zinc-900 tracking-tight md:text-4xl dark:text-zinc-50">
              Filter your{" "}
              <span className="inline-flex items-baseline gap-1">
                <XIcon className="relative top-0.5 inline-block" />
              </span>{" "}
              timeline,
              <br />
              <span className="italic">focus on what matters</span>
            </h1>
            <p className="max-w-md text-zinc-600 leading-relaxed dark:text-zinc-400">
              A Chrome extension that filters tweets by age and engagement. Hide
              old posts and low engagement content.
            </p>
            <div className="flex gap-4">
              <a
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 font-medium text-sm text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                href="https://chrome.google.com/webstore"
                rel="noopener noreferrer"
                target="_blank"
              >
                <ChromeIcon />
                Add to Chrome
              </a>
              <a
                className="flex h-11 items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 font-medium text-sm text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900"
                href="https://github.com/charlielamb/openscroll"
                rel="noopener noreferrer"
                target="_blank"
              >
                <GitHubIcon />
                View on GitHub
              </a>
            </div>
          </section>

          {/* Features grid */}
          <section className="grid border-zinc-200 border-b md:grid-cols-3 dark:border-zinc-800">
            <Feature
              description="Hide tweets older than your preferred threshold"
              title="Filter by age"
            />
            <Feature
              className="border-zinc-200 border-x dark:border-zinc-800"
              description="Set minimum views, likes, comments, or reposts"
              title="Engagement filters"
            />
            <Feature
              description="Built-in cooldown to prevent excessive scrolling"
              title="Rate limiting"
            />
          </section>

          {/* Bottom section */}
          <section className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2 px-6 py-10">
            <p className="text-sm text-zinc-500">Open source</p>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <p className="text-sm text-zinc-500">Works on x.com</p>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <p className="text-sm text-zinc-500">No data collection</p>
          </section>
        </div>

        {/* Right spacing */}
        <div className="hidden w-6 flex-shrink-0 border-zinc-200 border-x md:block dark:border-zinc-800" />

        {/* Right gutter with ticks */}
        <BorderLine position="right" />
      </main>
    </div>
  );
}

function BorderLine(_props: { position: "left" | "right" }) {
  return (
    <div className="relative hidden w-12 flex-shrink-0 [--tick-color:theme(colors.zinc.200)] md:block dark:[--tick-color:theme(colors.zinc.800)]">
      {/* Tick marks filling the gutter */}
      <div
        className="absolute top-0 right-0 bottom-0 left-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            var(--tick-color) 0px,
            var(--tick-color) 1px,
            transparent 1px,
            transparent 10px
          )`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "repeat-y",
        }}
      />
    </div>
  );
}

function Feature({
  title,
  description,
  className = "",
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 px-5 py-6 ${className}`}>
      <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <p className="text-sm text-zinc-600 leading-relaxed dark:text-zinc-400">
        {description}
      </p>
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
