import type { GameModule } from './types';
import { chroniclesOfAshenmoor } from '../games/ashenmoor';
import { neonProtocol } from '../games/neonProtocol';
import { theHollowManor } from '../games/hollowManor';

export const GAMES: GameModule[] = [
  chroniclesOfAshenmoor,
  neonProtocol,
  theHollowManor,
];

export function getGame(id: string): GameModule | undefined {
  return GAMES.find((g) => g.id === id);
}
