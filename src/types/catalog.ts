export interface Product {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  price: number;
  images: string[];
}

export interface Section {
  id: string;
  name: string;
  slug: string;
}

export interface CatalogState {
  sections: Section[];
  products: Product[];
}
