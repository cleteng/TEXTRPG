import { useState } from 'react';
import * as Lucide from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { GameModule } from '../engine/types';
import type { SaveRecord } from '../lib/saveManager';

interface GameSelectProps {
  games: GameModule[];
  saves: SaveRecord[];
  loadingSaves: boolean;
  onSelect: (game: GameModule) => void;
  onContinue: (save: SaveRecord) => void;
  onDeleteSave: (save: SaveRecord) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return d.toLocaleDateString();
}

function getGameSaves(saves: SaveRecord[], gameId: string): SaveRecord[] {
  return saves.filter((s) => s.moduleId === gameId);
}

export function GameSelect({
  games,
  saves,
  loadingSaves,
  onSelect,
  onContinue,
  onDeleteSave,
}: GameSelectProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-neutral-100">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Lucide.ScrollText className="h-7 w-7 text-amber-400/80" strokeWidth={1.5} />
            <h1 className="text-2xl font-light tracking-[0.3em] uppercase text-neutral-200">
              The Engine of Many Worlds
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-neutral-500">
            A text-adventure role-playing engine. Each world has its own rules,
            characters, and stories. Choose a world to enter — or continue a
            tale already in motion.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {games.map((game) => {
            const Icon = (Lucide as unknown as Record<string, LucideIcon>)[game.icon] ?? Lucide.Compass;
            const gameSaves = getGameSaves(saves, game.id);
            return (
              <div
                key={game.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900"
              >
                {/* Palette banner */}
                <div
                  className="relative h-32 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${game.palette.bg} 0%, ${game.palette.surface} 50%, ${game.palette.accent}22 100%)`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage: `radial-gradient(circle at 70% 30%, ${game.palette.accent}33 0%, transparent 60%)`,
                    }}
                  />
                  <div className="absolute bottom-4 left-5 flex items-center gap-2.5">
                    <Icon className="h-6 w-6" strokeWidth={1.5} style={{ color: game.palette.accent }} />
                    <span
                      className="text-xs font-medium uppercase tracking-widest"
                      style={{ color: game.palette.accentSoft }}
                    >
                      {game.tagline}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg font-semibold text-neutral-100">{game.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-400">
                    {game.setting}
                  </p>

                  {/* Save slots */}
                  {loadingSaves ? (
                    <div className="mt-4 space-y-2">
                      <div className="h-12 animate-pulse rounded-lg bg-neutral-800/50" />
                    </div>
                  ) : gameSaves.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      <p className="text-[10px] uppercase tracking-widest text-neutral-600">
                        Continue
                      </p>
                      {gameSaves.slice(0, 3).map((save) => {
                        const char = game.characters.find((c) => c.id === save.characterId);
                        const scene = game.scenes[save.state.sceneId];
                        const isEnded = save.state.ended;
                        return (
                          <div
                            key={save.id}
                            className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950/40 px-3 py-2 text-sm transition-colors hover:border-neutral-700"
                          >
                            <button
                              onClick={() => onContinue(save)}
                              className="flex flex-1 items-center gap-2 text-left"
                            >
                              <Lucide.Play
                                className="h-3.5 w-3.5 shrink-0 text-neutral-500"
                                strokeWidth={2}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-neutral-200">
                                  {char?.name ?? 'Unknown'}
                                  {isEnded && (
                                    <span className="ml-2 text-[10px] uppercase tracking-wider text-amber-600">
                                      ended
                                    </span>
                                  )}
                                </div>
                                <div className="truncate text-xs text-neutral-600">
                                  {scene?.title ?? '—'} · {formatDate(save.updatedAt)}
                                </div>
                              </div>
                            </button>
                            {confirmDelete === save.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    onDeleteSave(save);
                                    setConfirmDelete(null);
                                  }}
                                  className="rounded px-1.5 py-0.5 text-xs text-red-400 hover:bg-red-950/40"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="rounded px-1.5 py-0.5 text-xs text-neutral-500 hover:bg-neutral-800"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(save.id)}
                                className="shrink-0 rounded p-1 text-neutral-600 hover:text-red-400"
                                aria-label="Delete save"
                              >
                                <Lucide.Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  <button
                    onClick={() => onSelect(game)}
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor: `${game.palette.accent}1a`,
                      color: game.palette.accentSoft,
                      border: `1px solid ${game.palette.accent}44`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${game.palette.accent}33`;
                      e.currentTarget.style.borderColor = `${game.palette.accent}88`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${game.palette.accent}1a`;
                      e.currentTarget.style.borderColor = `${game.palette.accent}44`;
                    }}
                  >
                    <Lucide.Plus className="h-4 w-4" strokeWidth={2} />
                    New Tale
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
