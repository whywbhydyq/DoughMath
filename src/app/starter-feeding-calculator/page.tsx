import type { Metadata } from 'next';
import { ToolPage, metadataForTool } from '@/components/ToolPage';
export const metadata: Metadata = metadataForTool('starter-feeding-calculator');
export default function Page() { return <ToolPage slug="starter-feeding-calculator" />; }
