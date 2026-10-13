import { Heading } from "@/components/atoms/Heading/Heading";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.tag}>Moda feminina</p>
        <Heading as="h1">Elegância leve para todos os seus dias</Heading>
        <p className={styles.text}>
          Descubra biquínis, vestidos, saias e blusas com um toque delicado. Navegue pelas seções e
          monte seu look favorito.
        </p>
      </div>
      <div className={styles.decor} aria-hidden="true" />
    </section>
  );
}
