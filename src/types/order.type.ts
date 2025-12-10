import { Product } from "@/components/ProductCard";

export type CheckoutOrderPayload = {
   cart_ids: number[]; 
};

export type OrderResponseDTO = {
  id: number;
  customer_id: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  status: string;
  items: OrderItemDTO[];
}

export type OrderItemDTO ={
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}
