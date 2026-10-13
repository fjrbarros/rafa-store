"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect } from "react";
import { scrollToTop } from "@/lib/scroll";
import { IconButton } from "@/components/atoms/IconButton/IconButton";
import { CartIcon, MenuIcon } from "@/components/atoms/Icons/Icons";
import { NavLink } from "@/components/molecules/NavLink/NavLink";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCatalogSections } from "@/store/selectors";
import {
  closeCartDrawer,
  closeMobileMenu,
  openCartDrawer,
  setHeaderScrolled,
  toggleMobileMenu,
} from "@/store/slices/uiSlice";
import styles from "./Header.module.scss";

export function Header() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    dispatch(closeMobileMenu());
    dispatch(closeCartDrawer());

    if (pathname === "/") {
      event.preventDefault();
      scrollToTop();
    }
  };
  const sections = useAppSelector(selectCatalogSections);
  const cartCount = useAppSelector((s) =>
    s.cart.items.reduce((acc, item) => acc + item.quantity, 0),
  );
  const scrolled = useAppSelector((s) => s.ui.headerScrolled);

  useEffect(() => {
    const onScroll = () => {
      dispatch(setHeaderScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dispatch]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} onClick={handleBrandClick}>
          <span className={styles.brandAccent}>Rafa</span> Store
        </Link>

        <nav className={styles.nav} aria-label="Seções da loja">
          {sections.length === 0 ? (
            <span className={styles.navEmpty}>Cadastre seções no admin</span>
          ) : (
            sections.map((section) => (
              <NavLink key={section.id} sectionId={section.slug} label={section.name} />
            ))
          )}
        </nav>

        <div className={styles.actions}>
          <IconButton
            label="Abrir carrinho"
            badge={cartCount}
            onClick={() => dispatch(openCartDrawer())}
          >
            <CartIcon />
          </IconButton>
          <IconButton
            label="Abrir menu"
            className={styles.menuToggle}
            onClick={() => dispatch(toggleMobileMenu())}
          >
            <MenuIcon />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
