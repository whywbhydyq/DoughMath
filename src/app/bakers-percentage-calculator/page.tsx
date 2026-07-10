import type { Metadata } from 'next';
import { ToolPage, metadataForTool } from '@/components/ToolPage';
export const metadata: Metadata = metadataForTool('bakers-percentage-calculator');
export default function Page() { return <ToolPage slug="bakers-percentage-calculator" />; }
