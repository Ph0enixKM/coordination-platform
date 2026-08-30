import styles from "./CtaButton.module.css";

type CtaButtonProps = {
  children: React.ReactNode;
  /** With a href the slab is a link, without one it is a form button. */
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export default function CtaButton({
  children,
  href,
  type = "button",
  disabled,
  onClick,
}: CtaButtonProps) {
  const label = <span className={styles.label}>{children}</span>;

  if (href) {
    return (
      <a className={styles.cta} href={href}>
        {label}
      </a>
    );
  }

  return (
    <button className={styles.cta} type={type} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}
