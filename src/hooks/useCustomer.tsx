
import { useState } from "react";
import { login, register } from "@/services/customer.service";
import { LoginPayload, RegisterPayload } from "@/types/customer.type";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doLogin = async (body: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(body);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { doLogin, loading, error };
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doRegister = async (body: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register(body);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { doRegister, loading, error };
}
