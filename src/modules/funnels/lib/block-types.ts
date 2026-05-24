export type BlockType =
  | "hero"
  | "text"
  | "image"
  | "video"
  | "form"
  | "cta"
  | "testimonial"
  | "pricing"
  | "countdown"
  | "divider"
  | "columns"

export interface Block {
  id: string
  type: BlockType
  props: Record<string, unknown>
}

export interface HeroBlockProps {
  title: string
  subtitle: string
  ctaText: string
  ctaUrl: string
  imageUrl: string
  alignment: "left" | "center" | "right"
}

export interface TextBlockProps {
  content: string
  alignment: "left" | "center" | "right"
}

export interface ImageBlockProps {
  url: string
  alt: string
  caption: string
}

export interface FormBlockProps {
  fields: Array<{ name: string; type: string; required: boolean; label: string }>
  submitText: string
  successMessage: string
}

export interface CtaBlockProps {
  text: string
  url: string
  variant: "primary" | "secondary" | "outline"
  size: "sm" | "md" | "lg"
}

export interface VideoBlockProps {
  url: string
  autoplay: boolean
}

export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: "Hero",
  text: "Texto",
  image: "Imagen",
  video: "Vídeo",
  form: "Formulario",
  cta: "Botón CTA",
  testimonial: "Testimonio",
  pricing: "Precios",
  countdown: "Cuenta atrás",
  divider: "Separador",
  columns: "Columnas",
}
