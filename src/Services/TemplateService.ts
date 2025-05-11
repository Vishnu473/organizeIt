import { supabase } from "../lib/supabaseClient";
import type { Template } from "../types/Template";

export const fetchTemplates = async (includeArchived = false): Promise<Template[]> => {
  let query = supabase
    .from('template')
    .select('*')
    .order('updated_at', { ascending: false });

  if (!includeArchived) {
    query = query.eq('is_archived', false);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
};

export const getTemplateById = async (id: string): Promise<Template> => {
  const { data, error } = await supabase
    .from('template')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createTemplate = async (template: Omit<Template, 'id' | 'created_at' | 'updated_at' | 'usage_count'>): Promise<Template> => {
  const { data, error } = await supabase
    .from('template')
    .insert(template)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateTemplate = async (id: string, template: Partial<Omit<Template, 'id' | 'created_at' | 'updated_at'>>): Promise<Template> => {
  const { data, error } = await supabase
    .from('template')
    .update({
      ...template,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const archiveTemplate = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('template')
    .update({ is_archived: true, updated_at: new Date().toISOString() })
    .eq('id', id);
  
  if (error) throw error;
};

export const deleteTemplate = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('template')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const incrementUsageCount = async (id: string): Promise<void> => {
  const { error } = await supabase
    .rpc('increment_template_usage', { template_id: id });
  
  if (error) throw error;
};