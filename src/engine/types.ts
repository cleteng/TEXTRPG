export type ConditionOperator = '>=' | '<=' | '>' | '<' | '==' | '!=';

export interface StatCondition {
  stat: string;
  op: ConditionOperator;
  value: number;
}

export interface ItemCondition {
  item: string;
  /** true = must possess, false = must NOT possess */
  has: boolean;
}

export interface FlagCondition {
  flag: string;
  /** true = must be set, false = must NOT be set */
  isSet: boolean;
}

export type Condition = StatCondition | ItemCondition | FlagCondition;

export interface Effect {
  stat?: string;
  /** delta applied to the stat (can be negative) */
  delta?: number;
  /** item id to add to inventory */
  addItem?: string;
  /** item id to remove from inventory */
  removeItem?: string;
  /** flag name to set true */
  setFlag?: string;
  /** flag name to clear */
  clearFlag?: string;
}

export interface SkillCheck {
  /** stat id used for the check */
  stat: string;
  /** target value the roll + stat must meet or exceed */
  difficulty: number;
  /** roll a d20 and add the stat value */
  onSuccess: ChoiceOutcome;
  onFailure: ChoiceOutcome;
}

export interface ChoiceOutcome {
  destination: string;
  effects?: Effect[];
}

export interface Choice {
  id: string;
  label: string;
  /** short hint text shown under the label, e.g. "[Stealth 12]" */
  hint?: string;
  /** choice is only shown if all conditions pass */
  requires?: Condition[];
  /** optional skill check; if present the outcome depends on the roll */
  skillCheck?: SkillCheck;
  /** fixed outcome when there is no skill check (or shared base effects applied before a check) */
  outcome?: ChoiceOutcome;
}

export interface Scene {
  id: string;
  title: string;
  /** narrative paragraphs */
  text: string[];
  /** effects applied automatically when the scene is entered */
  onEnter?: Effect[];
  /** choices offered; if empty the scene is an ending */
  choices: Choice[];
  /** marks this scene as an ending — triggers the ending screen */
  isEnding?: boolean;
  /** flavour: 'good' | 'bad' | 'neutral' — colours the ending banner */
  endingType?: 'good' | 'bad' | 'neutral';
}

export interface StatDef {
  id: string;
  name: string;
  short: string;
  description: string;
  initial: number;
  min: number;
  max: number;
}

export interface ItemDef {
  id: string;
  name: string;
  description: string;
}

export interface CharacterClass {
  id: string;
  name: string;
  title: string;
  description: string;
  /** stat overrides applied on top of the stat definitions' initial values */
  statBonuses: Record<string, number>;
  /** item ids the character starts with */
  startingItems: string[];
  /** ability summary shown on the card */
  ability: string;
}

export interface ThemePalette {
  /** primary accent used for headings, choice borders, active states */
  accent: string;
  /** softer accent for backgrounds / glows */
  accentSoft: string;
  /** deep background colour (hex) */
  bg: string;
  /** panel / card surface colour */
  surface: string;
  /** border colour for cards */
  border: string;
  /** readable text colour over the bg */
  text: string;
  /** muted secondary text colour */
  muted: string;
}

export interface GameModule {
  id: string;
  title: string;
  tagline: string;
  description: string;
  /** one-paragraph setting blurb shown on the select card */
  setting: string;
  /** font family for narrative text, e.g. a serif for fantasy */
  narrativeFont: string;
  /** tailwind-friendly hex palette driving the themed look */
  palette: ThemePalette;
  /** lucide icon name for the game card */
  icon: string;
  stats: StatDef[];
  items: ItemDef[];
  characters: CharacterClass[];
  scenes: Record<string, Scene>;
  /** id of the opening scene */
  startScene: string;
}

export interface GameState {
  moduleId: string;
  characterId: string;
  sceneId: string;
  stats: Record<string, number>;
  inventory: string[];
  flags: Record<string, boolean>;
  /** ordered list of scene ids visited, for the history panel */
  history: string[];
  /** log of choices made, oldest first */
  choiceLog: { sceneId: string; choiceLabel: string; result: 'success' | 'failure' | 'auto' }[];
  /** increments every time a choice is resolved */
  turn: number;
  ended: boolean;
  createdAt: string;
  updatedAt: string;
}
