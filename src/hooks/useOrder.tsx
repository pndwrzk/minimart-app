"use client";

import { useState } from "react";
import { checkoutOrder, getOrders } from "@/services/order.service";
import {
  CheckoutOrderPayload,
  OrderResponseDTO,
} from "@/types/order.type";
import { BaseResponse, ResponseID } from "@/types/base-response.type";
import { AxiosError } from "axios";

export function useOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (
    payload: CheckoutOrderPayload
  ): Promise<BaseResponse<ResponseID>> => {
    try {
      setLoading(true);
      setError(null);

      return await checkoutOrder(payload);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message =
        error.response?.data?.message || "Checkout order failed";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (
    status?: string
  ): Promise<BaseResponse<OrderResponseDTO[]>> => {
    try {
      setLoading(true);
      setError(null);

      return await getOrders(status);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message =
        error.response?.data?.message || "Get orders failed";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    checkout,
    fetchOrders,
    loading,
    error,
  };
}
