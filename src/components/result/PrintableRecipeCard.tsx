import type { CalculatorResult, Ingredient } from '@/types/baking';
import { pct } from '@/lib/bakingMath';
import { formatWeight, type WeightUnit } from '@/lib/units';

function PrintableSection({ title, items, unit }: { title: string; items?: Ingredient[]; unit: WeightUnit }) {
  if (!items?.length) return null;
  return (
    <section className="print-section">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Weight</th>
            <th>Baker&apos;s %</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={`${title}-${item.name}-${item.note ?? ''}`}>
              <td>{item.name}{item.note ? <span className="print-note"> — {item.note}</span> : null}</td>
              <td>{formatWeight(item.weightGrams, unit)}</td>
              <td>{item.bakerPercentage === undefined ? '—' : pct(item.bakerPercentage)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function PrintableRecipeCard({
  title,
  result,
  unit = 'g',
  inputSummary,
  date = new Date()
}: {
  title: string;
  result: CalculatorResult;
  unit?: WeightUnit;
  inputSummary: string[];
  date?: Date;
}) {
  const totals = result.formulaTotals;
  const formattedDate = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }).format(date);
  return (
    <article className="print-only printable-recipe-card" aria-label="Printable recipe card">
      <header className="print-header">
        <div>
          <p className="print-kicker">DoughMath recipe card</p>
          <h2>{title}</h2>
        </div>
        <div className="print-meta">
          <p>{formattedDate}</p>
          <p>doughmath.ymirtool.com</p>
        </div>
      </header>

      <section className="print-section">
        <h3>Input parameters</h3>
        <ul className="print-inputs">
          {inputSummary.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <PrintableSection title="Add to bowl" items={result.addToBowl ?? result.ingredients} unit={unit} />
      <PrintableSection title="Formula flour blend" items={result.flourBlend} unit={unit} />

      {totals ? (
        <section className="print-section">
          <h3>Formula totals</h3>
          <dl className="print-totals">
            {totals.totalFlourGrams !== undefined ? <><dt>Total flour</dt><dd>{formatWeight(totals.totalFlourGrams, unit)}</dd></> : null}
            {totals.totalWaterGrams !== undefined ? <><dt>Total water</dt><dd>{formatWeight(totals.totalWaterGrams, unit)}</dd></> : null}
            {totals.totalHydrationPct !== undefined ? <><dt>Total hydration</dt><dd>{pct(totals.totalHydrationPct)}</dd></> : null}
            {totals.addedHydrationPct !== undefined ? <><dt>Added hydration</dt><dd>{pct(totals.addedHydrationPct)}</dd></> : null}
            {totals.saltPct !== undefined ? <><dt>Salt</dt><dd>{pct(totals.saltPct)}</dd></> : null}
            {totals.totalFormulaPct !== undefined ? <><dt>Total formula</dt><dd>{pct(totals.totalFormulaPct)}</dd></> : null}
            <dt>Total dough</dt><dd>{formatWeight(totals.totalDoughWeightGrams, unit)}</dd>
          </dl>
        </section>
      ) : null}

      {result.starterSplit && result.starterSplit.starterWeightGrams > 0 ? (
        <section className="print-section">
          <h3>Starter split</h3>
          <dl className="print-totals">
            <dt>Starter</dt><dd>{formatWeight(result.starterSplit.starterWeightGrams, unit)}</dd>
            <dt>Starter hydration</dt><dd>{pct(result.starterSplit.hydrationPct)}</dd>
            <dt>Starter flour</dt><dd>{formatWeight(result.starterSplit.flourGrams, unit)}</dd>
            <dt>Starter water</dt><dd>{formatWeight(result.starterSplit.waterGrams, unit)}</dd>
          </dl>
        </section>
      ) : null}

      <PrintableSection title={result.perUnitLabel ?? 'Per unit'} items={result.perUnit} unit={unit} />

      {result.warnings?.length ? (
        <section className="print-section">
          <h3>Notes</h3>
          <ul className="print-inputs">
            {result.warnings.map((warning) => <li key={warning.code}>{warning.message}</li>)}
          </ul>
        </section>
      ) : (
        <section className="print-section"><h3>Notes</h3><p>Use this formula as a starting point and adjust by dough feel, flour, temperature, starter activity, mixing, and fermentation.</p></section>
      )}
    </article>
  );
}
