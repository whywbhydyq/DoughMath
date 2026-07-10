import { notFound } from 'next/navigation';
import { ToolPage, metadataForTool } from '@/components/ToolPage';
import { longTailPages } from '@/lib/pageData';

export function generateStaticParams() {
  return longTailPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return metadataForTool(slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!longTailPages.some((page) => page.slug === slug)) notFound();
  return <ToolPage slug={slug} />;
}
