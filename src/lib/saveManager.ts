import { supabase } from './supabase';
import type { GameState } from '../engine/types';

export interface SaveRecord {
  id: string;
  saveKey: string;
  moduleId: string;
  characterId: string;
  state: GameState;
  updatedAt: string;
}

const TABLE = 'saves';

function toCamel(row: Record<string, unknown>): SaveRecord {
  return {
    id: row.id as string,
    saveKey: row.save_key as string,
    moduleId: row.module_id as string,
    characterId: row.character_id as string,
    state: row.state as GameState,
    updatedAt: row.updated_at as string,
  };
}

export async function listSaves(): Promise<SaveRecord[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, save_key, module_id, character_id, state, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toCamel);
}

export async function getSave(saveKey: string): Promise<SaveRecord | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, save_key, module_id, character_id, state, updated_at')
    .eq('save_key', saveKey)
    .maybeSingle();
  if (error) throw error;
  return data ? toCamel(data) : null;
}

export async function upsertSave(saveKey: string, state: GameState): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .upsert(
      {
        save_key: saveKey,
        module_id: state.moduleId,
        character_id: state.characterId,
        state: state as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'save_key' },
    );
  if (error) throw error;
}

export async function deleteSave(saveKey: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('save_key', saveKey);
  if (error) throw error;
}
