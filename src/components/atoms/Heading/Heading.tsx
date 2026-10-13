import type { ReactNode } from "react";
import styles from "./Heading.module.scss";

type HeadingLevel = "h1" | "h2" | "h3";

interface HeadingProps {
  as?: HeadingLevel;
  children: ReactNode;
  className?: string;
}

export function Heading({ as = "h2", children, className = "" }: HeadingProps) {
  const Tag = as;
  return <Tag className={`${styles[as]} ${className}`}>{children}</Tag>;
}
