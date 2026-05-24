import type { Config } from "tailwindcss";
const config: Config = {content:["./src/app/**/*.{ts,tsx}","./src/components/**/*.{ts,tsx}","./src/lib/**/*.{ts,tsx}"],theme:{extend:{colors:{dough:{50:"#fff8ec",700:"#8a4c13",900:"#3d240d"}}}},plugins:[]};
export default config;
