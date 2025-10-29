export interface Product {
  id: number;
  name: string;
  description: string;
  classification: string;
  price: number;
  stock: number;
  imageUrl?: string;
}
