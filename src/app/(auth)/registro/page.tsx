import { RegisterForm } from "@/modules/auth/components/register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Crear cuenta",
}

export default function RegisterPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Crear cuenta</h2>
      <RegisterForm />
    </div>
  )
}
