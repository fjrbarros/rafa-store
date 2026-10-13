"use client";

import { CartDrawer } from "@/components/organisms/CartDrawer/CartDrawer";
import { Header } from "@/components/organisms/Header/Header";
import { Hero } from "@/components/organisms/Hero/Hero";
import { MobileMenu } from "@/components/organisms/MobileMenu/MobileMenu";
import { ProductSection } from "@/components/organisms/ProductSection/ProductSection";
import { useAppSelector } from "@/store/hooks";
import { selectCatalogSections } from "@/store/selectors";
import styles from "./StoreTemplate.module.scss";

export function StoreTemplate() {
  const sections = useAppSelector(selectCatalogSections);
  const products = useAppSelector((s) => s.catalog.products);

  return (
    <div className={styles.page}>
      <Header />
      <MobileMenu />
      <CartDrawer />
      <main>
        <Hero />
        <div className={styles.sections}>
          {sections.map((section) => (
            <ProductSection
              key={section.id}
              section={section}
              products={products.filter((p) => p.sectionId === section.id)}
            />
          ))}
        </div>
        <footer className={styles.footer}>
          <p>Rafa Store — Moda feminina com delicadeza</p>
        </footer>
      </main>
    </div>
  );
}
