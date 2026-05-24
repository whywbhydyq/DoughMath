import type { Metadata } from 'next';
import { ToolPage, metadataForTool } from '@/components/ToolPage';
export const metadata: Metadata = metadataForTool('sourdough-hydration-calculator');
export default function Page() { return <ToolPage slug="sourdough-hydration-calculator" />; }
