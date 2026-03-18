import { ALL_TOOLS, TOOL_CATEGORIES } from "@/lib/constants"
import { notFound } from "next/navigation"
import { buildFaqSchemaForTool, buildHowToSchemaForTool, buildToolSeo } from "@/lib/seo/tool-content"

import { ToolRenderer } from "@/components/tool-renderer"

// Static generation for all tool routes
export function generateStaticParams() {
  const routes: { slug: string }[] = []
  TOOL_CATEGORIES.forEach((category) => {
    category.tools.forEach((tool) => {
      routes.push({ slug: tool.id })
    })
  })
  return routes
}

type ToolPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { slug } = await params
  const tool = ALL_TOOLS.find((item) => item.id === slug)

  if (!tool) {
    return {
      title: "Tool Not Found | Developer Tools",
      description: "The requested developer tool could not be found.",
    }
  }

  const seo = buildToolSeo(tool)

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `/tools/${tool.id}`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `/tools/${tool.id}`,
      type: "website",
    },
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params
  const tool = ALL_TOOLS.find((item) => item.id === slug)

  if (!tool) {
    notFound()
  }

  const howToSchema = buildHowToSchemaForTool(tool)
  const faqSchema = buildFaqSchemaForTool(tool)

  return (
    <div className="flex flex-col w-full h-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ToolRenderer slug={slug} />
    </div>
  )
}
