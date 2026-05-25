# 面包 / 酸种烘焙百分比工具站需求文档

版本：v1.0  
日期：2026-05-24  
项目类型：英文免费工具站 / 内容 + 工具小矩阵  
建议站点方向：Sourdough Baker’s Math Calculator / Bread Formula Calculator  
目标：用轻量、准确、可复用的网页计算器，解决家庭烘焙用户在面包、酸种、披萨面团中的百分比、水合度、酵种喂养、配方缩放问题。

---

## 0. 文档结论

本项目不是泛食谱站，也不是 AI 食谱生成站，而是一个围绕 **baker’s percentage、sourdough hydration、starter feeding、dough scaling、pizza dough calculation** 的英文计算工具矩阵。

该方向可以做，但不应作为最高优先级主站投入。它适合作为一个轻量英文工具站或副站验证：

- 公式稳定；
- 用户输入不敏感；
- 结果即时；
- 复用性强；
- 与厨房秤、荷兰锅、发酵篮、刮板、温度计、烘焙课程等 affiliate 商品自然邻接；
- AdSense 可放在结果区下方、FAQ 中段、桌面侧栏；
- 核心风险是工具词盘子小于食谱大盘，不能一开始做成大内容站。

第一版必须聚焦“计算”而非“食谱”。用户真正需要的是：输入目标面团重量、面包个数、水合度、starter 比例、starter 水合度、盐比例、面粉比例，然后自动反推出克数，并解释 total hydration 与 starter 内部水粉的关系。

---

## 1. 项目背景

### 1.1 为什么这个方向可以做

面包和酸种烘焙用户经常遇到一个固定问题：配方不是按“一个标准答案”执行，而是需要根据自己的面包大小、面粉类型、starter 活性、烤箱容量、发酵时间和家庭人数调整比例。

典型情况：

- 原配方做 1 个 900g 面包，用户想做 2 个 750g 面包；
- 原配方只给面粉重量，用户想按目标总面团重量反推；
- 用户知道想做 75% hydration，但不知道水、粉、starter 应该各放多少；
- 配方用了 100% hydration starter，但用户不知道 starter 里的粉和水是否要计入总水合度；
- 用户想做 1:2:2 或 1:5:5 starter feeding，但不知道应该保留多少 seed starter、加多少粉和水；
- pizza 用户按 dough ball weight 做多个面团球，需要反推 flour、water、salt、yeast 或 starter；
- 用户每次换面粉、换面包数量、换水合度都要重新算。

这些问题具备工具站所需的核心特征：明确输入、明确输出、结果即时、复用频率高、低敏感、可解释、可打印、可复制。

### 1.2 为什么不能做成泛食谱站

泛食谱站的问题：

- 竞争极强，前排有大型烘焙博客、YouTube、Pinterest、社交平台、食谱网站；
- 用户搜索“sourdough bread recipe”时不一定有工具意图；
- 食谱内容需要长期原创、拍照、试做、更新；
- AI 也能生成大量普通食谱，泛内容防御力低；
- AdSense 流量可能大，但新站进入难度高；
- 用户看完食谱后未必会使用计算器。

本项目应切入“计算型搜索意图”，例如：

- baker percentage calculator
- sourdough hydration calculator
- starter feeding calculator
- dough scaling calculator
- sourdough starter ratio 1:2:2
- total hydration calculator
- pizza dough percentage calculator
- dough weight calculator

这些词的用户更接近“马上要操作”，适合免费工具站。

---

## 2. 产品定位

### 2.1 一句话定位

A simple baker’s percentage, sourdough hydration, starter feeding, and dough scaling calculator for home bakers.

中文解释：一个帮助家庭烘焙用户快速计算面包配方百分比、酸种水合度、酵种喂养比例、面团缩放和披萨面团克数的免费网页工具。

### 2.2 产品核心承诺

用户输入目标面团重量、面包数量、水合度、starter 比例、starter 水合度、盐比例后，页面立即输出：

- 总面粉重量；
- 总水重量；
- starter / levain 重量；
- starter 内部拆分出的粉和水；
- added water；
- total hydration；
- salt；
- 单个面包或单个 dough ball 的分配；
- 可复制、可打印的配方卡。

### 2.3 产品不承诺

本工具不承诺：

- 自动生成完美食谱；
- 精准预测发酵时间；
- 替代用户对面团状态的判断；
- 替代专业烘焙课程；
- 根据温度、湿度、面粉品牌和 starter 活性给出绝对准确结果；
- 解决所有 enriched dough 的复杂水分换算；
- 保存用户云端数据；
- 作为营养、健康或医疗建议。

---

## 3. 目标用户

### 3.1 酸种新手

特征：

- 刚开始养 starter；
- 看不懂 baker’s percentage；
- 不理解 70% hydration；
- 不知道 starter 里的水和粉是否算进总配方；
- 容易用杯量而不是克重；
- 需要默认值、解释和错误提示。

核心需求：

- “我想做一个简单酸种面包，告诉我面粉、水、starter、盐各多少克。”
- “100g starter 里到底有多少水和多少粉？”
- “为什么 70% hydration 面团还是很湿？”
- “1:2:2 喂养到底是几克 starter、几克水、几克粉？”

### 3.2 稳定烘焙的家庭用户

特征：

- 每周或经常烘焙；
- 会反复调整面包数量、面团重量、水合度；
- 可能使用 spreadsheet；
- 需要快速、准确、可打印；
- 手机端厨房场景强。

核心需求：

- “我要做 2 个 750g loaf，不想手算。”
- “我想把 900g 配方变成 3 个小面包。”
- “我希望复制配方到笔记。”
- “我想打印一个简洁的 recipe card。”

### 3.3 进阶酸种用户

特征：

- 理解 starter / levain / preferment；
- 会关心 total hydration、prefermented flour、starter hydration；
- 可能使用多种面粉；
- 会检查公式是否严谨。

核心需求：

- “starter 是 80% hydration，不是 100%，请正确拆分。”
- “我想知道 added hydration 和 total hydration 的区别。”
- “我想控制 prefermented flour percentage。”
- “我想混合 bread flour、whole wheat、rye。”

### 3.4 Pizza / Focaccia 用户

特征：

- 关注 dough ball weight；
- 经常做多个 pizza；
- 需要按 hydration、salt、yeast、oil 计算；
- 不一定是酸种用户。

核心需求：

- “我要做 3 个 280g dough balls。”
- “我想做 65% hydration pizza dough。”
- “我要按总面团重量反推面粉和水。”
- “我想把 yeast pizza 改成 sourdough pizza。”

---

## 4. 四关模型判断

### 4.1 主动搜索

判断：中高。

用户会主动搜索 calculator 词，例如：

- baker percentage calculator
- sourdough hydration calculator
- starter feeding calculator
- dough scaling calculator
- pizza dough calculator
- total hydration calculator
- sourdough starter ratio 1:2:2

这些词有明确工具意图，不是单纯学习概念。

### 4.2 可进入性

判断：中等。

竞争已经存在：

- The Perfect Loaf 等强内容站；
- Foodgeek、Flourwise 等工具型页面；
- Reddit 用户自制工具；
- 各类 pizza dough calculator。

但仍有机会：

- 很多工具页面解释不够清楚；
- 一些工具过于复杂；
- 一些工具移动端不好用；
- 很多工具没有把 starter hydration、total hydration、target dough weight、print-friendly recipe card 结合好；
- 长尾词可以拆分页面；
- 新站可用更清晰的 UI 和更窄的搜索意图进入。

### 4.3 真实使用 / 复用

判断：强。

每次烘焙都可能重新计算：

- 面包数量变了；
- 面团目标重量变了；
- 水合度变了；
- starter 比例变了；
- starter hydration 变了；
- 面粉种类变了；
- pizza dough ball 数量变了；
- 喂养时间和比例变了。

这不是一次性答案型需求，而是高复用工具需求。

### 4.4 商业邻接

判断：中等。

用户下一步可能购买：

- kitchen scale；
- Dutch oven；
- banneton；
- bread lame；
- bench scraper；
- thermometer；
- proofing box；
- pizza steel；
- pizza oven；
- bread flour；
- rye flour；
- whole wheat flour；
- bread books；
- sourdough course。

但商业强度不如 HVAC、板材切割、Amazon seller 工具。该项目更适合 AdSense + 轻 affiliate，不适合重付费转化。

---

## 5. 真实需求拆解

### 5.1 需求 A：从目标面团重量反推原料

用户说法：

- “I want to make two 750g loaves.”
- “How much flour and water do I need for a 900g dough?”
- “Can I calculate from final dough weight instead of flour weight?”

产品需求：

- 提供 Target Dough Weight 模式；
- 用户输入总面团重量或单个面包重量 × 数量；
- 用户输入 hydration、starter%、salt%；
- 系统反推出 flour、water、starter、salt；
- 输出 total dough weight 校验。

优先级：P0。

### 5.2 需求 B：从面粉重量计算 baker’s percentage

用户说法：

- “I have 500g flour, what is 75% hydration?”
- “How do I calculate salt at 2%?”
- “How much water for 80% hydration?”

产品需求：

- 提供 Flour Weight 模式；
- 面粉固定为 100%；
- 其他配料按百分比生成克数；
- 支持添加自定义配料；
- 输出表格：ingredient、weight、baker’s %。

优先级：P0。

### 5.3 需求 C：starter 内部水粉拆分

用户说法：

- “Does starter count toward hydration?”
- “My starter is 100% hydration. Is it half flour and half water?”
- “Why is my total hydration different from the recipe hydration?”

产品需求：

- 输入 starter weight；
- 输入 starter hydration；
- 计算 starter flour 与 starter water；
- 区分 added water 与 total water；
- 输出 added hydration 与 total hydration；
- 页面解释公式。

优先级：P0。

### 5.4 需求 D：多面包 / 多份量缩放

用户说法：

- “I want to make 6 loaves.”
- “How do I scale this recipe to 3 loaves?”
- “I bake every week and need a printable formula.”

产品需求：

- 输入 loaf count；
- 输入 target weight per loaf；
- 输出总配方和单个面包配方；
- 支持 copy / print；
- 支持 share URL；
- 移动端可读。

优先级：P0。

### 5.5 需求 E：starter feeding ratio

用户说法：

- “How much starter, flour and water for 1:2:2?”
- “I need 100g active starter tomorrow.”
- “How much seed starter should I keep?”

产品需求：

- 输入目标 starter 总量；
- 输入比例 seed:flour:water，例如 1:2:2；
- 可选择保留额外 starter，例如 extra 10g；
- 输出 seed starter、flour、water；
- 提供 1:1:1、1:2:2、1:3:3、1:5:5 快捷预设。

优先级：P0。

### 5.6 需求 F：pizza dough ball calculator

用户说法：

- “I want 3 pizza balls at 280g each.”
- “How much flour for 65% hydration pizza dough?”
- “How much salt and yeast do I need?”

产品需求：

- 输入 pizza count；
- 输入 dough ball weight；
- 输入 hydration；
- 输入 salt%；
- 输入 yeast% 或 starter%；
- 可选 oil%；
- 输出总配方和单个 dough ball 配方。

优先级：P0。

### 5.7 需求 G：多面粉比例

用户说法：

- “I use 80% bread flour and 20% whole wheat.”
- “How much rye flour if I want 10%?”
- “Does whole wheat need more water?”

产品需求：

- 支持多个 flour line；
- 每种 flour 输入百分比；
- 系统校验总面粉百分比 = 100%；
- 输出各面粉克数；
- 对 whole wheat / rye 给出吸水性提示，但不自动承诺精准调整。

优先级：P1。

### 5.8 需求 H：厨房移动端使用

用户说法：

- “I use this on my phone while baking.”
- “Sliders are hard to adjust.”
- “I need a print or copy button.”

产品需求：

- 所有核心参数必须支持数字输入；
- 快捷按钮只作为辅助；
- slider 不能作为唯一输入方式；
- ± 1%、± 10g 微调；
- 结果卡片大字号；
- copy / print 按钮固定清晰；
- 不插入遮挡式广告。

优先级：P1。

---

## 6. MVP 范围

### 6.1 第一版必须做

第一版包含 5 个核心工具：

1. Baker’s Percentage Calculator
2. Sourdough Hydration Calculator
3. Starter Feeding Calculator
4. Dough Scaling Calculator
5. Pizza Dough Calculator

每个工具必须包含：

- 输入表单；
- 即时计算；
- 输入校验；
- 结果表格；
- 公式解释；
- 常见问题；
- copy result；
- print recipe；
- shareable URL；
- 移动端适配；
- 无需登录；
- 不上传文件；
- 不保存云端数据。

### 6.2 第一版禁止做

第一版不做：

- AI 食谱生成；
- 用户账号；
- 云端保存；
- 社区评论；
- 图片上传；
- starter 活性识别；
- 发酵时间精准预测；
- 温湿度动态模型；
- 面粉品牌数据库；
- 营养计算；
- 购物车；
- 付费会员；
- 复杂食谱库；
- 多语言；
- 移动 App；
- 后端数据库。

### 6.3 可延后到第二版

第二版可考虑：

- multi-flour blend；
- prefermented flour mode；
- levain calculator；
- poolish calculator；
- biga calculator；
- enriched dough liquid estimator；
- localStorage 保存最近配方；
- recipe compare；
- yeast to sourdough converter；
- sourdough pizza calculator；
- starter peak timing helper；
- dark mode；
- printable PDF。

---

## 7. 信息架构

### 7.1 顶层页面结构

建议路径：

```text
/
  Home
/bakers-percentage-calculator
/sourdough-hydration-calculator
/starter-feeding-calculator
/dough-scaling-calculator
/pizza-dough-calculator
/total-hydration-calculator
/sourdough-starter-ratio-1-2-2
/sourdough-starter-ratio-1-5-5
/pizza-dough-ball-weight-calculator
/bread-recipe-scaler
/guides/bakers-percentage
/guides/total-hydration-vs-added-hydration
/guides/sourdough-starter-feeding-ratios
/guides/how-to-scale-bread-recipes
/about
/privacy
/disclaimer
```

### 7.2 首页职责

首页不应是泛博客首页，而应是工具导航页。

首页首屏：

- H1：Bread & Sourdough Calculator
- 副标题：Calculate baker’s percentages, sourdough hydration, starter feedings, dough scaling, and pizza dough weights.
- 五个工具卡片：
  - Baker’s Percentage Calculator
  - Sourdough Hydration Calculator
  - Starter Feeding Calculator
  - Dough Scaling Calculator
  - Pizza Dough Calculator
- 一个简短解释：All calculations run in your browser. No login. No uploads.
- FAQ 与内部链接。

### 7.3 工具页标准结构

每个工具页结构：

1. H1，明确包含目标关键词；
2. 1–2 句说明；
3. 工具输入区；
4. 结果区；
5. copy / print / reset；
6. 公式说明；
7. 示例；
8. 常见错误；
9. FAQ；
10. 相关工具链接；
11. Disclaimer；
12. AdSense 位点。

---

## 8. 核心工具需求

## 8.1 Baker’s Percentage Calculator

### 8.1.1 用户目标

用户输入一个面包配方的克数，系统自动计算每个配料的 baker’s percentage；或输入百分比，系统按目标面粉重量生成克数。

### 8.1.2 输入字段

基础模式：

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---:|---|
| total flour weight | number | 500g | 总面粉重量 |
| hydration | number | 75% | 水占总粉百分比 |
| starter | number | 20% | starter 总重量占总粉百分比 |
| salt | number | 2% | 盐占总粉百分比 |
| unit | select | g | g / oz / lb |

高级模式：

| 字段 | 类型 | 说明 |
|---|---|---|
| custom ingredients | array | 添加 oil、sugar、honey、seeds 等 |
| ingredient weight | number | 配料克数 |
| ingredient percentage | number | 配料百分比 |
| lock mode | select | 锁定克数或锁定百分比 |

### 8.1.3 输出字段

| 输出 | 说明 |
|---|---|
| flour | 面粉克数 |
| water | 水克数 |
| starter | starter 克数 |
| salt | 盐克数 |
| total dough weight | 总面团重量 |
| baker’s percentage table | 每个配料的百分比 |
| copy formula | 可复制配方 |
| print recipe card | 可打印配方卡 |

### 8.1.4 核心公式

```text
baker_percentage = ingredient_weight / total_flour_weight * 100

ingredient_weight = total_flour_weight * baker_percentage / 100

total_dough_weight = sum(all_ingredient_weights)
```

### 8.1.5 校验规则

- total flour weight 必须 > 0；
- hydration 建议范围 50–120%；
- salt 建议范围 0–4%；
- starter 建议范围 0–60%；
- 若输入超过建议范围，允许计算，但显示提示；
- 不允许负数；
- 单位切换后保留等价重量。

### 8.1.6 示例

输入：

```text
Flour: 500g
Hydration: 75%
Starter: 20%
Salt: 2%
```

输出：

```text
Flour: 500g
Water: 375g
Starter: 100g
Salt: 10g
Total dough: 985g
```

注意：此处 starter 被当作配料总重量。如果要计算 total hydration，需要进入 Sourdough Hydration Calculator。

---

## 8.2 Sourdough Hydration Calculator

### 8.2.1 用户目标

用户输入主面团中的 flour、water、starter weight、starter hydration，系统拆分 starter 内部水粉，计算 added hydration 和 total hydration。

### 8.2.2 输入字段

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---:|---|
| main flour | number | 500g | 主面团外加面粉 |
| added water | number | 350g | 主面团外加水 |
| starter weight | number | 100g | 加入面团的 starter 总重量 |
| starter hydration | number | 100% | starter 水合度 |
| salt weight | number | 10g | 盐 |
| unit | select | g | g / oz / lb |

### 8.2.3 输出字段

| 输出 | 说明 |
|---|---|
| starter flour | starter 中的面粉重量 |
| starter water | starter 中的水重量 |
| total flour | main flour + starter flour |
| total water | added water + starter water |
| added hydration | added water / main flour |
| total hydration | total water / total flour |
| salt percentage | salt / total flour |
| total dough weight | 总面团重量 |

### 8.2.4 核心公式

starter hydration 定义：

```text
starter_hydration = starter_water / starter_flour * 100
```

已知 starter total weight 与 starter hydration，拆分：

```text
starter_flour = starter_weight / (1 + starter_hydration / 100)

starter_water = starter_weight - starter_flour
```

总水合度：

```text
total_flour = main_flour + starter_flour

total_water = added_water + starter_water

total_hydration = total_water / total_flour * 100

added_hydration = added_water / main_flour * 100

salt_percentage = salt_weight / total_flour * 100
```

### 8.2.5 必须解释的概念

页面必须解释：

- 100% hydration starter 不是“100% 水”，而是 water weight = flour weight；
- 100g 100% hydration starter = 50g flour + 50g water；
- total hydration 会把 starter 内部水粉计入；
- added hydration 只看外加水和外加面粉；
- 很多配方写的 hydration 可能不统一，有些包含 starter，有些不包含；
- 本工具默认把 starter 的水粉计入 total hydration。

### 8.2.6 示例

输入：

```text
Main flour: 500g
Added water: 350g
Starter: 100g
Starter hydration: 100%
Salt: 10g
```

输出：

```text
Starter flour: 50g
Starter water: 50g
Total flour: 550g
Total water: 400g
Added hydration: 70%
Total hydration: 72.7%
Salt: 1.82%
```

### 8.2.7 错误提示

| 情况 | 提示 |
|---|---|
| starter hydration = 0 | “A 0% hydration starter would contain no water. Check this value.” |
| starter hydration > 200 | “This is unusually liquid. The calculator can still run, but check your input.” |
| total hydration > 100% | “This is a very high hydration dough and may be difficult to handle.” |
| salt percentage > 3% | “This is saltier than most bread formulas.” |

---

## 8.3 Dough Scaling Calculator

### 8.3.1 用户目标

用户从目标面团重量或单个面包重量出发，反推出完整配方。

### 8.3.2 输入字段

模式 A：目标总面团重量

| 字段 | 类型 | 默认值 |
|---|---|---:|
| target total dough weight | number | 1000g |
| hydration | number | 75% |
| starter percentage | number | 20% |
| starter hydration | number | 100% |
| salt percentage | number | 2% |
| loaf count | number | 1 |

模式 B：目标单个面包重量

| 字段 | 类型 | 默认值 |
|---|---|---:|
| target weight per loaf | number | 750g |
| loaf count | number | 2 |
| hydration | number | 75% |
| starter percentage | number | 20% |
| starter hydration | number | 100% |
| salt percentage | number | 2% |

### 8.3.3 关键定义

第一版必须选择一种 starter percentage 定义，避免混乱。

默认定义：

```text
starter percentage = starter total weight / total flour weight * 100
```

高级模式未来可增加：

```text
prefermented flour percentage = starter flour / total flour weight * 100
```

第一版不默认启用 prefermented flour mode，避免新手混淆。

### 8.3.4 核心公式

假设：

```text
W = target total dough weight
H = hydration percentage
S = starter percentage by total starter weight
SH = starter hydration percentage
Salt = salt percentage
F = total flour
```

starter 总重量：

```text
starter_weight = F * S / 100
```

starter 内部面粉：

```text
starter_flour = starter_weight / (1 + SH / 100)
```

starter 内部水：

```text
starter_water = starter_weight - starter_flour
```

总水：

```text
total_water = F * H / 100
```

外加水：

```text
added_water = total_water - starter_water
```

盐：

```text
salt_weight = F * Salt / 100
```

总面团：

```text
W = F + total_water + salt_weight
```

注意：因为 starter 已经被拆为 flour + water，不能再额外把 starter_weight 加入总面团，否则会重复计算。

所以：

```text
F = W / (1 + H/100 + Salt/100)
```

然后由 F 计算 starter_weight、starter_flour、starter_water、added_water。

但如果界面把 starter 作为“额外配料”而不是拆分进总粉总水，则公式不同。第一版必须统一使用“starter 拆分进总粉总水”的酸种严谨模式。

### 8.3.5 输出字段

| 输出 | 说明 |
|---|---|
| total flour | 总粉 |
| added flour | 需要额外加入的主面团粉 |
| starter flour | starter 内部粉 |
| total water | 总水 |
| added water | 需要额外加入的水 |
| starter water | starter 内部水 |
| starter weight | starter 总重量 |
| salt | 盐 |
| total dough weight | 校验总面团 |
| per loaf weight | 每个面包重量 |
| per loaf ingredient split | 单个面包等比例拆分 |

### 8.3.6 示例

输入：

```text
Target dough: 1000g
Hydration: 75%
Starter: 20% of total flour
Starter hydration: 100%
Salt: 2%
```

计算：

```text
total flour = 1000 / (1 + 0.75 + 0.02) = 564.97g
total water = 423.73g
salt = 11.30g
starter weight = 112.99g
starter flour = 56.50g
starter water = 56.50g
added flour = 508.47g
added water = 367.23g
```

输出显示：

```text
Add to bowl:
508g flour
367g water
113g active starter
11g salt

Formula totals:
565g total flour
424g total water
75% total hydration
1000g total dough
```

### 8.3.7 必须避免的错误

不能同时把 starter 当成完整配料加入总重量，又把 starter 内部粉水计入 total flour / total water。这样会重复计算。

结果展示必须区分：

- Add to bowl：用户实际称量加入的东西；
- Formula totals：理论总粉、总水、总水合度。

---

## 8.4 Starter Feeding Calculator

### 8.4.1 用户目标

用户根据目标 starter 总重量和喂养比例，计算 seed starter、flour、water。

### 8.4.2 输入字段

| 字段 | 类型 | 默认值 |
|---|---|---:|
| target starter amount | number | 100g |
| ratio seed | number | 1 |
| ratio flour | number | 2 |
| ratio water | number | 2 |
| extra starter to keep | number | 10g |
| flour type | optional | bread flour |
| unit | select | g |

快捷按钮：

- 1:1:1
- 1:2:2
- 1:3:3
- 1:5:5
- 1:10:10

### 8.4.3 核心公式

```text
ratio_total = seed_ratio + flour_ratio + water_ratio

seed_starter = target_starter_amount * seed_ratio / ratio_total

flour = target_starter_amount * flour_ratio / ratio_total

water = target_starter_amount * water_ratio / ratio_total
```

如果用户设置 extra starter to keep：

```text
final_target = starter_needed_for_recipe + extra_starter_to_keep
```

### 8.4.4 输出字段

| 输出 | 说明 |
|---|---|
| seed starter | 保留旧 starter |
| flour to add | 加粉 |
| water to add | 加水 |
| final starter | 最终 starter 总量 |
| hydration | 喂养后的水合度 |
| amount available for recipe | 可用于配方的 starter |
| amount left to keep | 留种量 |

### 8.4.5 示例

输入：

```text
Need 100g starter for recipe
Keep 10g extra
Ratio 1:2:2
```

计算目标：

```text
final target = 110g
ratio total = 5
seed = 22g
flour = 44g
water = 44g
```

输出：

```text
Mix 22g starter + 44g flour + 44g water.
This gives 110g starter: 100g for your dough and 10g to keep.
```

### 8.4.6 时间提示边界

第一版可以给弱提示，但不能做强预测。

示例提示：

```text
Higher feeding ratios usually take longer to peak. Actual timing depends on temperature, flour, starter activity, and hydration.
```

不要输出“几小时后一定达到 peak”的确定结论。

---

## 8.5 Pizza Dough Calculator

### 8.5.1 用户目标

用户按 pizza 数量和单个 dough ball 重量反推配方。

### 8.5.2 输入字段

| 字段 | 类型 | 默认值 |
|---|---|---:|
| number of pizzas | number | 3 |
| dough ball weight | number | 280g |
| hydration | number | 65% |
| salt | number | 2.5% |
| yeast | number | 0.2% |
| oil | number | 0% |
| sugar | number | 0% |
| starter mode | toggle | off |
| starter percentage | number | 20% |
| starter hydration | number | 100% |

### 8.5.3 输出字段

| 输出 | 说明 |
|---|---|
| total dough weight | 总面团重量 |
| total flour | 总粉 |
| water | 水 |
| salt | 盐 |
| yeast or starter | 酵母或 starter |
| oil | 油 |
| sugar | 糖 |
| per dough ball | 每个 dough ball 重量 |
| per ball flour equivalent | 单球等效配料拆分 |

### 8.5.4 核心公式

普通 yeast pizza：

```text
target_total = pizza_count * dough_ball_weight

total_percentage = 100 + hydration + salt + yeast + oil + sugar

flour = target_total / (total_percentage / 100)

water = flour * hydration / 100

salt_weight = flour * salt / 100

yeast_weight = flour * yeast / 100

oil_weight = flour * oil / 100

sugar_weight = flour * sugar / 100
```

酸种 pizza 模式使用 sourdough scaling 逻辑，starter 拆分为水粉。

### 8.5.5 默认值建议

- Neapolitan-ish：60–65% hydration，2.5–3% salt，0–2% oil；
- Pan pizza / focaccia-ish：70–85% hydration；
- 不要声称某个风格绝对标准；
- 仅作为 preset。

---

## 9. 页面矩阵与 SEO 需求

### 9.1 第一批 25 个页面

| URL | 主关键词 | 页面类型 | 工具模块 | 意图 |
|---|---|---|---|---|
| /bakers-percentage-calculator | baker percentage calculator | 工具页 | Baker’s % | 克数与百分比互转 |
| /sourdough-hydration-calculator | sourdough hydration calculator | 工具页 | Hydration | 算总水合度 |
| /starter-feeding-calculator | sourdough starter feeding calculator | 工具页 | Feeding | 算 1:x:y 喂养 |
| /dough-scaling-calculator | dough scaling calculator | 工具页 | Scaling | 按目标重量缩放 |
| /pizza-dough-calculator | pizza dough calculator | 工具页 | Pizza | pizza 面团计算 |
| /total-hydration-calculator | total hydration calculator | 工具页 | Hydration | starter 计入总水合 |
| /levain-calculator | levain calculator | 工具页 | Feeding | levain 构建 |
| /starter-ratio-calculator | starter ratio calculator | 工具页 | Feeding | 任意 starter ratio |
| /sourdough-starter-ratio-1-2-2 | sourdough starter ratio 1:2:2 | 预设页 | Feeding | 1:2:2 具体算法 |
| /sourdough-starter-ratio-1-5-5 | sourdough starter ratio 1:5:5 | 预设页 | Feeding | 长时间喂养 |
| /sourdough-dough-weight-calculator | sourdough dough weight calculator | 工具页 | Scaling | 目标面团重量 |
| /loaf-scaling-calculator | bread loaf scaling calculator | 工具页 | Scaling | 多面包缩放 |
| /pizza-dough-ball-weight-calculator | pizza dough ball weight calculator | 工具页 | Pizza | dough ball 反推 |
| /poolish-calculator | poolish calculator | 二期页 | Preferment | poolish 计算 |
| /biga-calculator | biga calculator | 二期页 | Preferment | biga 计算 |
| /focaccia-hydration-calculator | focaccia hydration calculator | 二期页 | Hydration | 高水合 focaccia |
| /salt-percentage-calculator | bread salt percentage calculator | 小工具页 | Baker’s % | 盐比例 |
| /multi-flour-bread-calculator | multi flour bread calculator | 二期页 | Flour blend | 多面粉 |
| /whole-wheat-hydration-calculator | whole wheat hydration calculator | 内容 + 工具 | Hydration | 全麦吸水 |
| /bread-recipe-scaler | bread recipe scaler | 工具页 | Scaling | 食谱缩放 |
| /grams-to-bakers-percentage | grams to baker percentage | 工具页 | Baker’s % | 克数转百分比 |
| /bakers-percentage-to-grams | baker percentage to grams | 工具页 | Baker’s % | 百分比转克数 |
| /sourdough-pizza-calculator | sourdough pizza calculator | 二期页 | Pizza + starter | 酸种 pizza |
| /starter-discard-calculator | sourdough discard calculator | 二期页 | Discard | discard 换算 |
| /bread-ingredient-converter | bread ingredient converter | 小工具页 | Unit | g/oz/lb 换算 |

### 9.2 第一版实际建议上线页面

为了避免过度铺页面，第一版先上线：

核心工具页：

1. /bakers-percentage-calculator
2. /sourdough-hydration-calculator
3. /starter-feeding-calculator
4. /dough-scaling-calculator
5. /pizza-dough-calculator

长尾预设页：

6. /total-hydration-calculator
7. /sourdough-starter-ratio-1-2-2
8. /sourdough-starter-ratio-1-5-5
9. /pizza-dough-ball-weight-calculator
10. /bread-recipe-scaler

解释页：

11. /guides/bakers-percentage
12. /guides/total-hydration-vs-added-hydration
13. /guides/sourdough-starter-feeding-ratios
14. /guides/how-to-scale-bread-recipes
15. /guides/why-use-grams-for-bread-baking

### 9.3 页面内容模板

每个页面至少包含：

```text
H1: 包含目标关键词

Intro: 说明这个工具解决什么问题

Calculator: 首屏可用工具

Result: 清晰结果表格

How it works: 公式说明

Example: 一个具体例子

Common mistakes: 常见错误

FAQ: 4–8 个问题

Related tools: 3–5 个内部链接

Disclaimer: 简短说明结果仅供家庭烘焙计算参考
```

### 9.4 标题和描述示例

#### /sourdough-hydration-calculator

Title：

```text
Sourdough Hydration Calculator | Total Hydration With Starter
```

Meta description：

```text
Calculate sourdough total hydration by including the flour and water inside your starter or levain. Get added water, total flour, total water, and salt percentage.
```

#### /starter-feeding-calculator

Title：

```text
Sourdough Starter Feeding Calculator | 1:1:1, 1:2:2, 1:5:5 Ratios
```

Meta description：

```text
Calculate how much starter, flour, and water to feed for any sourdough starter ratio. Includes 1:1:1, 1:2:2, 1:3:3, and 1:5:5 presets.
```

#### /pizza-dough-calculator

Title：

```text
Pizza Dough Calculator | Dough Ball Weight, Hydration, Salt & Yeast
```

Meta description：

```text
Calculate pizza dough by dough ball weight, hydration, salt, yeast, oil, and number of pizzas. Get total flour, water, salt, and per-ball weights.
```

---

## 10. UX / UI 需求

### 10.1 总体原则

- 首屏必须看到工具，不要先展示长文章；
- 输入少、默认值合理；
- 高级参数折叠；
- 结果比解释更重要；
- 移动端优先；
- 厨房场景优先；
- 不强制用户注册；
- 不用文件上传；
- 不用弹窗打断；
- 广告不遮挡输入和结果。

### 10.2 表单设计

输入控件要求：

- number input 是主控件；
- slider 只能作为辅助；
- 每个百分比字段提供 ±1 按钮；
- 每个重量字段提供 ±10g 或 ±25g 按钮；
- 单位切换放在顶部；
- 默认使用 grams；
- oz/lb 作为可选；
- 所有输入实时计算；
- 允许用户点击 Reset 回到默认值。

### 10.3 结果卡片

结果区分两层：

#### Add to Bowl

用户实际要称量加入的东西。

示例：

```text
Add to bowl:
508g bread flour
367g water
113g active starter
11g salt
```

#### Formula Totals

理论配方总量。

示例：

```text
Formula totals:
565g total flour
424g total water
75% total hydration
2% salt
1000g total dough
```

这样可以避免 starter 被拆分后用户不知道该称什么。

### 10.4 移动端要求

移动端必须满足：

- 360px 宽度可用；
- 输入框高度不低于 44px；
- 按钮不低于 44px；
- 结果数字字号足够大；
- copy 按钮清晰；
- 不使用 hover 才能看到的信息；
- 表格可横向滚动或转为卡片；
- sticky bottom ad 禁止遮挡按钮；
- 不要在用户输入过程中弹出插屏广告。

### 10.5 打印样式

打印时只保留：

- 配方名称；
- 输入参数；
- Add to bowl；
- Formula totals；
- 简短 notes；
- 日期；
- 网站名。

打印时隐藏：

- 导航；
- 广告；
- FAQ；
- footer 大段链接；
- 推荐商品；
- 解释文章。

---

## 11. 数据结构设计

### 11.1 RecipeInput

```ts
type Unit = 'g' | 'oz' | 'lb'

type RecipeInput = {
  mode: 'flour-weight' | 'target-dough-weight' | 'per-loaf-weight'
  unit: Unit
  totalFlourWeight?: number
  targetDoughWeight?: number
  loafCount?: number
  weightPerLoaf?: number
  hydrationPercent: number
  starterPercent: number
  starterHydrationPercent: number
  saltPercent: number
  oilPercent?: number
  sugarPercent?: number
  flourBlend?: FlourBlendItem[]
}
```

### 11.2 FlourBlendItem

```ts
type FlourBlendItem = {
  id: string
  name: string
  percent: number
}
```

### 11.3 IngredientResult

```ts
type IngredientResult = {
  name: string
  weightGrams: number
  bakerPercent: number
  displayWeight: string
  role: 'flour' | 'water' | 'starter' | 'salt' | 'oil' | 'sugar' | 'other'
}
```

### 11.4 HydrationResult

```ts
type HydrationResult = {
  mainFlour: number
  addedWater: number
  starterWeight: number
  starterHydrationPercent: number
  starterFlour: number
  starterWater: number
  totalFlour: number
  totalWater: number
  addedHydrationPercent: number
  totalHydrationPercent: number
  saltWeight: number
  saltPercent: number
  totalDoughWeight: number
}
```

### 11.5 StarterFeedingInput

```ts
type StarterFeedingInput = {
  targetStarterAmount: number
  extraStarterToKeep: number
  ratioSeed: number
  ratioFlour: number
  ratioWater: number
  unit: Unit
}
```

### 11.6 StarterFeedingResult

```ts
type StarterFeedingResult = {
  finalTarget: number
  seedStarter: number
  flourToAdd: number
  waterToAdd: number
  starterForRecipe: number
  starterToKeep: number
  resultingHydrationPercent: number
}
```

---

## 12. 核心算法说明

### 12.1 单位转换

内部统一用 grams 计算。

```ts
const OZ_TO_G = 28.349523125
const LB_TO_G = 453.59237

function toGrams(value: number, unit: Unit): number {
  if (unit === 'g') return value
  if (unit === 'oz') return value * OZ_TO_G
  if (unit === 'lb') return value * LB_TO_G
  throw new Error('Unsupported unit')
}

function fromGrams(grams: number, unit: Unit): number {
  if (unit === 'g') return grams
  if (unit === 'oz') return grams / OZ_TO_G
  if (unit === 'lb') return grams / LB_TO_G
  throw new Error('Unsupported unit')
}
```

### 12.2 四舍五入规则

显示规则：

- grams：四舍五入到 1g；
- oz：四舍五入到 0.01 oz；
- lb：四舍五入到 0.001 lb；
- percentage：四舍五入到 0.1%。

内部计算不提前四舍五入，避免累计误差。

### 12.3 Starter 拆分

```ts
function splitStarter(starterWeight: number, starterHydrationPercent: number) {
  const starterFlour = starterWeight / (1 + starterHydrationPercent / 100)
  const starterWater = starterWeight - starterFlour
  return { starterFlour, starterWater }
}
```

### 12.4 Hydration 计算

```ts
function calculateTotalHydration({
  mainFlour,
  addedWater,
  starterWeight,
  starterHydrationPercent,
  saltWeight
}) {
  const { starterFlour, starterWater } = splitStarter(
    starterWeight,
    starterHydrationPercent
  )

  const totalFlour = mainFlour + starterFlour
  const totalWater = addedWater + starterWater

  return {
    starterFlour,
    starterWater,
    totalFlour,
    totalWater,
    addedHydrationPercent: addedWater / mainFlour * 100,
    totalHydrationPercent: totalWater / totalFlour * 100,
    saltPercent: saltWeight / totalFlour * 100,
    totalDoughWeight: mainFlour + addedWater + starterWeight + saltWeight
  }
}
```

### 12.5 从目标总面团重量反推酸种配方

默认把 starter 拆分进总粉总水。

```ts
function calculateSourdoughFromTarget({
  targetDoughWeight,
  hydrationPercent,
  starterPercent,
  starterHydrationPercent,
  saltPercent
}) {
  const totalFlour = targetDoughWeight / (
    1 + hydrationPercent / 100 + saltPercent / 100
  )

  const totalWater = totalFlour * hydrationPercent / 100
  const saltWeight = totalFlour * saltPercent / 100

  const starterWeight = totalFlour * starterPercent / 100
  const { starterFlour, starterWater } = splitStarter(
    starterWeight,
    starterHydrationPercent
  )

  const addedFlour = totalFlour - starterFlour
  const addedWater = totalWater - starterWater

  return {
    totalFlour,
    totalWater,
    saltWeight,
    starterWeight,
    starterFlour,
    starterWater,
    addedFlour,
    addedWater,
    totalDoughWeight: totalFlour + totalWater + saltWeight
  }
}
```

### 12.6 Starter feeding

```ts
function calculateStarterFeeding({
  starterNeededForRecipe,
  extraStarterToKeep,
  ratioSeed,
  ratioFlour,
  ratioWater
}) {
  const finalTarget = starterNeededForRecipe + extraStarterToKeep
  const ratioTotal = ratioSeed + ratioFlour + ratioWater

  const seedStarter = finalTarget * ratioSeed / ratioTotal
  const flourToAdd = finalTarget * ratioFlour / ratioTotal
  const waterToAdd = finalTarget * ratioWater / ratioTotal

  return {
    finalTarget,
    seedStarter,
    flourToAdd,
    waterToAdd,
    starterForRecipe: starterNeededForRecipe,
    starterToKeep: extraStarterToKeep,
    resultingHydrationPercent: waterToAdd / flourToAdd * 100
  }
}
```

---

## 13. 输入校验与错误提示

### 13.1 通用校验

| 字段 | 最小值 | 最大建议值 | 处理 |
|---|---:|---:|---|
| weight | > 0 | 无 | 小于等于 0 阻止计算 |
| hydration | 0 | 150 | 超过 120 提示 |
| starter hydration | 0 | 300 | 超过 200 提示 |
| salt | 0 | 5 | 超过 3 提示 |
| starter percent | 0 | 100 | 超过 60 提示 |
| loaf count | 1 | 99 | 超过 24 提示 |
| pizza count | 1 | 99 | 超过 20 提示 |

### 13.2 提示文本

#### Hydration too high

```text
This is a very high hydration dough. It may be sticky and difficult to handle, especially for beginners.
```

#### Hydration too low

```text
This is a low hydration dough. It may feel stiff and may be better suited for bagels, pretzels, or some pizza styles.
```

#### Salt high

```text
This salt percentage is higher than most bread formulas. Check whether you entered grams or percent correctly.
```

#### Starter too high

```text
This formula uses a large amount of starter. It may ferment faster than expected.
```

#### Added water negative

这种情况可能发生在目标 hydration 很低但 starter 很多时。

```text
Your starter already contributes more water than the target hydration allows. Lower the starter amount, increase target hydration, or use a stiffer starter.
```

### 13.3 计算失败规则

以下情况不显示结果，只显示错误：

- 必填字段为空；
- 重量小于等于 0；
- 分母为 0；
- flour blend 总百分比不等于 100%；
- ratio 总和小于等于 0；
- added water < 0 时，显示错误并解释原因。

---

## 14. 测试用例

### 14.1 Baker’s Percentage Calculator

#### Case 1

输入：

```text
Flour 500g
Water 375g
Salt 10g
```

期望：

```text
Water 75%
Salt 2%
Total dough 885g
```

#### Case 2

输入：

```text
Flour 1000g
Hydration 70%
Salt 2%
```

期望：

```text
Water 700g
Salt 20g
Total dough 1720g
```

### 14.2 Sourdough Hydration Calculator

#### Case 1：100% hydration starter

输入：

```text
Main flour 500g
Added water 350g
Starter 100g
Starter hydration 100%
Salt 10g
```

期望：

```text
Starter flour 50g
Starter water 50g
Total flour 550g
Total water 400g
Added hydration 70%
Total hydration 72.7%
Salt 1.8%
Total dough 960g
```

#### Case 2：50% hydration starter

输入：

```text
Starter 150g
Starter hydration 50%
```

期望：

```text
Starter flour 100g
Starter water 50g
```

### 14.3 Dough Scaling Calculator

#### Case 1：目标 1000g 面团

输入：

```text
Target dough 1000g
Hydration 75%
Starter 20%
Starter hydration 100%
Salt 2%
```

期望近似：

```text
Total flour 565g
Total water 424g
Salt 11g
Starter 113g
Starter flour 56g
Starter water 56g
Added flour 508g
Added water 367g
Total dough 1000g
```

#### Case 2：2 个 750g 面包

输入：

```text
Weight per loaf 750g
Loaf count 2
Hydration 75%
Salt 2%
Starter 20%
Starter hydration 100%
```

期望：

```text
Target total dough 1500g
Per loaf 750g
Total formula scaled correctly
```

### 14.4 Starter Feeding Calculator

#### Case 1：1:2:2，目标 100g

输入：

```text
Target 100g
Ratio 1:2:2
Extra 0g
```

期望：

```text
Seed 20g
Flour 40g
Water 40g
```

#### Case 2：1:2:2，配方要 100g，额外留 10g

输入：

```text
Starter needed 100g
Extra keep 10g
Ratio 1:2:2
```

期望：

```text
Final target 110g
Seed 22g
Flour 44g
Water 44g
```

### 14.5 Pizza Dough Calculator

#### Case 1：3 个 280g pizza

输入：

```text
Pizzas 3
Ball weight 280g
Hydration 65%
Salt 2.5%
Yeast 0.2%
Oil 0
Sugar 0
```

期望：

```text
Target total 840g
Total percentage 167.7%
Flour approx 501g
Water approx 326g
Salt approx 13g
Yeast approx 1g
```

---

## 15. 技术架构建议

### 15.1 前端框架

建议：

- Next.js / React；
- TypeScript；
- 静态页面优先；
- 无数据库；
- 核心计算纯函数；
- 每个工具页面可以 SSG；
- 结果在客户端即时计算；
- 页面内容可用 MDX 或静态数据生成；
- 所有计算函数单独放入 `/lib/calculators`；
- 测试使用 Vitest。

### 15.2 目录结构

```text
src/
  app/
    page.tsx
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
    guides/
      bakers-percentage/
        page.tsx
    privacy/
      page.tsx
    disclaimer/
      page.tsx
  components/
    CalculatorLayout.tsx
    NumberField.tsx
    UnitToggle.tsx
    ResultCard.tsx
    FormulaTable.tsx
    CopyButton.tsx
    PrintButton.tsx
    RelatedTools.tsx
    AdSlot.tsx
  lib/
    calculators/
      bakersPercentage.ts
      hydration.ts
      starterFeeding.ts
      doughScaling.ts
      pizzaDough.ts
    units.ts
    formatting.ts
    validation.ts
  data/
    pages.ts
    faqs.ts
    relatedTools.ts
  tests/
    calculators/
      hydration.test.ts
      starterFeeding.test.ts
      doughScaling.test.ts
```

### 15.3 性能要求

- 首页 Lighthouse Performance 90+；
- 工具页首屏 JS 不应过重；
- 不使用大型图表库；
- 不引入重型 UI 框架；
- 广告脚本不能阻塞首屏工具；
- 字体优先系统字体；
- 图片极少或不用；
- 移动端首屏工具可快速交互。

### 15.4 隐私要求

- 不上传用户数据；
- 不保存云端；
- share URL 只编码参数；
- localStorage 如使用，必须说明仅保存在用户浏览器；
- 不收集用户食谱；
- 不要求登录；
- Privacy 页面明确说明。

---

## 16. AdSense 布局

### 16.1 允许位置

桌面端：

- 工具结果区下方；
- FAQ 中段；
- 右侧栏；
- 文章内容后；
- related tools 上方或下方。

移动端：

- 结果区下方；
- FAQ 中段；
- 页面底部。

### 16.2 禁止位置

不要放在：

- H1 和工具输入之间；
- 输入字段中间；
- Calculate / Copy / Print 按钮附近导致误触；
- sticky bottom 遮挡表单；
- 结果表格内部；
- starter feeding 结果步骤中间；
- 打印区域。

### 16.3 AdSense 过审基础页面

必须有：

- About；
- Privacy Policy；
- Disclaimer；
- Contact 或简单联系入口；
- Sitemap；
- robots.txt；
- 清晰导航；
- 每个工具页有足够原创解释；
- 不使用 meta keywords；
- 不堆砌 AI 生成的空泛内容；
- 不展示误导性健康或营养承诺。

---

## 17. Affiliate 策略

### 17.1 推荐商品类别

适合推荐：

- kitchen scale；
- Dutch oven；
- banneton；
- bench scraper；
- bread lame；
- dough whisk；
- thermometer；
- proofing box；
- pizza steel；
- pizza stone；
- pizza oven；
- bread flour；
- rye flour；
- whole wheat flour；
- sourdough books；
- bread baking course。

### 17.2 放置方式

推荐放在：

- 结果区下方：“Tools that make this formula easier to bake”；
- guide 页面末尾；
- sidebar；
- printable recipe 不放 affiliate；
- starter feeding 页面可推荐 jar、scale；
- pizza 页面可推荐 pizza steel、pizza oven。

### 17.3 文案原则

不要夸大：

```text
Recommended tools for measuring and baking this formula accurately.
```

不要写：

```text
You must buy these to make good bread.
```

### 17.4 第一版是否必须做 affiliate

不是必须。第一版优先验证：

- GSC impressions；
- calculator 使用率；
- 停留；
- 内链点击；
- AdSense 审核基础。

Affiliate 可先保留占位，等有流量后再加。

---

## 18. 内容策略

### 18.1 内容原则

内容必须为工具服务：

- 解释公式；
- 解释容易混淆的概念；
- 给出示例；
- 链回工具；
- 避免泛食谱；
- 避免没有工具意图的长文。

### 18.2 第一批解释页

#### 1. What Is Baker’s Percentage?

内容要点：

- flour = 100%；
- water、salt、starter 都以 total flour 为分母；
- 为什么总百分比超过 100%；
- 如何从百分比转克数；
- 链接到 baker’s percentage calculator。

#### 2. Total Hydration vs Added Hydration

内容要点：

- added hydration 只看外加水；
- total hydration 把 starter 内部水粉计入；
- 100g 100% hydration starter = 50g flour + 50g water；
- 示例；
- 链接到 hydration calculator。

#### 3. Sourdough Starter Feeding Ratios

内容要点：

- 1:1:1、1:2:2、1:5:5 的含义；
- seed starter、flour、water；
- 为什么高比例通常需要更长时间；
- 不承诺准确 peak time；
- 链接到 starter feeding calculator。

#### 4. How to Scale a Bread Recipe

内容要点：

- 从目标总面团重量反推；
- 从单个 loaf weight × loaf count 反推；
- 为什么不要直接按杯量缩放；
- 链接到 dough scaling calculator。

#### 5. Why Use Grams for Bread Baking?

内容要点：

- cups 不稳定；
- 面粉压实程度不同；
- starter 状态不同；
- grams 更适合 baker’s math；
- 链接到所有计算器。

---

## 19. 内部链接策略

### 19.1 工具互链

每个工具页底部必须有：

```text
Related calculators:
- Sourdough Hydration Calculator
- Starter Feeding Calculator
- Dough Scaling Calculator
- Pizza Dough Calculator
```

按上下文调整。

例如 hydration 页面底部：

- Dough Scaling Calculator
- Starter Feeding Calculator
- Total Hydration Calculator
- Baker’s Percentage Calculator

### 19.2 内容页链接到工具

每个 guide 至少链接 3 个相关工具。

### 19.3 长尾预设页链接回主工具

例如 `/sourdough-starter-ratio-1-2-2`：

- 主体使用 Starter Feeding Calculator；
- 默认 ratio 设为 1:2:2；
- 页面解释 1:2:2；
- 链回 `/starter-feeding-calculator`；
- 链到 `/sourdough-starter-ratio-1-5-5`。

---

## 20. 可访问性要求

- 所有 input 有 label；
- 错误提示可被 screen reader 读取；
- 按钮有明确文本；
- 表格有 caption 或 aria-label；
- 颜色不能作为唯一信息；
- 对比度符合 WCAG AA；
- 键盘可操作；
- copy 成功提示不只靠颜色；
- focus 状态明显；
- 打印按钮不是唯一导出方式。

---

## 21. 免责声明

### 21.1 页面短免责声明

```text
This calculator is for home baking reference only. Dough behavior depends on flour, temperature, starter activity, mixing, fermentation, and handling. Use the results as a starting point and adjust based on your dough.
```

### 21.2 中文理解

本工具仅用于家庭烘焙计算参考。实际面团状态会受到面粉种类、温度、starter 活性、搅拌、发酵和操作方式影响。结果不是绝对配方保证。

### 21.3 不要出现的承诺

不要写：

- perfect bread every time；
- guaranteed fermentation time；
- professional bakery formula；
- exact proofing prediction；
- health benefit；
- medical / nutrition claim。

---

## 22. 埋点与指标

### 22.1 必须记录的前端事件

不记录具体用户输入值，只记录行为。

事件：

```text
calculator_view
calculator_input_changed
calculator_result_generated
copy_result_clicked
print_clicked
unit_changed
preset_clicked
related_tool_clicked
faq_expanded
affiliate_clicked
```

### 22.2 关键 KPI

| 指标 | 目标 |
|---|---:|
| 工具页 Calculate / result generated rate | > 20% |
| Copy / print 点击率 | > 3% |
| 相关工具点击率 | > 5% |
| 移动端跳出率 | 逐步下降 |
| 90 天 GSC impressions | > 5,000 |
| 核心页面进入前 50 的关键词数 | > 10 |
| 平均停留 | > 60 秒 |
| 维护时间 | < 2 小时 / 周 |

### 22.3 止损指标

90 天后若出现以下情况，应停止扩张：

- GSC 总曝光低于 5,000；
- 主要工具页没有任何增长趋势；
- result generated rate 低于 8%；
- 用户只看解释页不操作工具；
- 公式争议或错误反馈每周超过 5 小时；
- 内容生产成本明显高于流量回报；
- affiliate 点击长期接近 0；
- AdSense 无法审核通过且页面质量问题难以修复。

---

## 23. 发布计划

### 23.1 阶段 1：MVP 验证

周期：1–2 周。

交付：

- 首页；
- 5 个核心工具页；
- 5 个解释页；
- About；
- Privacy；
- Disclaimer；
- Sitemap；
- robots；
- 基础 analytics；
- 基础 SEO metadata；
- 移动端适配；
- copy / print。

验收标准：

- 所有公式测试通过；
- 移动端可正常使用；
- 结果不出现 starter 重复计算；
- 5 个工具页可索引；
- 无登录、无上传、无敏感数据；
- AdSense 位置不干扰工具。

### 23.2 阶段 2：长尾页面扩展

周期：第 3–6 周。

交付：

- 10 个长尾预设页；
- starter ratio 1:2:2、1:5:5；
- total hydration；
- pizza dough ball；
- bread recipe scaler；
- grams ↔ baker’s percentage；
- 内部链接优化。

验收标准：

- 每个页面有独立搜索意图；
- 不是复制粘贴薄内容；
- 每页都有工具或预设；
- sitemap 更新；
- 页面可被抓取。

### 23.3 阶段 3：根据数据扩展

周期：第 7–12 周。

根据 GSC 和事件数据决定是否做：

- multi-flour calculator；
- levain calculator；
- poolish / biga calculator；
- sourdough pizza calculator；
- local recipe save；
- affiliate 推荐区。

---

## 24. 开发验收清单

### 24.1 功能验收

- [ ] Baker’s Percentage Calculator 可用；
- [ ] Sourdough Hydration Calculator 可用；
- [ ] Starter Feeding Calculator 可用；
- [ ] Dough Scaling Calculator 可用；
- [ ] Pizza Dough Calculator 可用；
- [ ] starter 可按 hydration 拆分；
- [ ] target dough weight 模式不重复计算 starter；
- [ ] copy result 可用；
- [ ] print recipe 可用；
- [ ] unit conversion 可用；
- [ ] share URL 可用；
- [ ] reset 可用；
- [ ] 所有错误提示可读。

### 24.2 SEO 验收

- [ ] 每页唯一 title；
- [ ] 每页唯一 meta description；
- [ ] 每页唯一 H1；
- [ ] canonical 正确；
- [ ] sitemap 正确；
- [ ] robots 正确；
- [ ] 不使用 meta keywords；
- [ ] FAQ 不堆砌；
- [ ] 内部链接自然；
- [ ] 页面可无 JS 看到基础内容。

### 24.3 AdSense 基础验收

- [ ] About 页面；
- [ ] Privacy 页面；
- [ ] Disclaimer 页面；
- [ ] Contact 或联系说明；
- [ ] 无空页面；
- [ ] 无大量重复薄内容；
- [ ] 广告不遮挡核心工具；
- [ ] 没有误导性按钮；
- [ ] 没有下载诱导；
- [ ] 没有健康/医疗承诺。

### 24.4 质量验收

- [ ] 关键公式有单元测试；
- [ ] 移动端 360px 可用；
- [ ] Lighthouse Performance 90+；
- [ ] 无 console error；
- [ ] copy / print 在 Chrome 正常；
- [ ] 表单键盘可操作；
- [ ] 错误边界不会崩溃；
- [ ] 输入异常值能提示。

---

## 25. 风险清单

### 25.1 流量风险

问题：工具词盘子可能小。  
应对：只先做 5 个工具 + 10 个长尾页，不重投入泛内容。

### 25.2 竞争风险

问题：已有 Foodgeek、Flourwise、The Perfect Loaf 等页面。  
应对：更轻、更清楚、更移动端友好、更强调 starter total hydration 与 target dough weight。

### 25.3 公式争议风险

问题：starter%、prefermented flour%、total hydration 定义可能混乱。  
应对：第一版统一定义；高级定义不混用；页面明确说明。

### 25.4 内容稀薄风险

问题：每个页面都像复制粘贴。  
应对：每个长尾页必须有不同场景、默认值、示例和 FAQ。

### 25.5 AdSense 风险

问题：工具页内容太少或像低价值计算器。  
应对：每页补足公式解释、示例、错误说明、FAQ、相关工具，不堆广告。

### 25.6 Affiliate 低转化风险

问题：用户只想算配方，不点击商品。  
应对：Affiliate 不是第一阶段重点；先验证搜索和工具使用。

---

## 26. 推荐的第一版默认参数

### 26.1 Sourdough 默认

```text
Target dough weight: 1000g
Hydration: 75%
Starter: 20%
Starter hydration: 100%
Salt: 2%
Loaf count: 1
```

### 26.2 Starter feeding 默认

```text
Starter needed: 100g
Extra to keep: 10g
Ratio: 1:2:2
```

### 26.3 Pizza 默认

```text
Pizzas: 3
Dough ball weight: 280g
Hydration: 65%
Salt: 2.5%
Yeast: 0.2%
Oil: 0%
```

### 26.4 Baker’s percentage 默认

```text
Flour: 500g
Water: 75%
Starter: 20%
Salt: 2%
```

---

## 27. 给开发 AI 的执行提示

如果把本需求文档交给另一个 AI 开发，应要求它遵守：

1. 先实现纯计算函数和测试；
2. 再实现 5 个工具页面；
3. 再实现首页、about、privacy、disclaimer；
4. 不做登录；
5. 不做后端；
6. 不做 AI 食谱；
7. 不做图片上传；
8. 不做复杂食谱库；
9. 不引入大型依赖；
10. 每个工具页必须有公式解释、示例、FAQ、copy、print；
11. 所有 starter 相关计算必须避免重复计算；
12. 每次代码修改应先完成同阶段所有改动和检查，再一次性提交。

---

## 28. 最小可行产品最终定义

MVP 完成的标准不是“页面上线”，而是用户可以完成以下 5 个真实任务：

1. 输入 500g 面粉和 75% hydration，得到准确水量；
2. 输入 500g flour、350g water、100g 100% starter，得到 total hydration；
3. 输入目标 1000g dough、75% hydration、20% starter、2% salt，得到 add-to-bowl 配方；
4. 输入需要 100g starter、额外留 10g、1:2:2，得到 seed/flour/water；
5. 输入 3 个 280g pizza、65% hydration、2.5% salt，得到 pizza dough 配方。

只要这 5 个任务做得准确、清晰、移动端可用，这个项目的第一版就成立。

---

## 29. 最终建议

该项目可以进入 PRD 和 MVP 开发，但要严格控制范围。

正确路线：

```text
计算器核心准确
→ 移动端体验清楚
→ 5 个工具页上线
→ 10 个长尾预设页
→ GSC 和交互验证
→ 再决定是否扩展
```

错误路线：

```text
一开始做大型食谱站
→ 做 AI 食谱生成
→ 做账号系统
→ 做复杂发酵预测
→ 做大量泛内容
→ 还没验证就扩页面
```

第一版应以“严谨、轻、快、可复制、可打印”为核心。这个方向的胜负点不在视觉复杂度，而在公式可信、术语清楚、厨房场景好用、长尾页面不空泛。
