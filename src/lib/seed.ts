import type { CatalogState } from "@/types/catalog";

export const defaultCatalog: CatalogState = {
  sections: [
    { id: "sec-biquinis", name: "Biquínis", slug: "biquinis" },
    { id: "sec-saias", name: "Saias", slug: "saias" },
    { id: "sec-vestidos", name: "Vestidos", slug: "vestidos" },
    { id: "sec-blusas", name: "Blusas", slug: "blusas" },
  ],
  products: [
    {
      id: "prod-1",
      sectionId: "sec-biquinis",
      title: "Biquíni Canelado Rosa",
      description:
        "Modelagem confortável com bojo removível. Tecido canelado macio, ideal para dias ensolarados à beira-mar.",
      price: 129.9,
      images: ["/images/seed/biquini-rosa.svg", "/images/seed/biquini-rosa-alt.svg"],
    },
    {
      id: "prod-2",
      sectionId: "sec-biquinis",
      title: "Biquíni Floral Delicado",
      description:
        "Estampa floral feminina com amarração ajustável. Secagem rápida e caimento impecável.",
      price: 149.9,
      images: ["/images/seed/biquini-floral.svg"],
    },
    {
      id: "prod-3",
      sectionId: "sec-saias",
      title: "Saia Midi Plissada",
      description:
        "Saia plissada com cintura alta. Combina com cropped e sandálias para um look leve e elegante.",
      price: 119.9,
      images: ["/images/seed/saia-midi.svg"],
    },
    {
      id: "prod-4",
      sectionId: "sec-saias",
      title: "Saia Jeans Curta",
      description:
        "Jeans com lavagem clara e barra desfiada. Peça coringa para o guarda-roupa de verão.",
      price: 99.9,
      images: ["/images/seed/saia-jeans.svg"],
    },
    {
      id: "prod-5",
      sectionId: "sec-vestidos",
      title: "Vestido Longo Fluido",
      description:
        "Vestido longo em viscose com decote suave. Movimento leve para ocasiões especiais.",
      price: 189.9,
      images: ["/images/seed/vestido-longo.svg"],
    },
    {
      id: "prod-6",
      sectionId: "sec-blusas",
      title: "Blusa Cropped Renda",
      description: "Detalhe em renda nas mangas. Tom suave que valoriza qualquer produção.",
      price: 79.9,
      images: ["/images/seed/blusa-renda.svg"],
    },
  ],
};
