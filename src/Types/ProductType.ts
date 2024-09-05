// ProductType.ts

export default interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  priceForSale: number;
  quantity: number;
  categoryID: string;
  fournisseurId: string;
}
