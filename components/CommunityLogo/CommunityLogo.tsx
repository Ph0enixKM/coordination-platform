/**
 * The mark of the "Strategicznie o firmie" community: a red S of thick
 * strokes, its lower bend sharpened into an arrow pointing right, and a white
 * slash running parallel to the arrow's foot. Redrawn as a vector from the
 * group's Facebook banner.
 */
export default function CommunityLogo({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 520 624"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path
        fill="#e30b17"
        d="M0 70 A70 70 0 0 1 70 0 H475 V117 H165 A45 45 0 0 0 165 207 H335 L490 375 Q514 401 491 428 L325 622 H205 L373 427 L275 327 H70 A70 70 0 0 1 0 257 Z"
      />
      <path fill="#fff" d="M128 419 H310 L135 622 H0 L146 452 Z" />
    </svg>
  );
}
