import { useState } from 'react';
import * as Lucide from 'lucide-react';
import type { CharacterClass, GameModule } from '../engine/types';
import { ThemeRoot } from './ThemeRoot';

interface CharacterSelectProps {
  module: GameModule;
  onConfirm: (character: CharacterClass) => void;
  onBack: () => void;
}

export function CharacterSelect({ module, onConfirm, onBack }: CharacterSelectProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const char = module.characters.find((c) => c.id === selected) ?? null;

  return (
    <ThemeRoot
      module={module}
      className="min-h-screen w-full"
    >
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-sm transition-colors hover:opacity-80"
            style={{ color: 'var(--th-muted)' }}
          >
            <Lucide.ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Back to worlds
          </button>
          <h1
            className="text-2xl font-light tracking-wide"
            style={{ color: 'var(--th-accent-soft)' }}
          >
            {module.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--th-muted)' }}>
            {module.description}
          </p>
          <h2 className="mt-8 text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--th-muted)' }}>
            Choose your path
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {module.characters.map((c) => {
            const isSelected = selected === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className="group relative overflow-hidden rounded-xl border p-5 text-left transition-all duration-300"
                style={{
                  borderColor: isSelected ? 'var(--th-accent)' : 'var(--th-border)',
                  backgroundColor: isSelected ? 'var(--th-surface)' : 'color-mix(in srgb, var(--th-surface) 60%, transparent)',
                  boxShadow: isSelected ? `0 0 24px -8px var(--th-accent)` : 'none',
                }}
              >
                <h3
                  className="text-lg font-semibold"
                  style={{ color: isSelected ? 'var(--th-accent-soft)' : 'var(--th-text)' }}
                >
                  {c.name}
                </h3>
                <p className="mt-0.5 text-xs uppercase tracking-wider" style={{ color: 'var(--th-muted)' }}>
                  {c.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--th-text)', opacity: 0.85 }}>
                  {c.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {Object.entries(c.statBonuses).map(([stat, bonus]) => {
                    const def = module.stats.find((s) => s.id === stat);
                    return (
                      <span
                        key={stat}
                        className="rounded-md px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: 'color-mix(in srgb, var(--th-accent) 15%, transparent)',
                          color: 'var(--th-accent-soft)',
                        }}
                      >
                        {def?.short ?? stat} +{bonus}
                      </span>
                    );
                  })}
                </div>

                <div className="mt-4 border-t pt-3" style={{ borderColor: 'var(--th-border)' }}>
                  <p className="text-xs italic" style={{ color: 'var(--th-muted)' }}>
                    {c.ability}
                  </p>
                </div>

                {isSelected && (
                  <div
                    className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'var(--th-accent)' }}
                  >
                    <Lucide.Check className="h-3 w-3" strokeWidth={3} style={{ color: 'var(--th-bg)' }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Starting items preview */}
        {char && (
          <div
            className="mt-6 rounded-xl border p-4"
            style={{ borderColor: 'var(--th-border)', backgroundColor: 'color-mix(in srgb, var(--th-surface) 50%, transparent)' }}
          >
            <p className="mb-2 text-xs uppercase tracking-widest" style={{ color: 'var(--th-muted)' }}>
              Starting effects
            </p>
            <div className="flex flex-wrap gap-2">
              {char.startingItems.map((itemId) => {
                const item = module.items.find((i) => i.id === itemId);
                return (
                  <span
                    key={itemId}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--th-accent) 10%, transparent)',
                      color: 'var(--th-text)',
                    }}
                  >
                    <Lucide.Package className="h-3 w-3" strokeWidth={1.5} style={{ color: 'var(--th-accent-soft)' }} />
                    {item?.name ?? itemId}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            disabled={!char}
            onClick={() => char && onConfirm(char)}
            className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
            style={{
              backgroundColor: 'var(--th-accent)',
              color: 'var(--th-bg)',
            }}
          >
            Begin
            <Lucide.ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </ThemeRoot>
  );
}
