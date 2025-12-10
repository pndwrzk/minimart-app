"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useCustomer";
import { LoginPayload } from "@/types/customer.type";
import { saveTokenData } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";

const LoginPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { doLogin, loading } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>();

  const onSubmit = async (data: LoginPayload) => {
    try {
      const payload: LoginPayload = {
        email: data.email,
        password: data.password,
      };
      const result = await doLogin(payload);

      saveTokenData({
        access_token: result.data.access_token,
        refresh_token: result.data.refresh_token,
        access_token_expires_at: result.data.access_token_expires_at,
        refresh_token_expires_at: result.data.refresh_token_expires_at,
      });

      toast({
        title: "Login Success",
        description: result.message,
      });

      router.push("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast({
        title: "Login failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white text-black p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Minimart Login
        </h1>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border border-gray-300 bg-white text-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full border border-gray-300 bg-white text-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full cursor-pointer py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          } transition-colors`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="underline text-black">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
