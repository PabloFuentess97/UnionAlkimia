"use server"

import { signIn } from "@/lib/auth"
import { loginSchema } from "@/lib/validators"
import type { ActionResult } from "@/types"
import { AuthError } from "next-auth"

export async function loginUser(
  input: unknown
): Promise<ActionResult<{ redirectTo: string }>> {
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { email, password } = parsed.data

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return { success: true, data: { redirectTo: "/dashboard" } }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Email o contraseña incorrectos" }
    }
    return { success: false, error: "Error al iniciar sesión" }
  }
}
