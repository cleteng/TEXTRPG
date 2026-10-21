import { supabase } from './supabase';

export interface SaveData {
  id?: string;
  game_id: string;
  character_id: string;
  state: any;
  created_at?: string;
  updated_at?: string;
}

export async function saveGame(gameId: string, characterId: string, state: any): Promise<void> {
  const { error } = await supabase
    .from('saves')
    .upsert({
      game_id: gameId,
      character_id: characterId,
      state,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'game_id,character_id' });

  if (error) {
    console.error('Failed to save game:', error);
    throw error;
  }
}

export async function loadGame(gameId: string, characterId: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('saves')
    .select('state')
    .eq('game_id', gameId)
    .eq('character_id', characterId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // no rows
    console.error('Failed to load game:', error);
    throw error;
  }

  return data?.state ?? null;
}

export async function listSaves(gameId?: string): Promise<SaveData[]> {
  let query = supabase.from('saves').select('*').order('updated_at', { ascending: false });
  if (gameId) {
    query = query.eq('game_id', gameId);
  }
  const { data, error } = await query;
  if (error) {
    console.error('Failed to list saves:', error);
    throw error;
  }
  return data || [];
}
