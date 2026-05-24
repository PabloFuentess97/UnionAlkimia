import type { BlockType } from "./block-types"

export function getBlockDefaults(type: BlockType): Record<string, unknown> {
  switch (type) {
    case "hero":
      return {
        title: "Tu título aquí",
        subtitle: "Una descripción breve y poderosa",
        ctaText: "Empezar ahora",
        ctaUrl: "#",
        imageUrl: "",
        alignment: "center",
      }
    case "text":
      return {
        content: "Escribe tu contenido aquí...",
        alignment: "left",
      }
    case "image":
      return { url: "", alt: "", caption: "" }
    case "video":
      return { url: "", autoplay: false }
    case "form":
      return {
        fields: [
          { name: "nombre", type: "text", required: true, label: "Nombre" },
          { name: "email", type: "email", required: true, label: "Email" },
        ],
        submitText: "Enviar",
        successMessage: "¡Gracias! Te contactaremos pronto.",
      }
    case "cta":
      return {
        text: "Reserva tu plaza",
        url: "#",
        variant: "primary",
        size: "lg",
      }
    case "testimonial":
      return {
        name: "Nombre del alumno",
        text: "Testimonial aquí...",
        avatar: "",
      }
    case "pricing":
      return {
        title: "Nuestros planes",
        plans: [],
      }
    case "countdown":
      return {
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        label: "Oferta termina en",
      }
    case "divider":
      return { style: "line" }
    case "columns":
      return { columns: 2, content: [[], []] }
    default:
      return {}
  }
}
