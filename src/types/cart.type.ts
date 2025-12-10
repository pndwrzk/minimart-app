export type CartCountResponse = {
    total_items   : number
};


export type AddTocartPayload = {
    product_id : number;
};


export interface CartItemDTO {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  image_path: string;
  total_price: number;
}


export interface CartDataDto {
  items: CartItemDTO[];
  sub_total: number;
}

