"use client";

import { createPortal } from "react-dom";
import { CloseIcon } from "@/components/atoms/Icons/Icons";
import { NavLink } from "@/components/molecules/NavLink/NavLink";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCatalogSections } from "@/store/selectors";
import { closeMobileMenu } from "@/store/slices/uiSlice";
import styles from "./MobileMenu.module.scss";

export function MobileMenu() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.mobileMenuOpen);
  const sections = useAppSelector(selectCatalogSections);

  useBodyScrollLock(open);

  if (!open) return null;

  const menu = (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        className={styles.backdrop}
        onClick={() => dispatch(closeMobileMenu())}
        aria-label="Fechar menu"
      />
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.title}>Menu</span>
          <button
            type="button"
            className={styles.close}
            onClick={() => dispatch(closeMobileMenu())}
            aria-label="Fechar"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className={styles.links}>
          {sections.length === 0 ? (
            <p className={styles.empty}>Nenhuma seção cadastrada.</p>
          ) : (
            sections.map((section) => (
              <NavLink key={section.id} sectionId={section.slug} label={section.name} />
            ))
          )}
        </nav>
      </div>
    </div>
  );

  return createPortal(menu, document.body);
}
