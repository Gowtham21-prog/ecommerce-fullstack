// A small hand-picked icon set as inline SVG so the project has zero
// external icon-library dependency. Each icon inherits currentColor.

const paths = {
  bag: (
    <path d="M6 7h12l1 13H5L6 7zM9 7a3 3 0 0 1 6 0" fill="none" strokeWidth="1.6" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" fill="none" strokeWidth="1.6" />
      <path d="M20 20l-4.5-4.5" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  menu: (
    <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="1.6" strokeLinecap="round" />
  ),
  close: (
    <path
      d="M6 6l12 12M18 6L6 18"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  ),
  chevronRight: <path d="M9 6l6 6-6 6" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  chevronLeft: <path d="M15 6l-6 6 6 6" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  chevronDown: <path d="M6 9l6 6 6-6" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  star: (
    <path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17.1l-5.9 3.4 1.3-6.6-4.9-4.6 6.6-.7L12 2.5z" strokeWidth="1" />
  ),
  starOutline: (
    <path
      d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17.1l-5.9 3.4 1.3-6.6-4.9-4.6 6.6-.7L12 2.5z"
      fill="none"
      strokeWidth="1.4"
    />
  ),
  trash: (
    <path
      d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0-.8 12.2A2 2 0 0 1 15.2 21H8.8a2 2 0 0 1-2-1.8L6 7"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  plus: <path d="M12 5v14M5 12h14" strokeWidth="1.6" strokeLinecap="round" />,
  minus: <path d="M5 12h14" strokeWidth="1.6" strokeLinecap="round" />,
  check: (
    <path d="M5 13l4 4L19 7" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  ),
  arrowUpRight: (
    <path d="M7 17L17 7M9 7h8v8" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  filter: (
    <path d="M4 6h16M7 12h10M10 18h4" strokeWidth="1.6" strokeLinecap="round" />
  ),
  truck: (
    <path
      d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM6.5 19a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM17.5 19a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z"
      fill="none"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  ),
  shield: (
    <path
      d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
      fill="none"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  ),
  leaf: (
    <path
      d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14zM5 19c0-4 2-7 5-9"
      fill="none"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  heart: (
    <path
      d="M12 20.5s-7.5-4.6-10-9.3C.5 8 2.2 4.5 5.7 4.1c2-.2 3.8.8 4.9 2.3l1.4 1.9 1.4-1.9c1.1-1.5 2.9-2.5 4.9-2.3 3.5.4 5.2 3.9 3.7 7.1-2.5 4.7-10 9.3-10 9.3z"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  ),
  heartOutline: (
    <path
      d="M12 20.5s-7.5-4.6-10-9.3C.5 8 2.2 4.5 5.7 4.1c2-.2 3.8.8 4.9 2.3l1.4 1.9 1.4-1.9c1.1-1.5 2.9-2.5 4.9-2.3 3.5.4 5.2 3.9 3.7 7.1-2.5 4.7-10 9.3-10 9.3z"
      fill="none"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" fill="none" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3.4" fill="none" strokeWidth="1.4" />
      <circle cx="16.6" cy="7.4" r="0.9" />
    </>
  ),
  pinterest: (
    <path
      d="M9 20c.6-1.6 1.4-4.2 1.7-5.5m0 0c-.4-.8-.6-2 .1-3.2.9-1.5 3-1.6 3.6.2.5 1.4-.4 3.4-1.8 3.7-1 .2-1.9-.6-1.9-1.6M12 4a8 8 0 0 0-2.9 15.5"
      fill="none"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" fill="none" strokeWidth="1.5" />
      <path d="M4.5 20c1.4-3.6 4.3-5.6 7.5-5.6s6.1 2 7.5 5.6" fill="none" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
}

export default function Icon({ name, size = 20, className = '', ...rest }) {
  const path = paths[name]
  if (!path) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {path}
    </svg>
  )
}
