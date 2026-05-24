"use client"

import type { Block } from "../../lib/block-types"

interface BlockRendererProps {
  block: Block
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case "hero": {
      const { title, subtitle, ctaText, ctaUrl, alignment } = block.props as Record<string, string>
      return (
        <section className="py-16 px-4 text-center">
          <div className={`max-w-3xl mx-auto ${alignment === "left" ? "text-left" : alignment === "right" ? "text-right" : "text-center"}`}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {title as string}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{subtitle as string}</p>
            {ctaText && (
              <a
                href={ctaUrl as string}
                className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {ctaText as string}
              </a>
            )}
          </div>
        </section>
      )
    }

    case "text": {
      const { content, alignment } = block.props as Record<string, string>
      return (
        <section className={`py-8 px-4 max-w-3xl mx-auto ${alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left"}`}>
          <div className="prose prose-sm max-w-none">
            <p>{content as string}</p>
          </div>
        </section>
      )
    }

    case "cta": {
      const { text, url, variant, size } = block.props as Record<string, string>
      const sizeClass = size === "lg" ? "px-8 py-3 text-base" : size === "sm" ? "px-4 py-1.5 text-xs" : "px-6 py-2 text-sm"
      const variantClass =
        variant === "secondary"
          ? "bg-secondary text-secondary-foreground"
          : variant === "outline"
          ? "border border-primary text-primary"
          : "bg-primary text-primary-foreground"

      return (
        <section className="py-6 px-4 text-center">
          <a
            href={url as string}
            className={`inline-block rounded-lg font-medium ${sizeClass} ${variantClass}`}
          >
            {text as string}
          </a>
        </section>
      )
    }

    case "image": {
      const { url, alt, caption } = block.props as Record<string, string>
      return (
        <section className="py-8 px-4 max-w-4xl mx-auto">
          {url ? (
            <figure>
              <img src={url as string} alt={(alt as string) || ""} className="w-full rounded-lg" />
              {caption && (
                <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                  {caption as string}
                </figcaption>
              )}
            </figure>
          ) : (
            <div className="h-48 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
              Imagen
            </div>
          )}
        </section>
      )
    }

    case "divider":
      return <hr className="my-8 border-border" />

    case "testimonial": {
      const { name, text: testimonialText } = block.props as Record<string, string>
      return (
        <section className="py-8 px-4 max-w-2xl mx-auto text-center">
          <blockquote className="text-lg italic text-muted-foreground">
            &ldquo;{testimonialText as string}&rdquo;
          </blockquote>
          <p className="mt-4 font-medium">{name as string}</p>
        </section>
      )
    }

    default:
      return (
        <section className="py-4 px-4 text-center text-muted-foreground text-sm">
          Bloque: {block.type}
        </section>
      )
  }
}
