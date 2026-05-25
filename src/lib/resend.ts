import { Resend } from "resend"

let _resend: Resend | null = null

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

// Backward compat - lazy getter
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    return (getResend() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export const FROM_EMAIL = process.env.FROM_EMAIL || "Union Alkimia <noreply@unionalkimia.com>"
