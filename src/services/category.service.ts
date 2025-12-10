
import axios, { AxiosError } from "axios";
import { BaseResponse } from "@/types/base-response.type";
import { CategoryResponse } from "@/types/category.type";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/categories`,
  headers: { "Content-Type": "application/json" },
});


export async function getCategories(): Promise<BaseResponse<CategoryResponse[]>> {
  try {
    const res = await api.get("/");
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(error.response?.data?.message || "get Categories failed");
  }
}
