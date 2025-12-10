import  { AxiosError } from "axios";
import { BaseResponse, ResponseID } from "@/types/base-response.type";

import { axiosInstance } from "@/lib/axios";
import { CheckoutOrderPayload, OrderResponseDTO } from "@/types/order.type";


export async function checkoutOrder(
  body: CheckoutOrderPayload
): Promise<BaseResponse<ResponseID>> {
  try {
    const res = await axiosInstance().post("/orders", body);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(error.response?.data?.message || "checkout order failed");
  }
}
export async function getOrders(
  status?: string
): Promise<BaseResponse<OrderResponseDTO[]>> {
  try {
    const query = new URLSearchParams();

    if (status) {
      query.append("status", status);
    }

    const res = await axiosInstance().get(
      `/orders${query.toString() ? `?${query.toString()}` : ""}`
    );

    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(error.response?.data?.message || "get orders failed");
  }
}
