export type DCreatedProductType = {
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  id: number;
};
export type DUpdatedProductType = {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
};
