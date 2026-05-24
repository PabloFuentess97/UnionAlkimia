import Link from "next/link"

export function MarketingFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-primary">Union Alkimia</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu espacio de yoga, bienestar y transformación personal.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3">Plataforma</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/precios" className="hover:text-foreground">Precios</Link></li>
              <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
              <li><Link href="/contacto" className="hover:text-foreground">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacidad" className="hover:text-foreground">Privacidad</Link></li>
              <li><Link href="/terminos" className="hover:text-foreground">Términos</Link></li>
              <li><Link href="/cookies" className="hover:text-foreground">Cookies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Síguenos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://instagram.com/unionalkimia" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Instagram</a></li>
              <li><a href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Union Alkimia. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
