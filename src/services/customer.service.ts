
import axios, { AxiosError } from "axios";
import { BaseResponse, ResponseID } from "@/types/base-response.type";
import { LoginData, LoginPayload, RegisterPayload } from "@/types/customer.type";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/customers`,
  headers: { "Content-Type": "application/json" },
});


export async function login(body :LoginPayload): Promise<BaseResponse<LoginData>> {
  try {
    const res = await api.post("/login", body);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(error.response?.data?.message || "get Categories failed");
  }
}

export async function register(body: RegisterPayload): Promise<BaseResponse<ResponseID>> {
  try {
    const res = await api.post("/register", body);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(error.response?.data?.message || "get Categories failed");
  }
}