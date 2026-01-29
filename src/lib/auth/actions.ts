"use server";

import { cookies } from "next/headers";
import { api } from "@/lib/api/client";
import { LoginSchema } from "./schema";
import { redirect } from "next/navigation";

export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
} | null;

export async function loginAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData);
  const validated = LoginSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
    };
  }

  const { email, password } = validated.data;
  const isDevelopment = process.env.NODE_ENV === "development";

  try {
    // const response = await api.post<{ token: string }>(
    //   "/auth/login",
    //   validated.data,
    // );

    if (
      isDevelopment &&
      email === "admin@example.com" &&
      password === "Password123@"
    ) {
      const cookieStore = await cookies();
      cookieStore.set("session_token", "mock-dev-token-123", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      });
      return { success: true };
    }
    return {
      message: "Use email: admin@example.com and password: password123",
    };
  } catch (err) {
    return { message: "Invalid email or password." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");

  redirect("/login");
}
