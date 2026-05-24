import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components"

interface WelcomeEmailProps {
  userName: string
  organizationName: string
}

export function WelcomeEmail({ userName, organizationName }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenido a {organizationName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Bienvenido!</Heading>
          <Text style={text}>Hola {userName},</Text>
          <Text style={text}>
            Tu cuenta en {organizationName} ha sido creada con exito. Ya puedes
            explorar los horarios, reservar clases y unirte a la comunidad.
          </Text>
          <Text style={text}>Namaste.</Text>
          <Text style={footer}>{organizationName}</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" }
const container = { margin: "0 auto", padding: "40px 20px", maxWidth: "560px" }
const h1 = { color: "#1a1a1a", fontSize: "24px", fontWeight: "bold" as const }
const text = { color: "#4a4a4a", fontSize: "16px", lineHeight: "24px" }
const footer = { color: "#8a8a8a", fontSize: "12px", marginTop: "40px" }

export default WelcomeEmail
