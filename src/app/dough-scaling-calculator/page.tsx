import type { Metadata } from 'next';
import { ToolPage, metadataForTool } from '@/components/ToolPage';
export const metadata: Metadata = metadataForTool('dough-scaling-calculator');
export default function Page() { return <ToolPage slug="dough-scaling-calculator" />; }
