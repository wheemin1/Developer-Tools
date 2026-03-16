import { SidebarNav } from "@/components/sidebar-nav"

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 w-full">
          <aside className="hidden md:block pr-4 h-full">
            <SidebarNav />
          </aside>
          <main className="w-full h-full min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}