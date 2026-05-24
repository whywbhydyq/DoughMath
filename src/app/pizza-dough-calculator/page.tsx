import type { Metadata } from 'next';
import { ToolPage, metadataForTool } from '@/components/ToolPage';

export const metadata: Metadata = metadataForTool('pizza-dough-calculator');

export default function PizzaDoughPage() {
  return <ToolPage slug="pizza-dough-calculator" />;
}
