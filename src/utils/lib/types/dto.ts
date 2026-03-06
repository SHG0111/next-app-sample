export type DCreatedProductType = {
  title: string;
  description: string;
  price: number;
  category: string;
  image: File;
  id: number;
};
export type DUpdatedProductType = {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: File;
};
