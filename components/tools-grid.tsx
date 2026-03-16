import Link from "next/link"
import { TOOL_CATEGORIES } from "@/lib/constants"
import { ArrowRight, FileText, Hash, Code, Key, Fingerprint, Type, Eraser, QrCode } from "lucide-react"

// To handle rendering specific icons mapped per ID
const TOOL_ICONS: Record<string, React.ReactNode> = {
  url: <FileText className="h-5 w-5 text-muted-foreground" />,
  base64: <FileText className="h-5 w-5 text-muted-foreground" />,
  jwt: <Key className="h-5 w-5 text-muted-foreground" />,
  json: <Code className="h-5 w-5 text-muted-foreground" />,
  case: <Type className="h-5 w-5 text-muted-foreground" />,
  whitespace: <Eraser className="h-5 w-5 text-muted-foreground" />,
  hash: <Hash className="h-5 w-5 text-muted-foreground" />,
  uuid: <Fingerprint className="h-5 w-5 text-muted-foreground" />,
  qr: <QrCode className="h-5 w-5 text-muted-foreground" />,
}

export function ToolsGrid() {
  return (
    <div className="space-y-14">
      {TOOL_CATEGORIES.map((category) => (
        <section key={category.name} className="space-y-6">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">
            <span className="inline-block h-px w-6 bg-muted-foreground/40" />
            {category.name}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="group relative flex flex-col gap-5 rounded-2xl border border-border/70 bg-card/60 p-6 transition-all hover:border-foreground/30"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-foreground">{tool.name}</h3>
                  <div className="rounded-full border border-border/70 p-2">
                    {TOOL_ICONS[tool.id]}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {tool.description}
                </p>
                <div className="flex items-center text-sm font-medium text-foreground/80 gap-2">
                  Explore
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}