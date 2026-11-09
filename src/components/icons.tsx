import type { NavIcon } from "@/lib/nav";

export function Monogram({ size = 28 }: { size?: number }) {
  return (
    <svg
      className="mark"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      style={{ display: "block", flex: "none" }}
    >
      <rect width="64" height="64" rx="14" fill="var(--tile)" />
      <g
        fill="none"
        stroke="var(--tilefg)"
        strokeWidth="6"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      >
        <path d="M17 14V47H50" />
        <path d="M50 17H37.25A9.75 9.75 0 0 0 37.25 36.5H50" />
      </g>
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
    </svg>
  );
}

const TAB_PATHS: Record<NavIcon, React.ReactNode> = {
  home: <path d="M3 11 12 4l9 7v9h-6v-6H9v6H3z" />,
  projects: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </>
  ),
  links: (
    <path
      strokeLinecap="round"
      d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"
    />
  ),
  freelance: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18" />
    </>
  ),
  experience: <path strokeLinecap="round" d="M6 3v18M6 6h12M6 12h9M6 18h11" />,
};

export function TabIcon({ name }: { name: NavIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      {TAB_PATHS[name]}
    </svg>
  );
}
