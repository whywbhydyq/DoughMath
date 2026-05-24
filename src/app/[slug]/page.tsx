import { notFound } from 'next/navigation';
import { ToolPage, metadataForTool } from '@/components/ToolPage';
import { longTailPages } from '@/lib/pageData';

export function generateStaticParams() {
  return longTailPages.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return metadataForTool(params.slug);
}

export default function Page({ params }: { params: { slug: string } }) {
  if (!longTailPages.some((page) => page.slug === params.slug)) notFound();
  return <ToolPage slug={params.slug} />;
}
