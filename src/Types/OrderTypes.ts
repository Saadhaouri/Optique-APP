// Types/OrderTypes.ts

export interface Order {
  id: string;
  fournisseurId: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  clientId: string;
  productIds: (string | undefined)[];
}

export interface CreateOrder {
  fournisseurId: string;
  orderDate: Date | null;
  totalAmount: number;
  status: string;
  clientId: string;
  productIds: (string | undefined)[];
}
