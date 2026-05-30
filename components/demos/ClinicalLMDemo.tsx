'use client';

import { useEffect, useRef, useState } from 'react';
import DemoChrome from './DemoChrome';

type Msg = { role: 'user' | 'assistant'; text: string; cites?: string[] };

const QA: { q: string; a: string; cites: string[] }[] = [
  {
    q: 'First-line management of newly diagnosed type 2 diabetes?',
    a: 'For most adults with newly diagnosed type 2 diabetes, first-line therapy is metformin combined with comprehensive lifestyle modification (medical nutrition therapy, ≥150 min/week of activity, weight management). In patients with established ASCVD, heart failure, or chronic kidney disease, a GLP-1 receptor agonist or SGLT2 inhibitor is recommended early — independent of baseline A1c — for cardiorenal protection. Set an individualized A1c target, typically <7.0% for most non-pregnant adults.',
    cites: ['ADA Standards of Care 2025, §9', 'KDIGO 2024 Diabetes/CKD'],
  },
  {
    q: 'How do I interpret an elevated troponin in the ED?',
    a: 'An elevated high-sensitivity troponin indicates myocardial injury but is not specific to acute MI. Interpret it against the clinical context and serial kinetics: a significant rise/fall over 1–3 h supports acute myocardial infarction (Type 1 vs Type 2), whereas a stable elevation suggests chronic injury (e.g., CKD, structural heart disease). Always integrate ECG findings and the 0/1-hour algorithm rather than a single value.',
    cites: ['Fourth Universal Definition of MI', 'ESC 2023 ACS Guideline'],
  },
  {
    q: 'What antibiotics cover community-acquired pneumonia?',
    a: 'For previously healthy outpatients without comorbidities, options include amoxicillin (high-dose), doxycycline, or a macrolide where local pneumococcal resistance is low. Outpatients with comorbidities or inpatients warrant a respiratory fluoroquinolone, or a beta-lactam plus a macrolide. Always tailor to local antibiograms and de-escalate based on culture data and clinical response.',
    cites: ['ATS/IDSA CAP Guideline 2019', 'Local antibiogram'],
  },
];

export default function ClinicalLMDemo() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      text: 'I am a retrieval-grounded clinical reasoning assistant. Ask a question, or pick a prompt below. Answers cite source guidelines and abstain when evidence is weak.',
    },
  ]);
  const [streaming, setStreaming] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' });
  }, [messages, streaming]);

  const answer = (q: string) => {
    if (streaming) return;
    const match =
      QA.find((x) => x.q === q) ??
      QA.reduce(
        (best, x) => {
          const overlap = q
            .toLowerCase()
            .split(/\W+/)
            .filter((w) => w.length > 3 && x.q.toLowerCase().includes(w)).length;
          return overlap > best.score ? { score: overlap, item: x } : best;
        },
        { score: 0, item: QA[0] }
      ).item;

    setMessages((m) => [...m, { role: 'user', text: q }]);
    setStreaming(true);

    // stream tokens
    const tokens = match.a.split(/(\s+)/);
    let i = 0;
    setMessages((m) => [...m, { role: 'assistant', text: '' }]);
    const id = setInterval(() => {
      i++;
      const partial = tokens.slice(0, i).join('');
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: 'assistant',
          text: partial,
          cites: i >= tokens.length ? match.cites : undefined,
        };
        return copy;
      });
      if (i >= tokens.length) {
        clearInterval(id);
        setStreaming(false);
      }
    }, 22);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput('');
    answer(q);
  };

  return (
    <DemoChrome title="ClinicalLM" subtitle="retrieval-augmented · citation-grounded">
      <div className="flex h-full flex-col bg-ink-950">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand text-black'
                    : 'border border-brand/15 bg-ink-900/80 text-[#dbe6d3]'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-brand-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    ClinicalLM
                  </div>
                )}
                <p className="whitespace-pre-wrap">
                  {m.text}
                  {streaming && i === messages.length - 1 && (
                    <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-blink bg-brand align-middle" />
                  )}
                </p>
                {m.cites && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-white/10 pt-2">
                    {m.cites.map((c) => (
                      <span
                        key={c}
                        className="rounded-md bg-brand/10 px-2 py-0.5 text-[10px] text-brand-300"
                      >
                        ⌕ {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* suggested prompts */}
        <div className="flex flex-wrap gap-2 border-t border-brand/10 px-4 pt-3">
          {QA.map((x) => (
            <button
              key={x.q}
              onClick={() => answer(x.q)}
              disabled={streaming}
              className="rounded-full border border-brand/20 px-3 py-1 text-[11px] text-brand-200 transition hover:bg-brand/10 disabled:opacity-40"
            >
              {x.q.length > 42 ? x.q.slice(0, 40) + '…' : x.q}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="flex gap-2 p-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a clinical question…"
            className="flex-1 rounded-lg border border-white/10 bg-ink-900 px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand"
          />
          <button
            type="submit"
            disabled={streaming}
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-400 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </DemoChrome>
  );
}
