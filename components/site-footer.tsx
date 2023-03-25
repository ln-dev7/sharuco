export function SiteFooter() {
  return (
    <footer className="container">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-t-slate-200 py-10 dark:border-t-slate-700 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          <p className="text-center text-sm leading-loose text-slate-600 dark:text-slate-400 md:text-left">
            Built by{" "}
            <a
              href="https://twitter.com/ln_dev7"
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline underline-offset-4"
            >
              LN
            </a>
            {"  "}
            🇨🇲 | Using{" "}
            <a
              href="https://ui.shadcn.com/"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              shadcn/ui
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
