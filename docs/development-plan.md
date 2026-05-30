# 面包 / 酸种烘焙百分比工具站开发计划

> Current status note (2026-05-30): this document is a historical planning artifact. The current dependency-optimized package intentionally removes local test, lint, typecheck, and build workflows. Production verification is handled by Vercel deployment logs plus manual browser checks.

版本：v1.0  
生成日期：2026-05-24  
项目类型：英文免费工具站 / 轻量工具矩阵  
建议站点定位：Sourdough Baker’s Math Calculator / Bread Formula Calculator  
核心目标：用稳定、透明、可复用的前端本地计算器，解决面包、酸种、starter feeding、dough scaling、pizza dough 的反复计算问题。  
非目标：不是食谱站，不是 AI 烘焙助手，不是账号 App，不是云端配方管理系统。

---

## 0. 开发计划结论

本项目第一版必须窄做。它的价值不在“写很多酸种面包文章”，而在“让用户在真实烘焙前快速得到准确克数、总水合度、starter 拆分、批量缩放、pizza dough ball 配方，并能复制、打印、分享”。

第一版只做 5 个核心计算器：

1. Baker’s Percentage Calculator
2. Sourdough Hydration Calculator
3. Starter Feeding Calculator
4. Dough Scaling Calculator
5. Pizza Dough Calculator

第一版只做本地计算，不登录、不上传、不保存云端数据、不做 AI 生成食谱、不做复杂发酵预测。

技术上建议使用 Next.js App Router + TypeScript + Tailwind CSS。核心公式必须集中在纯函数库中，先集中公式逻辑，再接 UI。

---

## 1. 项目背景与产品判断

### 1.1 用户真实问题

用户不是单纯想看“酸种面包怎么做”，而是在实际操作中遇到反复计算问题：

- 目标面团总重量已知，如何反推 flour / water / starter / salt？
- 想做 2 个、3 个、6 个、8 个 loaf，如何批量缩放？
- starter 里的 flour 和 water 是否要计入 total hydration？
- 100% hydration starter、50% stiff starter、125% liquid starter 如何拆分？
- 1:2:2、1:3:3、1:5:5 feeding ratio 到底各放多少克？
- pizza dough 想按 pizza 数量和 dough ball weight 计算配方。
- 每周重复烘焙，不想每次重新用纸笔或 spreadsheet。
- 手机上厨房使用，输入必须精确，结果必须可复制和打印。

### 1.2 站点定位

英文定位语：

> A simple baker’s percentage, sourdough hydration, starter feeding, dough scaling, and pizza dough calculator for home bakers.

中文解释：

这是一个面向家庭烘焙用户、酸种用户、pizza dough 用户的轻量公式计算工具站。它不替代食谱，不判断发酵是否成功，只负责把配方数学算清楚。

### 1.3 四关判断

| 关卡 | 判断 |
|---|---|
| 主动搜索 | 中高。baker percentage calculator、sourdough hydration calculator、starter feeding calculator、pizza dough calculator 都是明确工具词。 |
| 可进入性 | 中等。已有 Foodgeek、Flourwise、Simple Sourdough Calculator 等竞品，但仍可通过更轻、更清楚、更适合移动端和长尾 preset 页进入。 |
| 真实使用 / 复用 | 强。用户每次调整面团重量、水合度、starter、面包数量、pizza dough ball weight 都需要重新计算。 |
| 商业邻接 | 中等。可承接 kitchen scale、Dutch oven、banneton、bench scraper、thermometer、pizza steel、bread flour、烘焙课程等 affiliate。 |

---

## 2. MVP 范围

### 2.1 第一版必须做

#### P0 工具

| 工具 | 页面 | 核心输入 | 核心输出 |
|---|---|---|---|
| Baker’s Percentage Calculator | `/bakers-percentage-calculator` | flour weight、ingredient weights | ingredient baker’s %、total formula % |
| Sourdough Hydration Calculator | `/sourdough-hydration-calculator` | flour、water、starter、starter hydration、salt | added hydration、total hydration、starter flour/water split |
| Starter Feeding Calculator | `/starter-feeding-calculator` | target starter weight、ratio、seed retention | seed starter、flour、water |
| Dough Scaling Calculator | `/dough-scaling-calculator` | target dough weight 或 flour weight、loaf count、hydration、starter%、salt% | total ingredients、per loaf ingredients、printable recipe |
| Pizza Dough Calculator | `/pizza-dough-calculator` | pizza count、ball weight、hydration、salt、oil、yeast/starter | flour、water、salt、oil、yeast/starter、per ball weight |

#### P0 通用能力

- 默认单位为 grams。
- 支持 oz / lb 显示或切换，但第一版内部统一用 grams 计算。
- 所有核心输入都可通过 URL query 恢复状态。
- 每个工具支持 Copy result。
- 每个工具支持 Print recipe card。
- 每个工具提供清晰错误提示和 warning。
- 移动端优先，输入框和按钮必须容易操作。
- 所有计算在前端本地完成。
- 不收集用户输入的配方数据。
- 不要求登录。
- 不保存云端。
- 每个工具页有可索引的说明、示例、FAQ、相关工具入口。

### 2.2 第一版禁止做

| 禁止项 | 原因 |
|---|---|
| AI 食谱生成 | 结果不可控，偏离计算器定位。 |
| 云端账号系统 | 增加复杂度、隐私负担和开发成本。 |
| Recipe library | 会变成 App，不适合第一版工具站。 |
| Baking journal | 与搜索工具站目标不一致。 |
| Feeding reminders | 需要通知权限和长期产品维护。 |
| 复杂发酵预测 | 温度、菌种活性、面粉、环境变量太多，容易不准确。 |
| 营养建议 | 无必要且增加责任边界。 |
| 大食谱库 | 会进入强竞争内容站赛道。 |
| 大量模板化 SEO 页 | 有低价值规模化内容风险。 |
| 上传图片 / 上传配方文件 | 无必要，增加隐私和安全负担。 |

---

## 3. 技术栈建议

### 3.1 推荐栈

| 层 | 技术 |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Historical unit-test plan | Removed from the current dependency-optimized package |
| E2E / Smoke Test | Playwright，可 P1 加 |
| Analytics | Vercel Analytics 或 Plausible / GA4 |
| Deployment | Vercel |
| Data Storage | 无后端；localStorage 仅保存最近设置 |
| State Sharing | URL query string |
| Ads | Google AdSense，P1 接入 |
| Affiliate | 静态 affiliate panel，P1 接入 |

### 3.2 关键技术原则

1. 所有公式必须是纯函数。
2. 计算逻辑不得写在 React 组件里。
3. UI 只能调用 `lib/bakingMath.ts`。
4. 每个公式函数必须保持清晰、集中、可审计；当前包不保留本地测试工具链。
5. URL 参数解析必须有 schema 和容错。
6. 页面内容和计算器默认值应从统一 `pageData.ts` 读取。
7. sitemap 和 metadata 不手写重复配置，应从页面数据生成。
8. 打印样式必须隐藏导航、广告、affiliate、非必要说明。
9. 不做后端数据库。
10. 不保存用户私人配方到服务器。

---

## 4. 项目目录结构

建议目录：

```txt
src/
  app/
    page.tsx
    layout.tsx
    globals.css
    sitemap.ts
    robots.ts

    bakers-percentage-calculator/
      page.tsx
    sourdough-hydration-calculator/
      page.tsx
    starter-feeding-calculator/
      page.tsx
    dough-scaling-calculator/
      page.tsx
    pizza-dough-calculator/
      page.tsx

    tools/
      [slug]/
        page.tsx

    about/
      page.tsx
    privacy/
      page.tsx
    disclaimer/
      page.tsx

  components/
    calculators/
      BakersPercentageCalculator.tsx
      SourdoughHydrationCalculator.tsx
      StarterFeedingCalculator.tsx
      DoughScalingCalculator.tsx
      PizzaDoughCalculator.tsx
      CalculatorShell.tsx
      NumberField.tsx
      UnitToggle.tsx
      WarningList.tsx

    result/
      IngredientTable.tsx
      HydrationBreakdown.tsx
      PrintableRecipeCard.tsx
      CopyButton.tsx
      ShareUrlButton.tsx
      ResultSummary.tsx

    seo/
      BreadcrumbJsonLd.tsx
      ToolIntro.tsx
      FaqBlock.tsx
      RelatedTools.tsx

    layout/
      Header.tsx
      Footer.tsx
      Container.tsx
      AdSlot.tsx
      AffiliatePanel.tsx

  lib/
    bakingMath.ts
    bakingMath.constants.ts
    units.ts
    rounding.ts
    validation.ts
    urlState.ts
    pageData.ts
    analytics.ts

  types/
    baking.ts
    page.ts

  historical-tests-removed/
    bakingMath historical test file removed
    units historical test file removed
    urlState historical test file removed
    validation historical test file removed
```

---

## 5. 数据模型设计

### 5.1 基础类型

```ts
export type UnitSystem = "metric" | "imperial";

export type CalculatorType =
  | "bakers-percentage"
  | "sourdough-hydration"
  | "starter-feeding"
  | "dough-scaling"
  | "pizza-dough";

export interface Ingredient {
  id: string;
  name: string;
  weightGrams: number;
  bakerPercentage?: number;
  role?: "flour" | "water" | "salt" | "starter" | "yeast" | "oil" | "sugar" | "other";
}

export interface StarterConfig {
  weightGrams: number;
  hydrationPct: number;
}

export interface StarterSplit {
  starterWeightGrams: number;
  flourGrams: number;
  waterGrams: number;
  hydrationPct: number;
}

export interface FormulaWarning {
  code: string;
  message: string;
  severity: "info" | "warning" | "error";
}
```

### 5.2 Dough Scaling 输入

```ts
export interface DoughScalingInput {
  mode: "by-flour-weight" | "by-target-dough-weight";
  flourWeightGrams?: number;
  targetDoughWeightGrams?: number;
  loafCount: number;
  hydrationPct: number;
  starterPct: number;
  starterHydrationPct: number;
  saltPct: number;
  oilPct?: number;
  sugarPct?: number;
  yeastPct?: number;
}
```

### 5.3 Dough Scaling 输出

```ts
export interface DoughScalingResult {
  totalDoughWeightGrams: number;
  baseFlourGrams: number;
  addedWaterGrams: number;
  starterWeightGrams: number;
  starterFlourGrams: number;
  starterWaterGrams: number;
  totalFlourGrams: number;
  totalWaterGrams: number;
  addedHydrationPct: number;
  totalHydrationPct: number;
  saltGrams: number;
  oilGrams?: number;
  sugarGrams?: number;
  yeastGrams?: number;
  perLoafWeightGrams: number;
  ingredients: Ingredient[];
  warnings: FormulaWarning[];
}
```

### 5.4 Starter Feeding 输入输出

```ts
export interface FeedingRatio {
  seedPart: number;
  flourPart: number;
  waterPart: number;
}

export interface StarterFeedingInput {
  targetStarterWeightGrams: number;
  ratio: FeedingRatio;
  keepExtraStarterGrams?: number;
}

export interface StarterFeedingResult {
  seedStarterGrams: number;
  feedingFlourGrams: number;
  feedingWaterGrams: number;
  finalStarterWeightGrams: number;
  totalNeededStarterGrams: number;
  warnings: FormulaWarning[];
}
```

### 5.5 Pizza Dough 输入输出

```ts
export interface PizzaDoughInput {
  pizzaCount: number;
  ballWeightGrams: number;
  hydrationPct: number;
  saltPct: number;
  oilPct?: number;
  sugarPct?: number;
  yeastPct?: number;
  starterPct?: number;
  starterHydrationPct?: number;
  leaveningType: "yeast" | "sourdough";
}

export interface PizzaDoughResult {
  totalDoughWeightGrams: number;
  baseFlourGrams: number;
  waterGrams: number;
  saltGrams: number;
  oilGrams?: number;
  sugarGrams?: number;
  yeastGrams?: number;
  starterWeightGrams?: number;
  starterFlourGrams?: number;
  starterWaterGrams?: number;
  totalHydrationPct: number;
  perBallWeightGrams: number;
  ingredients: Ingredient[];
  warnings: FormulaWarning[];
}
```

---

## 6. 核心公式设计

所有公式集中在：

```txt
src/lib/bakingMath.ts
```

### 6.1 Baker’s Percentage

定义：

```txt
ingredientPercentage = ingredientWeight / totalFlourWeight * 100
```

要求：

- flour 永远是 100%。
- water、salt、starter、oil、sugar、yeast 都相对 total flour weight。
- 结果保留 1–2 位小数。
- 内部计算使用原始浮点，展示时才 round。

函数：

```ts
export function bakerPercentage(
  ingredientWeightGrams: number,
  totalFlourWeightGrams: number
): number
```

### 6.2 从百分比转克数

```txt
ingredientWeight = flourWeight * ingredientPercentage / 100
```

函数：

```ts
export function weightFromBakerPercentage(
  flourWeightGrams: number,
  percentage: number
): number
```

### 6.3 从目标面团总重量反推 flour

```txt
totalPercentage = 100 + hydrationPct + starterPct + saltPct + oilPct + sugarPct + yeastPct
baseFlour = targetDoughWeight / (totalPercentage / 100)
```

注意：

- 这里的 `starterPct` 指 starter 总重量相对 base flour 的百分比。
- 如果后续支持 prefermented flour percentage，必须另建高级模式，不能和 starter total weight percentage 混用。

函数：

```ts
export function baseFlourFromTargetDoughWeight(params: {
  targetDoughWeightGrams: number;
  hydrationPct: number;
  starterPct?: number;
  saltPct?: number;
  oilPct?: number;
  sugarPct?: number;
  yeastPct?: number;
}): number
```

### 6.4 Starter 拆分

```txt
starterFlour = starterWeight / (1 + starterHydrationPct / 100)
starterWater = starterWeight - starterFlour
```

示例：

- 100g starter，100% hydration => 50g flour + 50g water
- 150g starter，50% hydration => 100g flour + 50g water
- 225g starter，125% hydration => 100g flour + 125g water

函数：

```ts
export function splitStarterByHydration(
  starterWeightGrams: number,
  starterHydrationPct: number
): StarterSplit
```

### 6.5 Total Hydration

```txt
totalHydrationPct = totalWater / totalFlour * 100
```

其中：

```txt
totalFlour = baseFlour + starterFlour + prefermentFlour
totalWater = addedWater + starterWater + prefermentWater
```

第一版只支持 starter，P1 再支持 poolish / biga / levain 独立 preferment。

函数：

```ts
export function calculateTotalHydration(params: {
  baseFlourGrams: number;
  addedWaterGrams: number;
  starter?: StarterConfig;
}): {
  totalFlourGrams: number;
  totalWaterGrams: number;
  addedHydrationPct: number;
  totalHydrationPct: number;
  starterSplit?: StarterSplit;
}
```

### 6.6 Starter Feeding Ratio

```txt
ratioTotal = seedPart + flourPart + waterPart
seedStarter = targetStarterWeight * seedPart / ratioTotal
feedingFlour = targetStarterWeight * flourPart / ratioTotal
feedingWater = targetStarterWeight * waterPart / ratioTotal
```

函数：

```ts
export function calculateStarterFeeding(input: StarterFeedingInput): StarterFeedingResult
```

### 6.7 Pizza Dough Balls

```txt
targetDoughWeight = pizzaCount * ballWeight
baseFlour = targetDoughWeight / totalPercentage
```

其中：

```txt
totalPercentage = 100 + hydrationPct + saltPct + oilPct + sugarPct + yeastPct
```

酸种 pizza 模式加入 starter：

```txt
totalPercentage = 100 + hydrationPct + saltPct + oilPct + sugarPct + starterPct
```

函数：

```ts
export function calculatePizzaDough(input: PizzaDoughInput): PizzaDoughResult
```

---

## 7. 验证和错误提示规则

### 7.1 通用 invalid

| 条件 | 处理 |
|---|---|
| weight <= 0 | error |
| hydrationPct <= 0 | error |
| saltPct < 0 | error |
| starterHydrationPct <= 0 | error |
| loafCount < 1 | error |
| pizzaCount < 1 | error |
| ratio part <= 0 | error |
| NaN / Infinity | error |
| empty string | 不崩溃，显示待输入状态 |

### 7.2 Warning

| 条件 | 文案 |
|---|---|
| hydration < 40% | “This is a very stiff dough. Check whether the hydration value is intended.” |
| hydration > 100% | “This is a very high-hydration dough and may be difficult to handle.” |
| salt > 4% | “Salt above 4% is unusually high for most bread formulas.” |
| starter > 60% | “A high starter percentage can speed fermentation significantly.” |
| starter hydration != 100% | “Starter has been split using your custom hydration setting.” |
| target dough > 10000g | “Large batch. Check scale capacity and mixing method.” |
| pizza ball < 120g | “This is a small dough ball. Check pizza size.” |
| pizza ball > 500g | “This is a large dough ball. Check pizza size and style.” |

---

## 8. 页面矩阵

### 8.1 第一版页面

| 优先级 | URL | 页面类型 | 工具模块 |
|---|---|---|---|
| P0 | `/` | 首页 | Dough Scaling 快速入口 + 5 工具导航 |
| P0 | `/bakers-percentage-calculator` | 核心工具页 | Baker’s Percentage |
| P0 | `/sourdough-hydration-calculator` | 核心工具页 | Hydration |
| P0 | `/starter-feeding-calculator` | 核心工具页 | Starter Feeding |
| P0 | `/dough-scaling-calculator` | 核心工具页 | Dough Scaling |
| P0 | `/pizza-dough-calculator` | 核心工具页 | Pizza Dough |
| P1 | `/total-hydration-calculator` | 长尾工具页 | Hydration preset |
| P1 | `/sourdough-starter-ratio-1-2-2` | 长尾 preset | Starter Feeding preset |
| P1 | `/sourdough-starter-ratio-1-5-5` | 长尾 preset | Starter Feeding preset |
| P1 | `/levain-calculator` | 长尾工具页 | Starter / Levain |
| P1 | `/bread-recipe-scaler` | 长尾工具页 | Dough Scaling |
| P1 | `/dough-weight-calculator` | 长尾工具页 | Dough Scaling |
| P1 | `/pizza-dough-ball-weight-calculator` | 长尾工具页 | Pizza Dough |
| P1 | `/sourdough-pizza-calculator` | 长尾工具页 | Pizza Dough sourdough mode |
| P1 | `/grams-to-bakers-percentage` | 长尾工具页 | Baker’s Percentage |
| P1 | `/bakers-percentage-to-grams` | 长尾工具页 | Baker’s Percentage |
| Legal | `/about` | 合规页 | 无 |
| Legal | `/privacy` | 合规页 | 无 |
| Legal | `/disclaimer` | 合规页 | 无 |

### 8.2 页面内容模板

每个工具页必须包含：

1. H1
2. 1–2 句工具用途说明
3. Calculator
4. Result
5. Example calculation
6. Formula explanation
7. Common mistakes
8. FAQ
9. Related calculators
10. Disclaimer note

禁止只有 FAQ 和泛内容，没有计算器。

### 8.3 动态页面数据结构

```ts
export interface ToolPageData {
  slug: string;
  title: string;
  description: string;
  h1: string;
  calculatorType: CalculatorType;
  canonicalPath: string;
  defaultInputs: Record<string, unknown>;
  intro: string;
  formulaNotes: string[];
  examples: {
    title: string;
    input: string;
    output: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedSlugs: string[];
}
```

---

## 9. UI / UX 设计要求

### 9.1 总体原则

- 移动端优先。
- 输入框比滑块更重要。
- 滑块可选，但必须有精确数字输入。
- 高级项折叠，不干扰新手。
- 默认值必须可直接产生结果。
- 结果表格优先展示 grams。
- Copy / Print / Share 放在结果区，不放在广告旁边。
- Warning 必须解释原因，不只显示红字。

### 9.2 输入组件

`NumberField` 必须支持：

- label
- value
- min
- max
- step
- unit suffix
- helper text
- error text
- increment / decrement buttons
- mobile numeric keyboard
- aria-label

### 9.3 结果表格

结果表格列：

| Ingredient | Weight | Baker’s % | Notes |
|---|---:|---:|---|

酸种类结果增加 breakdown：

| Component | Flour | Water | Total |
|---|---:|---:|---:|
| Base dough | x | y | z |
| Starter | x | y | z |
| Total | x | y | z |

### 9.4 打印模式

打印时只保留：

- 工具名称
- 输入摘要
- 结果表格
- hydration breakdown
- warning
- disclaimer 小字

隐藏：

- Header
- Footer
- Ads
- Affiliate panel
- Related tools
- FAQ
- 长文解释

CSS：

```css
@media print {
  .no-print {
    display: none !important;
  }

  .print-card {
    display: block;
  }

  body {
    background: white;
  }
}
```

### 9.5 Share URL

Share URL 规则：

- 只保存核心输入，不保存用户自由备注。
- URL 参数名称短但可读。
- 无效参数忽略并回退默认值。
- Share button 点击后复制当前 URL。
- 页面加载时从 query 初始化状态。
- 用户编辑后可使用 `replaceState` 更新 URL，但不要每个键盘输入都 push history。

示例：

```txt
/dough-scaling-calculator?mode=target&dough=1000&hyd=70&salt=2&starter=20&sh=100&loaves=2
```

---

## 10. SEO 开发要求

### 10.1 Metadata

每个页面需要：

- title，最长约 55–60 字符
- description，最长约 150–160 字符
- canonical
- Open Graph title / description
- no meta keywords
- favicon
- viewport
- language = en

示例：

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const page = getToolPage(params.slug);

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.canonicalPath,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.canonicalPath,
      type: "website",
    },
  };
}
```

### 10.2 Sitemap

`sitemap.ts` 从 `pageData.ts` 自动生成：

```ts
export default function sitemap() {
  return allPages.map((page) => ({
    url: `${BASE_URL}${page.canonicalPath}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: page.priority,
  }));
}
```

### 10.3 Robots

允许抓取工具页：

```ts
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

### 10.4 结构化数据

保留：

- BreadcrumbList
- WebApplication 或 SoftwareApplication 可选
- HowTo 谨慎使用，只有页面真的有步骤式说明时才用

不作为重点：

- FAQPage schema

原因：FAQ 可以保留给用户阅读，但不要依赖 FAQ rich result。普通工具站不应把 FAQ schema 当核心 SEO 增长点。

### 10.5 内容去重规则

每个长尾页必须至少有以下差异：

- 独立 H1
- 独立 meta title
- 独立 meta description
- 独立默认参数
- 独立 example calculation
- 独立 common mistakes
- 独立 related tools
- FAQ 至少 50% 不同

禁止：

- 只替换关键词生成大量页面
- 同一段公式解释复制到所有页面
- 没有独立计算器或 preset 的纯文章页
- 大量 “best sourdough recipe” 泛内容

---

## 11. AdSense 与 Affiliate 开发约束

### 11.1 AdSense 位置

| 位置 | 是否允许 | 说明 |
|---|---:|---|
| 首屏输入框上方 | 否 | 影响工具信任和操作 |
| 输入框和 Calculate 按钮之间 | 否 | 误点风险 |
| Calculate 按钮附近 | 否 | 误点风险 |
| 结果表格内部 | 否 | 影响复制和阅读 |
| 结果区下方 | 是 | 安全 |
| FAQ 中段 | 是 | 阅读场景 |
| PC 右侧栏 | 可选 | 不贴近操作控件 |
| 移动端 sticky bottom | 第一版否 | 容易干扰输入 |
| 打印页面 | 否 | 必须隐藏 |

### 11.2 Affiliate 位置

只放在结果区下方或文章末尾，标题应弱商业化：

```txt
Tools that make bread formulas easier to measure
```

推荐品类：

- digital kitchen scale
- Dutch oven
- banneton
- bench scraper
- bread lame
- instant-read thermometer
- proofing box
- pizza steel
- pizza peel
- bread flour
- rye flour
- baking books

禁止：

- 首屏强推商品
- 伪装成结果的一部分
- 干扰 calculator
- 过度导购，导致站点从工具站变成 affiliate 内容站

---

## 12. Analytics 事件设计

第一版需要埋点，但不要收集用户具体配方内容。

### 12.1 事件

| 事件 | 触发 | 参数 |
|---|---|---|
| `calculator_view` | 工具渲染 | calculator_type, slug |
| `calculate_click` | 用户点击或输入触发计算 | calculator_type |
| `copy_result` | 复制结果 | calculator_type |
| `print_recipe` | 打印 | calculator_type |
| `share_url` | 复制分享 URL | calculator_type |
| `unit_toggle` | 切换单位 | from, to |
| `warning_shown` | 出现 warning | warning_code |
| `affiliate_click` | 点击 affiliate | category |
| `ad_slot_view` | 广告位渲染 | slot_id |

### 12.2 不记录

- 不记录完整配方
- 不记录用户自由输入名称
- 不记录个人身份信息
- 不上传用户本地备注

---

## 13. 历史测试计划（当前包已移除本地测试工具链）

### 13.1 单元测试

文件：

```txt
src/historical-tests-removed/bakingMath historical test file removed
```

#### Baker percentage

```ts
it("calculates baker percentages from weights", () => {
  const flour = 1000;
  expect(bakerPercentage(700, flour)).toBeCloseTo(70, 2);
  expect(bakerPercentage(20, flour)).toBeCloseTo(2, 2);
});
```

#### Target dough weight

```ts
it("calculates base flour from target dough weight", () => {
  const flour = baseFlourFromTargetDoughWeight({
    targetDoughWeightGrams: 1000,
    hydrationPct: 70,
    starterPct: 20,
    saltPct: 2,
  });

  expect(flour).toBeCloseTo(520.83, 2);
});
```

#### Starter split 100%

```ts
it("splits 100% hydration starter", () => {
  const split = splitStarterByHydration(200, 100);

  expect(split.flourGrams).toBeCloseTo(100, 2);
  expect(split.waterGrams).toBeCloseTo(100, 2);
});
```

#### Starter split 50%

```ts
it("splits stiff starter", () => {
  const split = splitStarterByHydration(150, 50);

  expect(split.flourGrams).toBeCloseTo(100, 2);
  expect(split.waterGrams).toBeCloseTo(50, 2);
});
```

#### Starter feeding 1:2:2

```ts
it("calculates 1:2:2 starter feeding", () => {
  const result = calculateStarterFeeding({
    targetStarterWeightGrams: 150,
    ratio: { seedPart: 1, flourPart: 2, waterPart: 2 },
  });

  expect(result.seedStarterGrams).toBeCloseTo(30, 2);
  expect(result.feedingFlourGrams).toBeCloseTo(60, 2);
  expect(result.feedingWaterGrams).toBeCloseTo(60, 2);
});
```

#### Pizza dough

```ts
it("calculates pizza dough balls", () => {
  const result = calculatePizzaDough({
    pizzaCount: 4,
    ballWeightGrams: 250,
    hydrationPct: 65,
    saltPct: 2.5,
    oilPct: 2,
    yeastPct: 0.2,
    leaveningType: "yeast",
  });

  expect(result.totalDoughWeightGrams).toBeCloseTo(1000, 2);
  expect(result.baseFlourGrams).toBeCloseTo(589.28, 2);
});
```

### 13.2 Validation 测试

| 输入 | 预期 |
|---|---|
| hydration = 0 | error |
| hydration = -10 | error |
| hydration = 35 | warning |
| hydration = 110 | warning |
| salt = 5 | warning |
| starter hydration = 0 | error |
| target dough = 0 | error |
| ratio = 1:0:2 | error |
| pizza count = 0 | error |
| empty input | 不崩溃 |

### 13.3 URL 状态测试

| 场景 | 预期 |
|---|---|
| 打开带 query URL | 恢复输入 |
| query 有无效值 | 忽略并回退默认值 |
| 点击 share | 复制当前 URL |
| 修改输入后 share | URL 反映最新状态 |
| URL 不包含备注 | 合规 |

### 13.4 手动 QA

桌面：

- Chrome
- Edge
- Safari 可选

移动：

- iPhone Safari
- Android Chrome

检查项：

- 数字键盘是否弹出
- stepper 是否可点
- 输入不会被广告遮挡
- 结果表格不横向溢出
- Print 是否只打印配方卡
- Copy 是否复制纯文本
- Share URL 是否恢复状态
- hydration warning 是否正常显示
- dark mode 如支持，不影响可读性

---

## 14. 开发阶段拆分

## Phase 0：项目初始化

目标：建立基础项目结构和工程约束。

任务：

- 创建 Next.js + TypeScript 项目。
- 配置 Tailwind。
- 历史计划曾包含 ESLint；当前包已移除本地 lint 工具链。
- 本地测试工具链已从当前包移除。
- 配置基础 layout。
- 配置 `BASE_URL` 环境变量。
- 添加 `robots.ts` 和 `sitemap.ts` 占位。
- 创建 about / privacy / disclaimer。
- 明确无 meta keywords。
- 添加基础 footer 链接。

验收：

- `npm run dev` 可启动。
- Vercel production build log should be reviewed after deployment.
- Manual browser checks should pass after deployment.
- 首页可访问。
- sitemap.xml 可访问。
- robots.txt 可访问。

---

## Phase 1：公式库和历史测试计划

目标：先把数学算对。

任务：

- 创建 `src/lib/bakingMath.ts`。
- 创建 `src/lib/rounding.ts`。
- 创建 `src/lib/validation.ts`。
- 创建 `src/types/baking.ts`。
- 实现：
  - `bakerPercentage`
  - `weightFromBakerPercentage`
  - `baseFlourFromTargetDoughWeight`
  - `splitStarterByHydration`
  - `calculateTotalHydration`
  - `calculateStarterFeeding`
  - `calculateDoughScaling`
  - `calculatePizzaDough`
- 历史计划曾要求编写单元测试；当前包已移除本地测试工具链。
- 历史计划曾要求边界测试；当前包以源码审计和 Vercel 部署日志为准。
- 历史计划曾要求 rounding 测试；当前包不保留本地测试文件。

验收：

- 核心公式应通过源码审计和线上手动检查。
- starter hydration 50%、100%、125% 都正确。
- target dough weight 反推正确。
- feeding ratio 1:2:2、1:5:5 正确。
- pizza dough ball weight 正确。
- 无 React 组件依赖公式库。

---

## Phase 2：通用 UI 组件

目标：搭建工具组件的通用底座。

任务：

- `CalculatorShell`
- `NumberField`
- `UnitToggle`
- `WarningList`
- `IngredientTable`
- `HydrationBreakdown`
- `CopyButton`
- `ShareUrlButton`
- `PrintableRecipeCard`
- `ResultSummary`
- `RelatedTools`
- `AdSlot` 占位组件
- `AffiliatePanel` 占位组件

验收：

- 所有组件移动端可用。
- 输入框支持数字键盘。
- Copy 可复制结果。
- Print 样式正确隐藏非打印元素。
- Share URL 可复制。
- Warning 区分 info / warning / error。

---

## Phase 3：5 个核心计算器

目标：完成 MVP 核心工具。

### 3.1 Baker’s Percentage Calculator

功能：

- 输入 flour weight。
- 可添加 ingredient rows。
- 默认行：water、salt、starter。
- 自动计算每个 ingredient %。
- 显示 total formula percentage。
- 支持从 percentage 反算 weight 的 P1 toggle。

验收：

- 1000g flour、700g water、20g salt 输出 70%、2%。
- 添加和删除 ingredient 不崩溃。
- Copy 输出 Markdown 或纯文本表格。
- Print 正常。

### 3.2 Sourdough Hydration Calculator

功能：

- 输入 base flour。
- 输入 added water。
- 输入 starter weight。
- 输入 starter hydration。
- 输入 salt 可选。
- 输出 starter flour / starter water。
- 输出 added hydration。
- 输出 total hydration。
- 输出 total flour / total water。

验收：

- 1000g flour、700g water、200g starter、100% hydration：
  - starter flour = 100g
  - starter water = 100g
  - total flour = 1100g
  - total water = 800g
  - total hydration ≈ 72.73%

### 3.3 Starter Feeding Calculator

功能：

- 输入 target starter weight。
- ratio preset：1:1:1、1:2:2、1:3:3、1:5:5。
- 自定义 ratio。
- 输入 keep extra starter 可选。
- 输出 seed、flour、water。

验收：

- 150g target，1:2:2：
  - seed = 30g
  - flour = 60g
  - water = 60g

### 3.4 Dough Scaling Calculator

功能：

- 模式 1：By flour weight。
- 模式 2：By target dough weight。
- 输入 loaf count。
- 输入 hydration。
- 输入 starter %。
- 输入 starter hydration。
- 输入 salt %。
- Advanced 输入 oil / sugar / yeast。
- 输出 total batch。
- 输出 per loaf。
- 输出 total hydration breakdown。
- 输出 printable recipe card。

验收：

- target 1000g、hydration 70%、starter 20%、salt 2%、starter hydration 100%：
  - base flour ≈ 520.83g
  - starter ≈ 104.17g
  - salt ≈ 10.42g
  - 结果总和≈1000g

### 3.5 Pizza Dough Calculator

功能：

- 输入 pizza count。
- 输入 dough ball weight。
- 输入 hydration。
- 输入 salt。
- 输入 oil。
- 输入 yeast。
- toggle：yeast / sourdough。
- sourdough 模式启用 starter % 和 starter hydration。
- 输出 total ingredients。
- 输出 per ball weight。

验收：

- 4 pizzas × 250g = 1000g。
- hydration 65%、salt 2.5%、oil 2%、yeast 0.2%：
  - total percentage = 169.7%
  - base flour ≈ 589.28g

---

## Phase 4：页面矩阵和内容

目标：让工具可索引、可解释、可互链。

任务：

- 创建 `pageData.ts`。
- 创建首页。
- 创建 5 个核心工具页。
- 创建 10 个左右长尾 preset 页。
- 每页添加：
  - intro
  - calculator
  - example
  - formula notes
  - common mistakes
  - FAQ
  - related tools
- 自动生成 metadata。
- 自动生成 sitemap。

验收：

- 每个页面 title 不重复。
- 每个 description 不重复。
- 每个页面有 canonical。
- 每个页面有不同默认参数。
- 每个页面有不同示例。
- 页面内容不空洞。
- sitemap 包含所有页面。
- 相关工具链接正常。

---

## Phase 5：合规、广告、affiliate

目标：准备 AdSense 和商业化，但不伤害工具体验。

任务：

- 添加 privacy 页面，说明：
  - calculator runs locally
  - no account
  - no recipe upload
  - analytics only aggregate usage
  - ads / affiliate disclosure
- 添加 disclaimer 页面，说明：
  - calculations are educational
  - fermentation and baking results vary
  - check formula before baking
- 添加 affiliate disclosure。
- 添加 `AdSlot` 占位：
  - result below
  - FAQ middle
  - desktop sidebar optional
- 打印模式隐藏广告和 affiliate。
- 检查广告不靠近按钮。

验收：

- 广告位不在输入框、按钮、结果表内部。
- 移动端广告不遮挡输入。
- affiliate 不伪装成结果。
- Privacy / Disclaimer footer 可访问。
- Print 不包含广告。

---

## Phase 6：性能、可访问性和上线前 QA

目标：上线前避免基础质量问题。

任务：

- 检查 Lighthouse：
  - Performance
  - Accessibility
  - Best Practices
  - SEO
- 图片压缩。
- 无大型依赖。
- 首屏工具可快速交互。
- aria-label 完整。
- 表单 label 完整。
- 键盘可操作。
- 错误提示屏幕阅读器可读。
- 移动端无横向滚动。
- Vercel production build log should be reviewed after deployment.
- sitemap / robots / canonical 正确。

验收：

- Vercel production build log should be reviewed after deployment.
- Manual browser checks should pass after deployment.
- 首页和核心工具页 Lighthouse SEO 基础合格。
- 移动端输入体验合格。
- 无控制台错误。
- 404 页面可用。
- Footer 链接完整。

---

## Phase 7：上线后验证

目标：判断是否继续扩展。

### 7.1 上线后 7 天

检查：

- 页面是否被抓取。
- sitemap 是否被 GSC 读取。
- 是否有 indexing 问题。
- 是否有 404。
- 是否有移动可用性问题。
- 事件是否正常记录。

### 7.2 上线后 30 天

检查：

- GSC impressions 是否开始出现。
- 核心页是否有 query。
- calculate_click 是否有数据。
- copy_result / print_recipe 是否有人用。
- 用户是否主要停留在工具页。
- 哪个工具最常用。

### 7.3 上线后 90 天

扩展条件：

| 指标 | 继续扩展信号 |
|---|---|
| GSC impressions | 核心页有持续增长 |
| Calculate CTR | 工具页访问后 calculate_click >= 8% |
| Copy / Print | 有真实使用 |
| 平均停留 | 工具页明显高于普通内容页 |
| Feedback | 有用户请求新功能 |
| 维护成本 | 每周低于 2 小时 |

止损条件：

| 指标 | 止损信号 |
|---|---|
| GSC impressions | 90 天仍极低 |
| Calculate CTR | 低于 5% |
| 用户行为 | 只看解释，不用工具 |
| Affiliate | 点击接近 0 |
| 错误反馈 | 每周公式争议超过 5 小时 |
| 页面扩展 | 新增页不带来曝光或使用 |

---

## 15. P1 / P2 路线图

### 15.1 P1

适合在 MVP 有数据后做：

- Total Hydration Calculator 独立增强。
- Levain Calculator。
- Poolish Calculator。
- Biga Calculator。
- Yeast to Sourdough Converter。
- More pizza presets。
- PDF export。
- More unit conversions。
- More flour blend support。
- Keep screen awake toggle。

### 15.2 P2

谨慎做：

- Desired Dough Temperature Calculator。
- Enriched dough hydration estimator。
- Pan size converter。
- Cups to grams converter。
- Recipe note local-only storage。
- PWA install prompt。
- Print template customization。

### 15.3 P3 / 暂不做

- 账号系统。
- 云端 recipe library。
- Baking journal。
- Feeding reminder。
- AI recipe generation。
- Community recipes。
- Photo uploads。
- Nutrition tracking。

---

## 16. 具体任务 Backlog

### Epic A：工程初始化

- A1 创建 Next.js 项目。
- A2 配置 TypeScript strict。
- A3 配置 Tailwind。
- A4 本地测试工具链已从当前包移除。
- A5 历史 lint 任务已从当前包移除。
- A6 创建基础 layout。
- A7 创建 footer legal links。
- A8 创建 sitemap / robots。

### Epic B：公式库

- B1 定义 baking types。
- B2 实现 baker percentage。
- B3 实现 percentage to grams。
- B4 实现 target dough weight 反推。
- B5 实现 starter hydration split。
- B6 实现 total hydration。
- B7 实现 starter feeding ratio。
- B8 实现 dough scaling。
- B9 实现 pizza dough。
- B10 实现 validation warnings。
- B11 历史测试任务已从当前包移除。

### Epic C：通用组件

- C1 NumberField。
- C2 UnitToggle。
- C3 CalculatorShell。
- C4 WarningList。
- C5 IngredientTable。
- C6 HydrationBreakdown。
- C7 CopyButton。
- C8 ShareUrlButton。
- C9 PrintableRecipeCard。
- C10 RelatedTools。
- C11 AdSlot 占位。
- C12 AffiliatePanel 占位。

### Epic D：核心工具

- D1 Baker’s Percentage Calculator。
- D2 Sourdough Hydration Calculator。
- D3 Starter Feeding Calculator。
- D4 Dough Scaling Calculator。
- D5 Pizza Dough Calculator。
- D6 每个工具接 URL state。
- D7 每个工具接 copy / print / share。
- D8 每个工具接 warning。

### Epic E：页面和 SEO

- E1 pageData。
- E2 首页。
- E3 5 个核心工具页。
- E4 10 个长尾 preset 页。
- E5 generateMetadata。
- E6 canonical。
- E7 sitemap 自动生成。
- E8 robots。
- E9 visible FAQ。
- E10 related internal links。
- E11 no duplicate title / description。

### Epic F：合规和变现

- F1 Privacy。
- F2 Disclaimer。
- F3 About。
- F4 Affiliate disclosure。
- F5 AdSense slot placement。
- F6 Print hide ads。
- F7 Analytics events。
- F8 不记录完整配方数据。

### Epic G：QA 和上线

- G1 本地 test 已从当前工作流移除。
- G2 本地 build 不在当前工作流中执行。
- G3 mobile QA。
- G4 print QA。
- G5 URL share QA。
- G6 sitemap QA。
- G7 robots QA。
- G8 AdSense layout QA。
- G9 GSC submission。
- G10 30/90 天数据复盘。

---

## 17. 开发优先级总表

| 优先级 | 内容 | 是否阻塞上线 |
|---|---|---|
| P0 | 公式库正确 | 是 |
| P0 | 5 个核心计算器 | 是 |
| P0 | 移动端输入可用 | 是 |
| P0 | copy / print / share | 是 |
| P0 | privacy / disclaimer | 是 |
| P0 | sitemap / robots / canonical | 是 |
| P0 | no meta keywords | 是 |
| P1 | 长尾 preset 页 | 部分 |
| P1 | affiliate panel | 否 |
| P1 | AdSense slot | 否 |
| P1 | analytics events | 强烈建议 |
| P2 | PWA | 否 |
| P2 | PDF export | 否 |
| P2 | yeast converter | 否 |
| P3 | account system | 不做 |

---

## 18. 开发验收清单

上线前必须全部满足：

- [ ] 5 个核心工具可访问。
- [ ] 所有工具在移动端可正常输入。
- [ ] 核心公式通过源码审计和线上手动检查。
- [ ] starter 50%、100%、125% hydration 拆分正确。
- [ ] target dough weight 反推正确。
- [ ] pizza dough ball weight 计算正确。
- [ ] 结果可复制。
- [ ] 结果可打印。
- [ ] URL 可分享并恢复状态。
- [ ] 错误输入不崩溃。
- [ ] warning 文案清楚。
- [ ] 每个页面 title / description 独立。
- [ ] canonical 正确。
- [ ] sitemap.xml 正确。
- [ ] robots.txt 正确。
- [ ] 无 meta keywords。
- [ ] about / privacy / disclaimer 可访问。
- [ ] 广告不靠近输入和按钮。
- [ ] 打印模式不显示广告。
- [ ] 不上传用户配方数据。
- [ ] 不要求登录。
- [ ] Vercel production build should complete after deployment.
- [ ] Manual browser checks should pass after deployment.
- [ ] 无控制台错误。

---

## 19. 给代码 AI 的执行提示词

下面这段可以直接交给代码 AI 执行开发：

```txt
你现在负责开发一个英文免费工具站：Sourdough Baker’s Math Calculator / Bread Formula Calculator。

严格按本开发计划执行。第一版只做 MVP，不做账号、不做云端保存、不做 AI 食谱、不做食谱库、不做复杂发酵预测。

技术栈使用 Next.js App Router + TypeScript + Tailwind。

开发顺序必须是：
1. 先实现 src/lib/bakingMath.ts、types、validation、rounding，并保持公式集中、可审计；
2. 再实现通用 UI 组件；
3. 再实现 5 个核心计算器；
4. 再实现页面矩阵、metadata、sitemap、robots；
5. 最后做合规页、广告位占位、affiliate 占位、analytics 事件。

所有公式必须集中在纯函数中，React 组件不得直接写公式。
所有核心输入和结果必须支持 URL 状态分享、复制、打印。
移动端优先，输入必须使用数字输入和 stepper，不要只用 slider。
不得添加 meta keywords。
不得把广告放在输入框、Calculate 按钮、结果表格内部或打印页。
不得上传或保存用户配方数据。

完成后不要运行本地 test / lint / typecheck / build。部署后检查 Vercel production build log，并输出完成项、线上检查结果、未完成项和风险。
```

---

## 20. 最终执行策略

本项目应先验证“计算器是否有人用”，再扩页面。不要一开始追求大规模内容矩阵。

最小上线组合：

- 首页
- 5 个核心工具页
- 5–10 个长尾 preset 页
- About
- Privacy
- Disclaimer
- Sitemap
- Robots

上线后看 30–90 天数据。如果 `calculate_click`、`copy_result`、`print_recipe` 有真实使用，再扩展 yeast converter、levain、poolish、biga、DDT、PWA。否则不要继续堆文章。
