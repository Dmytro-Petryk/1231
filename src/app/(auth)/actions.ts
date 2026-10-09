"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { safeCallbackUrl } from "@/lib/auth-helpers";

type AuthState = { error?: string } | undefined;

const userSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(72),
  name: z.string().trim().min(1).max(80).optional(),
});

export async function loginAction(_previousState: AuthState, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = safeCallbackUrl(String(formData.get("callbackUrl") ?? "/"));

  try {
    await signIn("credentials", { email, password, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "That email and password combination wasn’t recognized." };
    }
    throw error;
  }
}

export async function signupAction(_previousState: AuthState, formData: FormData) {
  const parsed = userSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  });
  const callbackUrl = safeCallbackUrl(String(formData.get("callbackUrl") ?? "/"));

  if (!parsed.success) {
    return { error: "Enter a valid email and a password of at least 8 characters." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existingUser) return { error: "An account with that email already exists. Sign in instead." };

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: await bcrypt.hash(parsed.data.password, 12),
    },
  });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Your account was created, but sign-in failed. Please sign in." };
    }
    throw error;
  }
}
