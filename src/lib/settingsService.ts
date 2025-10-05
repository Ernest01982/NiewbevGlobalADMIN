import { supabase } from './supabase';
import type { SystemSetting } from '@/types/product';

export async function getAllSettings(): Promise<SystemSetting[]> {
  const { data, error } = await supabase
    .from('system_settings')
    .select('*')
    .order('setting_key', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getSettingByKey(key: string): Promise<SystemSetting | null> {
  const { data, error } = await supabase
    .from('system_settings')
    .select('*')
    .eq('setting_key', key)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getSettingValue(key: string, defaultValue: string): Promise<string> {
  const setting = await getSettingByKey(key);
  return setting?.setting_value || defaultValue;
}

export async function updateSetting(key: string, value: string): Promise<SystemSetting> {
  const { data, error } = await supabase
    .from('system_settings')
    .update({
      setting_value: value,
      updated_at: new Date().toISOString(),
    })
    .eq('setting_key', key)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function upsertSetting(key: string, value: string, description: string): Promise<SystemSetting> {
  const { data, error } = await supabase
    .from('system_settings')
    .upsert(
      {
        setting_key: key,
        setting_value: value,
        description,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'setting_key' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export interface StockholdingConfig {
  defaultWeeks: number;
  minWeeks: number;
  maxWeeks: number;
}

export async function getStockholdingConfig(): Promise<StockholdingConfig> {
  const [defaultWeeks, minWeeks, maxWeeks] = await Promise.all([
    getSettingValue('default_stockholding_weeks', '8'),
    getSettingValue('min_stockholding_weeks', '1'),
    getSettingValue('max_stockholding_weeks', '52'),
  ]);

  return {
    defaultWeeks: parseFloat(defaultWeeks),
    minWeeks: parseFloat(minWeeks),
    maxWeeks: parseFloat(maxWeeks),
  };
}

export async function updateStockholdingConfig(config: StockholdingConfig): Promise<void> {
  await Promise.all([
    updateSetting('default_stockholding_weeks', config.defaultWeeks.toString()),
    updateSetting('min_stockholding_weeks', config.minWeeks.toString()),
    updateSetting('max_stockholding_weeks', config.maxWeeks.toString()),
  ]);
}
