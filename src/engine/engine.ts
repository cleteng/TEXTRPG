import type {
  CharacterClass,
  Choice,
  Condition,
  Effect,
  GameState,
  GameModule,
  Scene,
  StatDef,
} from './types';

export function statDefinitions(module: GameModule): StatDef[] {
  return module.stats;
}

export function getCharacter(module: GameModule, id: string): CharacterClass {
  const c = module.characters.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown character ${id}`);
  return c;
}

export function getScene(module: GameModule, id: string): Scene {
  const s = module.scenes[id];
  if (!s) throw new Error(`Unknown scene ${id}`);
  return s;
}

export function getItemName(module: GameModule, id: string): string {
  const item = module.items.find((i) => i.id === id);
  return item ? item.name : id;
}

export function getItemDesc(module: GameModule, id: string): string {
  const item = module.items.find((i) => i.id === id);
  return item ? item.description : '';
}

export function getStatName(module: GameModule, id: string): string {
  const stat = module.stats.find((s) => s.id === id);
  return stat ? stat.name : id;
}

export function statName(module: GameModule, id: string): string {
  const stat = module.stats.find((s) => s.id === id);
  return stat ? stat.short : id;
}

export function clampStat(module: GameModule, id: string, value: number): number {
  const stat = module.stats.find((s) => s.id === id);
  if (!stat) return value;
  return Math.max(stat.min, Math.min(stat.max, value));
}

export function createInitialState(
  module: GameModule,
  character: CharacterClass,
): GameState {
  const stats: Record<string, number> = {};
  for (const stat of module.stats) {
    stats[stat.id] = clampStat(module, stat.id, stat.initial + (character.statBonuses[stat.id] ?? 0));
  }
  const now = new Date().toISOString();
  return {
    moduleId: module.id,
    characterId: character.id,
    sceneId: module.startScene,
    stats,
    inventory: [...character.startingItems],
    flags: {},
    history: [module.startScene],
    choiceLog: [],
    turn: 0,
    ended: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function meetsCondition(state: GameState, cond: Condition): boolean {
  if ('stat' in cond) {
    const v = state.stats[cond.stat] ?? 0;
    switch (cond.op) {
      case '>=': return v >= cond.value;
      case '<=': return v <= cond.value;
      case '>': return v > cond.value;
      case '<': return v < cond.value;
      case '==': return v === cond.value;
      case '!=': return v !== cond.value;
    }
  }
  if ('item' in cond) {
    const has = state.inventory.includes(cond.item);
    return cond.has ? has : !has;
  }
  if ('flag' in cond) {
    const isSet = state.flags[cond.flag] === true;
    return cond.isSet ? isSet : !isSet;
  }
  return true;
}

export function meetsAllConditions(state: GameState, conds?: Condition[]): boolean {
  if (!conds || conds.length === 0) return true;
  return conds.every((c) => meetsCondition(state, c));
}

export function applyEffects(module: GameModule, state: GameState, effects?: Effect[]): GameState {
  if (!effects || effects.length === 0) return state;
  const next = { ...state, stats: { ...state.stats }, inventory: [...state.inventory], flags: { ...state.flags } };
  for (const e of effects) {
    if (e.stat && e.delta) {
      next.stats[e.stat] = clampStat(module, e.stat, (next.stats[e.stat] ?? 0) + e.delta);
    }
    if (e.addItem && !next.inventory.includes(e.addItem)) {
      next.inventory.push(e.addItem);
    }
    if (e.removeItem) {
      next.inventory = next.inventory.filter((i) => i !== e.removeItem);
    }
    if (e.setFlag) {
      next.flags[e.setFlag] = true;
    }
    if (e.clearFlag) {
      delete next.flags[e.clearFlag];
    }
  }
  return next;
}

export function availableChoices(module: GameModule, state: GameState): Choice[] {
  const scene = getScene(module, state.sceneId);
  return scene.choices.filter((c) => meetsAllConditions(state, c.requires));
}

/** deterministic-ish roll for a d20; uses Math.random but returns a rounded int 1..20 */
export function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

export interface ResolveResult {
  state: GameState;
  result: 'success' | 'failure' | 'auto';
  roll?: number;
  skillCheckId?: string;
}

export function resolveChoice(module: GameModule, state: GameState, choiceId: string): ResolveResult {
  const scene = getScene(module, state.sceneId);
  const choice = scene.choices.find((c) => c.id === choiceId);
  if (!choice) throw new Error(`Unknown choice ${choiceId} in scene ${state.sceneId}`);

  let baseEffects: Effect[] = [];
  let outcome = choice.outcome;
  let result: 'success' | 'failure' | 'auto' = 'auto';
  let roll: number | undefined;

  if (choice.skillCheck) {
    const statValue = state.stats[choice.skillCheck.stat] ?? 0;
    roll = rollD20();
    const total = roll + statValue;
    const success = total >= choice.skillCheck.difficulty;
    result = success ? 'success' : 'failure';
    outcome = success ? choice.skillCheck.onSuccess : choice.skillCheck.onFailure;
  }

  if (!outcome) throw new Error(`Choice ${choiceId} has no outcome and no skill check`);

  let nextState = applyEffects(module, state, baseEffects);
  nextState = applyEffects(module, nextState, outcome.effects);

  const destScene = getScene(module, outcome.destination);
  // apply onEnter effects when entering the destination scene
  nextState = applyEffects(module, nextState, destScene.onEnter);

  const destIsEnding = destScene.isEnding === true;
  nextState = {
    ...nextState,
    sceneId: outcome.destination,
    history: [...nextState.history, outcome.destination],
    choiceLog: [
      ...nextState.choiceLog,
      { sceneId: state.sceneId, choiceLabel: choice.label, result },
    ],
    turn: nextState.turn + 1,
    ended: destIsEnding,
    updatedAt: new Date().toISOString(),
  };

  return { state: nextState, result, roll };
}

/** serialize state for saving */
export function serializeState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state)) as GameState;
}
