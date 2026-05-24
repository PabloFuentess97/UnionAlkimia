import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface PaymentSuccessProps {
  userName: string
  amount: string
  description: string
  date: string
}

export function PaymentSuccess({
  userName,
  amount,
  description,
  date,
}: PaymentSuccessProps) {
  return (
    <Html>
      <Head />
      <Preview>Pago de {amount} procesado correctamente</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Pago confirmado</Heading>
          <Text style={text}>Hola {userName},</Text>
          <Text style={text}>Tu pago ha sido procesado con exito.</Text>
          <Section style={card}>
            <Text style={cardTitle}>{description}</Text>
            <Text style={cardDetail}>Monto: {amount}</Text>
            <Text style={cardDetail}>Fecha: {date}</Text>
          </Section>
          <Text style={footer}>Union Alkimia</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" }
const container = { margin: "0 auto", padding: "40px 20px", maxWidth: "560px" }
const h1 = { color: "#1a1a1a", fontSize: "24px", fontWeight: "bold" as const }
const text = { color: "#4a4a4a", fontSize: "16px", lineHeight: "24px" }
const card = { backgroundColor: "#ffffff", borderRadius: "8px", padding: "20px", margin: "20px 0" }
const cardTitle = { fontSize: "18px", fontWeight: "bold" as const, margin: "0 0 8px" }
const cardDetail = { color: "#6a6a6a", fontSize: "14px", margin: "4px 0" }
const footer = { color: "#8a8a8a", fontSize: "12px", marginTop: "40px" }

export default PaymentSuccess
