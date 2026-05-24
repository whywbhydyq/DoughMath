import type {MetadataRoute} from 'next';
const base='https://doughmath.ymirtool.com';
const paths=['/','/bakers-percentage-calculator','/sourdough-hydration-calculator','/starter-feeding-calculator','/dough-scaling-calculator','/pizza-dough-calculator','/about','/privacy','/disclaimer'];
export default function sitemap():MetadataRoute.Sitemap{return paths.map((p,i)=>({url:base+p,lastModified:new Date(),changeFrequency:i?'monthly':'weekly',priority:i?0.8:1}))}
