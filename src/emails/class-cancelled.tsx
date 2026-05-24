import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components"

interface ClassCancelledProps {
  userName: string
  className: string
  date: string
  time: string
}

export function ClassCancelled({
  userName,
  className,
  date,
  time,
}: ClassCancelledProps) {
  return (
    <Html>
      <Head />
      <Preview>La clase {className} del {date} ha sido cancelada</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Clase cancelada</Heading>
          <Text style={text}>Hola {userName},</Text>
          <Text style={text}>
            Lamentamos informarte que la clase <strong>{className}</strong>{" "}
            programada para el {date} a las {time} ha sido cancelada.
          </Text>
          <Text style={text}>
            Tu reserva ha sido cancelada automaticamente. Puedes reservar otra
            clase desde tu dashboard.
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
const footer = { color: "#8a8a8a", fontSize: "12px", marginTop: "40px" }

export default ClassCancelled
