import Reveal from './Reveal';
import ProficiencyBars from './charts/ProficiencyBars';

const GROUPS = [
  {
    title: 'ML & Deep Learning',
    skills: [
      { label: 'PyTorch', value: 85 },
      { label: 'Transformers / LLMs', value: 78 },
      { label: 'CNNs & Vision', value: 80 },
      { label: 'Graph Neural Nets', value: 62 },
    ],
  },
  {
    title: 'GPU & Inference',
    skills: [
      { label: 'CUDA', value: 60 },
      { label: 'TensorRT', value: 55 },
      { label: 'Triton / Serving', value: 58 },
      { label: 'ONNX Runtime', value: 66 },
    ],
  },
  {
    title: 'Data & MLOps',
    skills: [
      { label: 'Docker', value: 76 },
      { label: 'Git & CI/CD', value: 84 },
      { label: 'Ray / Pipelines', value: 56 },
      { label: 'Weights & Biases', value: 62 },
    ],
  },
  {
    title: 'Languages & Backend',
    skills: [
      { label: 'Python', value: 92 },
      { label: 'TypeScript', value: 85 },
      { label: 'C++', value: 58 },
      { label: 'FastAPI / Node', value: 80 },
    ],
  },
];

const MARQUEE = [
  'PyTorch', 'CUDA', 'TensorRT', 'Triton', 'MONAI', 'Transformers', 'JAX',
  'Ray', 'vLLM', 'RDKit', 'nnU-Net', 'Grad-CAM', 'ONNX', 'FastAPI', 'pgvector',
];

export default function Stack() {
  return (
    <section id="stack" className="relative overflow-hidden border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <p className="mb-3 font-mono text-sm text-brand">// stack</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              The tools I reach for to ship{' '}
              <span className="gradient-text">fast, reliable models</span>.
            </h2>
            <p className="max-w-xs text-sm text-[#7c8a76]">
              Self-assessed proficiency across the stack I build with day to day.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {GROUPS.map((g, i) => (
            <Reveal key={g.title} delay={(i % 2) * 90}>
              <ProficiencyBars title={g.title} skills={g.skills} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* marquee */}
      <div className="relative mt-14 flex select-none overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span
              key={i}
              className="mx-3 font-mono text-2xl font-bold text-white/[0.08] transition hover:text-brand/40"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
