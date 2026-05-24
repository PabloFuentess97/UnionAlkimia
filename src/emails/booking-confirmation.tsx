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

interface BookingConfirmationProps {
  userName: string
  className: string
  date: string
  time: string
  location?: string
}

export function BookingConfirmation({
  userName,
  className,
  date,
  time,
  location,
}: BookingConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Tu reserva para {className} ha sido confirmada</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reserva confirmada</Heading>
          <Text style={text}>Hola {userName},</Text>
          <Text style={text}>
            Tu reserva ha sido confirmada con exito.
          </Text>
          <Section style={card}>
            <Text style={cardTitle}>{className}</Text>
            <Text style={cardDetail}>{date} a las {time}</Text>
            {location && <Text style={cardDetail}>{location}</Text>}
          </Section>
          <Text style={text}>
            Recuerda llegar 5 minutos antes del inicio de la clase.
          </Text>
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

export default BookingConfirmation
