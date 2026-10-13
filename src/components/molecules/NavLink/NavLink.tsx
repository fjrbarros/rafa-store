"use client";

import { scrollToSection } from "@/lib/scroll";
import { useAppDispatch } from "@/store/hooks";
import { closeMobileMenu } from "@/store/slices/uiSlice";
import styles from "./NavLink.module.scss";

interface NavLinkProps {
  sectionId: string;
  label: string;
}

export function NavLink({ sectionId, label }: NavLinkProps) {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(closeMobileMenu());
    // Aguarda o menu mobile fechar (Safari/iOS) antes de rolar a página.
    window.setTimeout(() => scrollToSection(sectionId), 150);
  };

  return (
    <button type="button" className={styles.link} onClick={handleClick}>
      {label}
    </button>
  );
}
