import { resend, FROM_EMAIL } from "./resend"
import { BookingConfirmation } from "@/emails/booking-confirmation"
import { WelcomeEmail } from "@/emails/welcome"
import { ClassCancelled } from "@/emails/class-cancelled"
import { PaymentSuccess } from "@/emails/payment-success"
import { createElement } from "react"

export async function sendBookingConfirmation(
  to: string,
  data: { userName: string; className: string; date: string; time: string; location?: string }
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Reserva confirmada: ${data.className}`,
    react: createElement(BookingConfirmation, data),
  })
}

export async function sendWelcomeEmail(
  to: string,
  data: { userName: string; organizationName: string }
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Bienvenido a ${data.organizationName}`,
    react: createElement(WelcomeEmail, data),
  })
}

export async function sendClassCancelled(
  to: string,
  data: { userName: string; className: string; date: string; time: string }
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Clase cancelada: ${data.className}`,
    react: createElement(ClassCancelled, data),
  })
}

export async function sendPaymentSuccess(
  to: string,
  data: { userName: string; amount: string; description: string; date: string }
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Pago confirmado",
    react: createElement(PaymentSuccess, data),
  })
}
