import { Heading } from "@/components/atoms/Heading/Heading";
import { ProductCard } from "@/components/molecules/ProductCard/ProductCard";
import type { Product, Section } from "@/types/catalog";
import styles from "./ProductSection.module.scss";

interface ProductSectionProps {
  section: Section;
  products: Product[];
}

export function ProductSection({ section, products }: ProductSectionProps) {
  return (
    <section id={section.slug} className={styles.section}>
      <div className={styles.header}>
        <Heading as="h2">{section.name}</Heading>
        <p className={styles.subtitle}>Peças selecionadas com carinho para você</p>
      </div>
      {products.length === 0 ? (
        <p className={styles.empty}>Novidades em breve nesta seção.</p>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
