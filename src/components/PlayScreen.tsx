import { useState } from 'react';
import * as Lucide from 'lucide-react';
import type { CharacterClass, GameModule, GameState } from '../engine/types';
import {
  availableChoices,
  getItemDesc,
  getItemName,
  getScene,
  getStatName,
  resolveChoice,
  statName,
} from '../engine/engine';
import { ThemeRoot } from './ThemeRoot';

interface PlayScreenProps {
  module: GameModule;
  character: CharacterClass;
  state: GameState;
  onChange: (state: GameState) => void;
  onQuit: () => void;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

type Panel = 'stats' | 'inventory' | 'history';

export function PlayScreen({
  module,
  character,
  state,
  onChange,
  onQuit,
  saveStatus,
}: PlayScreenProps) {
  const [panel, setPanel] = useState<Panel | null>(null);
  const [lastRoll, setLastRoll] = useState<{ result: 'success' | 'failure' | 'auto'; roll?: number; label: string } | null>(null);
  const [revealed, setRevealed] = useState(0);

  const scene = getScene(module, state.sceneId);
  const choices = availableChoices(module, state);
  const paragraphs = scene.text;
  const allRevealed = revealed >= paragraphs.length;

  const handleChoice = (choiceId: string) => {
    const choice = scene.choices.find((c) => c.id === choiceId);
    if (!choice) return;
    const result = resolveChoice(module, state, choiceId);
    onChange(result.state);
    setLastRoll({
      result: result.result,
      roll: result.roll,
      label: choice.label,
    });
    setRevealed(0);
  };

  const revealNext = () => {
    if (revealed < paragraphs.length) setRevealed((r) => r + 1);
  };
  const revealAll = () => setRevealed(paragraphs.length);

  return (
    <ThemeRoot module={module} className="min-h-screen w-full">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 md:px-6 md:py-10">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onQuit}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors hover:opacity-80"
              style={{
                color: 'var(--th-muted)',
                border: '1px solid var(--th-border)',
              }}
            >
              <Lucide.Home className="h-3.5 w-3.5" strokeWidth={1.5} />
              Worlds
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm" style={{ color: 'var(--th-accent-soft)' }}>
                {module.title}
              </span>
              <span style={{ color: 'var(--th-muted)' }}>·</span>
              <span className="text-sm" style={{ color: 'var(--th-text)' }}>{character.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Save status */}
            <SaveBadge status={saveStatus} />
            {/* Panel toggles */}
            <PanelToggle icon="stats" label="Stats" active={panel === 'stats'} onClick={() => setPanel(panel === 'stats' ? null : 'stats')} />
            <PanelToggle icon="inventory" label="Pack" active={panel === 'inventory'} onClick={() => setPanel(panel === 'inventory' ? null : 'inventory')} />
            <PanelToggle icon="history" label="Log" active={panel === 'history'} onClick={() => setPanel(panel === 'history' ? null : 'history')} />
          </div>
        </header>

        <div className="flex flex-1 gap-6">
          {/* Main narrative column */}
          <main className="min-w-0 flex-1">
            <div
              className="rounded-2xl border p-6 md:p-8"
              style={{
                borderColor: 'var(--th-border)',
                backgroundColor: 'color-mix(in srgb, var(--th-surface) 70%, transparent)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* Scene title */}
              <h2
                className="mb-5 text-lg font-semibold tracking-wide"
                style={{ color: 'var(--th-accent-soft)' }}
              >
                {scene.title}
              </h2>

              {/* Narrative paragraphs */}
              <div
                className="space-y-4 text-[15px] leading-[1.7] md:text-base md:leading-[1.75]"
                style={{
                  color: 'var(--th-text)',
                  fontFamily: 'var(--th-narrative-font)',
                }}
              >
                {paragraphs.slice(0, revealed + 1).map((para, i) => (
                  <p
                    key={i}
                    className="animate-[fadeInUp_0.5s_ease-out]"
                    style={{
                      animationFillMode: 'both',
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Reveal more prompt */}
              {!allRevealed && (
                <button
                  onClick={revealNext}
                  onDoubleClick={revealAll}
                  className="mt-5 flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                  style={{ color: 'var(--th-accent-soft)' }}
                >
                  <Lucide.ChevronDown className="h-4 w-4 animate-pulse" strokeWidth={1.5} />
                  {revealed === 0 ? 'Read on' : 'Continue'}
                  <span className="text-xs opacity-50">(double-click to reveal all)</span>
                </button>
              )}

              {/* Last roll feedback */}
              {lastRoll && allRevealed && (
                <div
                  className="mt-5 flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                  style={{
                    backgroundColor:
                      lastRoll.result === 'success'
                        ? 'color-mix(in srgb, var(--th-accent) 15%, transparent)'
                        : lastRoll.result === 'failure'
                        ? 'color-mix(in srgb, #ef4444 15%, transparent)'
                        : 'transparent',
                    color:
                      lastRoll.result === 'success'
                        ? 'var(--th-accent-soft)'
                        : lastRoll.result === 'failure'
                        ? '#f87171'
                        : 'var(--th-muted)',
                  }}
                >
                  {lastRoll.result === 'success' ? (
                    <Lucide.CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
                  ) : lastRoll.result === 'failure' ? (
                    <Lucide.XCircle className="h-4 w-4" strokeWidth={1.5} />
                  ) : null}
                  {lastRoll.roll !== undefined
                    ? `d20 roll: ${lastRoll.roll} — ${lastRoll.result}`
                    : null}
                </div>
              )}

              {/* Choices */}
              {allRevealed && !state.ended && (
                <div className="mt-6 space-y-2.5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-px flex-1" style={{ backgroundColor: 'var(--th-border)' }} />
                    <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: 'var(--th-muted)' }}>
                      Your move
                    </span>
                    <span className="h-px flex-1" style={{ backgroundColor: 'var(--th-border)' }} />
                  </div>
                  {choices.length === 0 && (
                    <p className="text-sm italic" style={{ color: 'var(--th-muted)' }}>
                      There is nothing more to do here.
                    </p>
                  )}
                  {choices.map((choice) => {
                    const sc = choice.skillCheck;
                    const statShort = sc ? statName(module, sc.stat) : '';
                    return (
                      <button
                        key={choice.id}
                        onClick={() => handleChoice(choice.id)}
                        className="group flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 hover:translate-x-1"
                        style={{
                          borderColor: 'var(--th-border)',
                          backgroundColor: 'color-mix(in srgb, var(--th-surface) 40%, transparent)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--th-accent)';
                          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--th-accent) 12%, transparent)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--th-border)';
                          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--th-surface) 40%, transparent)';
                        }}
                      >
                        <span
                          className="mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5"
                          style={{ color: 'var(--th-accent-soft)' }}
                        >
                          <Lucide.ChevronRight className="h-4 w-4" strokeWidth={2} />
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm md:text-[15px]" style={{ color: 'var(--th-text)' }}>
                            {choice.label}
                          </span>
                          {choice.hint && (
                            <span
                              className="mt-1 block text-xs font-medium uppercase tracking-wider"
                              style={{ color: 'var(--th-muted)' }}
                            >
                              {choice.hint}
                            </span>
                          )}
                          {sc && (
                            <span className="mt-1 block text-[11px]" style={{ color: 'var(--th-muted)' }}>
                              {statShort} check · difficulty {sc.difficulty} · d20 + {statShort}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Ending button */}
              {allRevealed && state.ended && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={onQuit}
                    className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--th-accent)', color: 'var(--th-bg)' }}
                  >
                    Return to the worlds
                    <Lucide.ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* Side panel */}
          {panel && (
            <aside
              className="hidden w-72 shrink-0 overflow-hidden rounded-2xl border md:block"
              style={{
                borderColor: 'var(--th-border)',
                backgroundColor: 'color-mix(in srgb, var(--th-surface) 70%, transparent)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="h-full overflow-y-auto p-5" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
                {panel === 'stats' && <StatsPanel module={module} state={state} />}
                {panel === 'inventory' && <InventoryPanel module={module} state={state} />}
                {panel === 'history' && <HistoryPanel module={module} state={state} />}
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Mobile panel drawer */}
      {panel && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end md:hidden"
          onClick={() => setPanel(null)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative max-h-[70vh] overflow-y-auto rounded-t-2xl border-t p-5"
            style={{
              borderColor: 'var(--th-border)',
              backgroundColor: 'var(--th-surface)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm uppercase tracking-widest" style={{ color: 'var(--th-accent-soft)' }}>
                {panel === 'stats' ? 'Stats' : panel === 'inventory' ? 'Pack' : 'Log'}
              </span>
              <button onClick={() => setPanel(null)} style={{ color: 'var(--th-muted)' }}>
                <Lucide.X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            {panel === 'stats' && <StatsPanel module={module} state={state} />}
            {panel === 'inventory' && <InventoryPanel module={module} state={state} />}
            {panel === 'history' && <HistoryPanel module={module} state={state} />}
          </div>
        </div>
      )}
    </ThemeRoot>
  );
}

function SaveBadge({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (status === 'idle') return null;
  const color =
    status === 'saving' ? 'var(--th-muted)' :
    status === 'saved' ? 'var(--th-accent-soft)' :
    '#f87171';
  return (
    <span className="hidden items-center gap-1 text-[10px] uppercase tracking-wider sm:flex" style={{ color }}>
      {status === 'saving' && <Lucide.Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />}
      {status === 'saved' && <Lucide.Check className="h-3 w-3" strokeWidth={2} />}
      {status === 'error' && <Lucide.AlertCircle className="h-3 w-3" strokeWidth={2} />}
      {status}
    </span>
  );
}

function PanelToggle({
  icon,
  label,
  active,
  onClick,
}: {
  icon: 'stats' | 'inventory' | 'history';
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const Icon =
    icon === 'stats' ? Lucide.BarChart3 :
    icon === 'inventory' ? Lucide.Backpack :
    Lucide.Scroll;
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors"
      style={{
        color: active ? 'var(--th-bg)' : 'var(--th-muted)',
        backgroundColor: active ? 'var(--th-accent)' : 'transparent',
        border: `1px solid ${active ? 'var(--th-accent)' : 'var(--th-border)'}`,
      }}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function StatsPanel({ module, state }: { module: GameModule; state: GameState }) {
  return (
    <div>
      <h3 className="mb-4 text-xs uppercase tracking-widest" style={{ color: 'var(--th-muted)' }}>
        Attributes
      </h3>
      <div className="space-y-3">
        {module.stats.map((stat) => {
          const value = state.stats[stat.id] ?? 0;
          const pct = ((value - stat.min) / (stat.max - stat.min)) * 100;
          return (
            <div key={stat.id}>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-sm" style={{ color: 'var(--th-text)' }}>
                  {getStatName(module, stat.id)}
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--th-accent-soft)' }}>
                  {value}
                </span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full"
                style={{ backgroundColor: 'color-mix(in srgb, var(--th-border) 50%, transparent)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(0, Math.min(100, pct))}%`,
                    backgroundColor: 'var(--th-accent)',
                  }}
                />
              </div>
              <p className="mt-1 text-[11px] leading-tight" style={{ color: 'var(--th-muted)' }}>
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InventoryPanel({ module, state }: { module: GameModule; state: GameState }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  if (state.inventory.length === 0) {
    return (
      <div>
        <h3 className="mb-4 text-xs uppercase tracking-widest" style={{ color: 'var(--th-muted)' }}>
          Pack
        </h3>
        <p className="text-sm italic" style={{ color: 'var(--th-muted)' }}>
          You carry nothing.
        </p>
      </div>
    );
  }
  return (
    <div>
      <h3 className="mb-4 text-xs uppercase tracking-widest" style={{ color: 'var(--th-muted)' }}>
        Pack · {state.inventory.length}
      </h3>
      <div className="space-y-1.5">
        {state.inventory.map((itemId) => {
          const isOpen = expanded === itemId;
          return (
            <div key={itemId}>
              <button
                onClick={() => setExpanded(isOpen ? null : itemId)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:opacity-90"
                style={{
                  backgroundColor: isOpen
                    ? 'color-mix(in srgb, var(--th-accent) 12%, transparent)'
                    : 'transparent',
                  color: 'var(--th-text)',
                }}
              >
                <Lucide.Package
                  className="h-3.5 w-3.5 shrink-0"
                  strokeWidth={1.5}
                  style={{ color: 'var(--th-accent-soft)' }}
                />
                <span className="flex-1 truncate">{getItemName(module, itemId)}</span>
                <Lucide.ChevronDown
                  className="h-3 w-3 shrink-0 transition-transform"
                  strokeWidth={1.5}
                  style={{
                    color: 'var(--th-muted)',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                  }}
                />
              </button>
              {isOpen && (
                <p
                  className="ml-6 mr-2 mb-1 text-xs leading-relaxed animate-[fadeInUp_0.3s_ease-out]"
                  style={{ color: 'var(--th-muted)' }}
                >
                  {getItemDesc(module, itemId)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HistoryPanel({ module, state }: { module: GameModule; state: GameState }) {
  return (
    <div>
      <h3 className="mb-4 text-xs uppercase tracking-widest" style={{ color: 'var(--th-muted)' }}>
        Chronicle · Turn {state.turn}
      </h3>
      {state.choiceLog.length === 0 ? (
        <p className="text-sm italic" style={{ color: 'var(--th-muted)' }}>
          The story has yet to be written.
        </p>
      ) : (
        <ol className="space-y-3">
          {state.choiceLog.map((entry, i) => {
            const scene = getScene(module, entry.sceneId);
            return (
              <li key={i} className="border-l-2 pl-3" style={{ borderColor: 'var(--th-border)' }}>
                <p className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--th-muted)' }}>
                  {scene?.title ?? entry.sceneId}
                </p>
                <p className="text-sm" style={{ color: 'var(--th-text)' }}>
                  {entry.choiceLabel}
                </p>
                {entry.result !== 'auto' && (
                  <p
                    className="text-[11px]"
                    style={{
                      color: entry.result === 'success' ? 'var(--th-accent-soft)' : '#f87171',
                    }}
                  >
                    {entry.result}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
