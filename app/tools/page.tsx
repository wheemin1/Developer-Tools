import Link from "next/link"
import { ToolsGrid } from "@/components/tools-grid"

export const metadata = {
  title: "Developer Tools Directory",
  description: "Browse all developer utilities including JWT, Base64, JSON, QR, and security generators.",
}

export default function ToolsDirectoryPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Developer Tools Directory</h1>
        <p className="text-muted-foreground max-w-2xl">
          JWT is now the primary landing flow. Use this page to browse every tool in the suite.
        </p>
        <div>
          <Link
            href="/tools/jwt"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Go to JWT Encoder
          </Link>
        </div>
      </section>

      <ToolsGrid />
    </div>
  )
}
