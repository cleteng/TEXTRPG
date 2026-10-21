import { useCallback, useEffect, useRef, useState } from 'react';
import { GAMES, getGame } from './engine/registry';
import type { CharacterClass, GameModule, GameState } from './engine/types';
import { createInitialState, getCharacter } from './engine/engine';
import { GameSelect } from './components/GameSelect';
import { CharacterSelect } from './components/CharacterSelect';
import { PlayScreen } from './components/PlayScreen';
import {
  deleteSave as dbDeleteSave,
  listSaves,
  upsertSave,
  type SaveRecord,
} from './lib/saveManager';

type View = 'select' | 'character' | 'play';

interface ActiveGame {
  module: GameModule;
  character: CharacterClass;
  state: GameState;
  saveKey: string;
}

const SAVE_KEY_STORAGE = 'rpg_engine_save_key';

function newSaveKey(): string {
  return `save_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [view, setView] = useState<View>('select');
  const [selectedGame, setSelectedGame] = useState<GameModule | null>(null);
  const [active, setActive] = useState<ActiveGame | null>(null);
  const [saves, setSaves] = useState<SaveRecord[]>([]);
  const [loadingSaves, setLoadingSaves] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedKey = useRef<string | null>(null);

  // Load saves list on mount
  const refreshSaves = useCallback(async () => {
    setLoadingSaves(true);
    try {
      const list = await listSaves();
      setSaves(list);
    } catch {
      setSaves([]);
    } finally {
      setLoadingSaves(false);
    }
  }, []);

  useEffect(() => {
    refreshSaves();
  }, [refreshSaves]);

  // Debounced autosave whenever active state changes
  const persist = useCallback(async (state: GameState, saveKey: string) => {
    setSaveStatus('saving');
    try {
      await upsertSave(saveKey, state);
      setSaveStatus('saved');
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  }, []);

  const handleSelectGame = (game: GameModule) => {
    setSelectedGame(game);
    setView('character');
  };

  const handleConfirmCharacter = (character: CharacterClass) => {
    if (!selectedGame) return;
    const state = createInitialState(selectedGame, character);
    const saveKey = newSaveKey();
    localStorage.setItem(SAVE_KEY_STORAGE, saveKey);
    setActive({ module: selectedGame, character, state, saveKey });
    loadedKey.current = saveKey;
    setView('play');
    void persist(state, saveKey);
  };

  const handleContinue = (save: SaveRecord) => {
    const module = getGame(save.moduleId);
    if (!module) return;
    const character = getCharacter(module, save.characterId);
    setActive({ module, character, state: save.state, saveKey: save.saveKey });
    loadedKey.current = save.saveKey;
    setView('play');
  };

  const handleStateChange = (state: GameState) => {
    if (!active) return;
    setActive({ ...active, state });
    void persist(state, active.saveKey);
  };

  const handleQuit = () => {
    setActive(null);
    setSelectedGame(null);
    setView('select');
    setSaveStatus('idle');
    void refreshSaves();
  };

  const handleDeleteSave = async (save: SaveRecord) => {
    try {
      await dbDeleteSave(save.saveKey);
      await refreshSaves();
    } catch {
      // ignore
    }
  };

  if (view === 'select' || (!active && !selectedGame)) {
    return (
      <GameSelect
        games={GAMES}
        saves={saves}
        loadingSaves={loadingSaves}
        onSelect={handleSelectGame}
        onContinue={handleContinue}
        onDeleteSave={handleDeleteSave}
      />
    );
  }

  if (view === 'character' && selectedGame && !active) {
    return (
      <CharacterSelect
        module={selectedGame}
        onConfirm={handleConfirmCharacter}
        onBack={() => {
          setSelectedGame(null);
          setView('select');
        }}
      />
    );
  }

  if (active) {
    return (
      <PlayScreen
        module={active.module}
        character={active.character}
        state={active.state}
        onChange={handleStateChange}
        onQuit={handleQuit}
        saveStatus={saveStatus}
      />
    );
  }

  return (
    <GameSelect
      games={GAMES}
      saves={saves}
      loadingSaves={loadingSaves}
      onSelect={handleSelectGame}
      onContinue={handleContinue}
      onDeleteSave={handleDeleteSave}
    />
  );
}
