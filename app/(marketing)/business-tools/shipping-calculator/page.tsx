'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Truck, ArrowRight } from 'lucide-react';

type Method = 'air' | 'sea';

interface Fields {
  weight: string;
  length: string;
  width:  string;
  height: string;
  method: Method;
}

interface Result {
  actual:      number;
  volumetric:  number;
  chargeable:  number;
  minCost:     number;
  maxCost:     number;
}

const RATE: Record<Method, { divisor: number; min: number; max: number }> = {
  air: { divisor: 5000, min: 7,  max: 14  },
  sea: { divisor: 1000, min: 2.5, max: 6 },
};

function calculate(f: Fields): Result | null {
  const w = parseFloat(f.weight);
  const l = parseFloat(f.length);
  const wi = parseFloat(f.width);
  const h = parseFloat(f.height);
  if ([w, l, wi, h].some(isNaN) || [w, l, wi, h].some(v => v <= 0)) return null;

  const r = RATE[f.method];
  const volumetric = (l * wi * h) / r.divisor;
  const chargeable = Math.max(w, volumetric);

  return {
    actual:     w,
    volumetric: Math.round(volumetric * 100) / 100,
    chargeable: Math.round(chargeable * 100) / 100,
    minCost:    Math.round(chargeable * r.min * 100) / 100,
    maxCost:    Math.round(chargeable * r.max * 100) / 100,
  };
}

export default function ShippingCalculatorPage() {
  const [fields, setFields] = useState<Fields>({ weight: '', length: '', width: '', height: '', method: 'air' });
  const [result, setResult] = useState<Result | null>(null);

  function set(k: keyof Fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFields(f => ({ ...f, [k]: e.target.value }));
      setResult(null);
    };
  }

  function handleCalc(e: React.FormEvent) {
    e.preventDefault();
    setResult(calculate(fields));
  }

  return (
    <>
      <section className="fd-tool-page-hero">
        <div className="fd-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div className="fd-tool-icon"><Truck size={22} /></div>
            <div className="fd-section-label" style={{ margin: 0 }}>Shipping Calculator</div>
          </div>
          <h1 className="fd-section-title" style={{ textAlign: 'left', marginBottom: 10 }}>
            Estimate your shipping costs
          </h1>
          <p style={{ fontSize: 15, color: 'var(--fd-muted)', margin: 0, maxWidth: 500, lineHeight: 1.7 }}>
            Calculate volumetric weight and get an estimated shipping cost range for
            air or sea freight.
          </p>
        </div>
      </section>

      <section className="fd-section">
        <div className="fd-container">
          <div className="fd-tool-widget">
            <form onSubmit={handleCalc}>
              <div className="fd-tool-field">
                <label>Shipping method</label>
                <select value={fields.method} onChange={set('method')}>
                  <option value="air">Air freight</option>
                  <option value="sea">Sea freight</option>
                </select>
              </div>

              <div className="fd-tool-field">
                <label>Actual weight (kg)</label>
                <input type="number" min="0.01" step="0.01" value={fields.weight} onChange={set('weight')} placeholder="e.g. 5" required />
              </div>

              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--fd-navy)', margin: '0 0 8px' }}>Package dimensions (cm)</p>
              <div className="fd-tool-field-row">
                <div className="fd-tool-field" style={{ margin: 0 }}>
                  <label>Length</label>
                  <input type="number" min="1" step="0.1" value={fields.length} onChange={set('length')} placeholder="e.g. 40" required />
                </div>
                <div className="fd-tool-field" style={{ margin: 0 }}>
                  <label>Width</label>
                  <input type="number" min="1" step="0.1" value={fields.width} onChange={set('width')} placeholder="e.g. 30" required />
                </div>
              </div>
              <div className="fd-tool-field" style={{ marginTop: 16 }}>
                <label>Height</label>
                <input type="number" min="1" step="0.1" value={fields.height} onChange={set('height')} placeholder="e.g. 20" required />
              </div>

              <button type="submit" className="fd-btn fd-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
                Calculate
              </button>
            </form>

            {result && (
              <div className="fd-tool-result">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <div className="fd-tool-result-label">Actual weight</div>
                    <div className="fd-tool-result-value" style={{ fontSize: 20 }}>{result.actual} kg</div>
                  </div>
                  <div>
                    <div className="fd-tool-result-label">Volumetric weight</div>
                    <div className="fd-tool-result-value" style={{ fontSize: 20 }}>{result.volumetric} kg</div>
                  </div>
                </div>
                <div className="fd-tool-result-label">Chargeable weight</div>
                <div className="fd-tool-result-value">{result.chargeable} kg</div>
                <div className="fd-tool-result-label" style={{ marginTop: 16 }}>Estimated cost range (USD)</div>
                <div className="fd-tool-result-value" style={{ fontSize: 20 }}>
                  ${result.minCost.toFixed(2)} – ${result.maxCost.toFixed(2)}
                </div>
                <p className="fd-tool-result-note">
                  Estimates only. Actual rates vary by carrier, route, and goods type.
                  Always confirm with your freight forwarder.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="fd-related">
        <div className="fd-container">
          <div className="fd-related-title">Other free tools</div>
          <div className="fd-related-row">
            <Link href="/business-tools/invoice-generator"  className="fd-related-link"><ArrowRight size={14} />Invoice Generator</Link>
            <Link href="/business-tools/receipt-generator"  className="fd-related-link"><ArrowRight size={14} />Receipt Generator</Link>
            <Link href="/business-tools/currency-converter" className="fd-related-link"><ArrowRight size={14} />Currency Converter</Link>
            <Link href="/tracker/login"                     className="fd-related-link"><ArrowRight size={14} />Sales Tracker</Link>
          </div>
        </div>
      </div>
    </>
  );
}
