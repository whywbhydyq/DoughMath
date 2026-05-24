import type {MetadataRoute} from 'next';
const base='https://doughmath.ymirtool.com';
const paths=['/','/bakers-percentage-calculator','/sourdough-hydration-calculator','/starter-feeding-calculator','/dough-scaling-calculator','/pizza-dough-calculator','/about','/privacy','/disclaimer'];
export default function sitemap():MetadataRoute.Sitemap{const now=new Date();return paths.map((p,i)=>({url:base+p,lastModified:now,changeFrequency:(i?'monthly':'weekly') as const,priority:i?0.8:1}))}
