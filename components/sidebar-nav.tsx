"use client"

import { TOOL_CATEGORIES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-10 space-y-10">
      {TOOL_CATEGORIES.map((category) => (
        <div key={category.name} className="space-y-3">
          <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground px-2">
            {category.name}
          </h4>
          <div className="flex flex-col space-y-1">
            {category.tools.map((tool) => {
              const href = `/tools/${tool.id}`
              const isActive = pathname === href

              return (
                <Link
                  key={tool.id}
                  href={href}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg border border-transparent transition-all",
                    isActive
                      ? "border-foreground/30 text-foreground bg-muted/60"
                      : "text-muted-foreground hover:border-border hover:text-foreground"
                  )}
                >
                  {tool.name}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}
