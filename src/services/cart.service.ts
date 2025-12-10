import { axiosInstance } from "@/lib/axios";
import { BaseResponse, ResponseID } from "@/types/base-response.type";
import { AddTocartPayload, CartCountResponse, CartDataDto } from "@/types/cart.type";


export async function getCartCount(): Promise<CartCountResponse> {
  try {
    const res = await axiosInstance().get("/cart/count");
    return res.data.data;
  } catch (err) {
    const error = err as any;
    throw new Error(error.response?.data?.message || "get Cart Count failed");
  }
}

export async function addToCart(body: AddTocartPayload): Promise<BaseResponse<ResponseID>> {
  try {
   const res = await axiosInstance().post("/cart", body);
    return res.data;
  } catch (err) {
    const error = err as any;
    throw new Error(error.response?.data?.message || "Add to Cart failed");
  }
}

export async function getCart(): Promise<CartDataDto> {
  try {
    const res = await axiosInstance().get("/cart");
    return res.data.data;
  } catch (err) {
    const error = err as any;
    throw new Error(error.response?.data?.message || "Add to Cart failed");
  }
}
