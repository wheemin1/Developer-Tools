import { ToolRenderer } from "@/components/tool-renderer"

interface ToolLandingProps {
  title: string
  description: string
  slug: string
  highlights?: string[]
  faqs?: { question: string; answer: string }[]
  relatedLinks?: { href: string; label: string }[]
}

export function ToolLanding({
  title,
  description,
  slug,
  highlights,
  faqs,
  relatedLinks,
}: ToolLandingProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground">{title}</h1>
        <p className="text-base text-muted-foreground max-w-2xl">{description}</p>
        {highlights && highlights.length > 0 && (
          <ul className="text-sm text-muted-foreground space-y-1">
            {highlights.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        )}
      </section>

      <ToolRenderer slug={slug} />

      {relatedLinks && relatedLinks.length > 0 && (
        <section className="rounded-2xl border border-border/60 bg-card/60 p-6">
          <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Related searches</h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {relatedLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-foreground hover:text-muted-foreground">
                {link.label}
              </a>
            ))}
          </div>
        </section>
      )}

      {faqs && faqs.length > 0 && (
        <section className="rounded-2xl border border-border/60 bg-card/60 p-6">
          <h2 className="text-lg font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4 text-sm text-muted-foreground">
            {faqs.map((item) => (
              <div key={item.question} className="space-y-1">
                <div className="font-medium text-foreground">{item.question}</div>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
