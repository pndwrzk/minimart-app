
import axios, { AxiosError } from "axios";
import { BaseResponse } from "@/types/base-response.type";
import { ProductResponse,GetProductsParams } from "@/types/product.type";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/products`,
  headers: { "Content-Type": "application/json" },
});


export async function getProducts(params?: GetProductsParams): Promise<BaseResponse<ProductResponse[]>> {
  try {
    const query = new URLSearchParams();

    if (params?.search) query.append("search", params.search);
    if (params?.category) query.append("category_id", String(params.category));
    if (params?.sortBy) query.append("sort_by", params.sortBy);
    if (params?.orderBy) query.append("order_by", params.orderBy);
    if (params?.minPrice !== undefined) query.append("from_price", String(params.minPrice));
    if (params?.maxPrice !== undefined) query.append("to_price", String(params.maxPrice));
    if (params?.page) query.append("page", String(params.page));
    if (params?.pageSize) query.append("page_size", String(params.pageSize));

    const queryString = query.toString();
    const url = queryString ? `/?${queryString}` : "/";

    const res = await api.get(url);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(error.response?.data?.message || "get Products failed");
  }
}
