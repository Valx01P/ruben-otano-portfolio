'use client';

import { useState } from 'react';
import { Mail, Phone, Github, Linkedin, Send, Check } from 'lucide-react';
import Reveal from './Reveal';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // mailto fallback — no backend required
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:rubenotano13@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="relative border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mb-3 font-mono text-sm text-brand">// contact</p>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Let&apos;s build something that{' '}
              <span className="gradient-text">matters</span>.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-[#9aa894]">
              I&apos;m open to AI/ML engineering and research roles, especially
              at the intersection of frontier ML and medicine. Reach out — I
              respond fast.
            </p>

            <div className="mt-8 space-y-3">
              <a
                href="mailto:rubenotano13@gmail.com"
                className="flex items-center gap-3 text-[#cdd8c5] transition hover:text-brand"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand/20 bg-brand/5">
                  <Mail size={18} className="text-brand" />
                </span>
                rubenotano13@gmail.com
              </a>
              <a
                href="tel:7868689166"
                className="flex items-center gap-3 text-[#cdd8c5] transition hover:text-brand"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand/20 bg-brand/5">
                  <Phone size={18} className="text-brand" />
                </span>
                (786) 868-9166
              </a>
            </div>

            <div className="mt-8 flex gap-3">
              {[
                { Icon: Github, href: 'https://github.com/RubenOtano', label: 'GitHub' },
                { Icon: Linkedin, href: 'https://www.linkedin.com/in/rubenotano/', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-[#9aa894] transition hover:border-brand/40 hover:text-brand"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <form
              onSubmit={submit}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              <div className="space-y-4">
                <Field
                  label="Name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  type="text"
                  placeholder="Jane Researcher"
                  required
                />
                <Field
                  label="Email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  type="email"
                  placeholder="jane@lab.org"
                  required
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#cdd8c5]">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    required
                    placeholder="Tell me about the role or project…"
                    className="w-full resize-none rounded-lg border border-white/10 bg-ink-950 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-[#5f6c5a] focus:border-brand"
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 font-semibold text-black transition hover:bg-brand-400 brand-glow"
                >
                  {sent ? (
                    <>
                      <Check size={18} /> Opening your mail client…
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Send message
                    </>
                  )}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#cdd8c5]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-ink-950 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-[#5f6c5a] focus:border-brand"
      />
    </div>
  );
}
