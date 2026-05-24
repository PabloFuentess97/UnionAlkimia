import { LoginForm } from "@/modules/auth/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar sesión",
}

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Iniciar sesión</h2>
      <LoginForm />
    </div>
  )
}
