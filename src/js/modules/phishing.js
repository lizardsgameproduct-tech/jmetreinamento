import { supabase } from '../config/supabase.js'

/**
 * Módulo de Simulação de Phishing
 * Gerencia campanhas, templates e métricas de vulnerabilidade.
 */

export async function getPhishingCampaigns(companyId) {
  const { data, error } = await supabase
    .from('phishing_campaigns')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getPhishingStats(campaignId) {
  const { data, error } = await supabase
    .from('phishing_logs')
    .select('*')
    .eq('campaign_id', campaignId)
  
  if (error) throw error
  
  const stats = {
    sent: data.length,
    opened: data.filter(l => l.opened_at).length,
    clicked: data.filter(l => l.clicked_at).length,
    reported: data.filter(l => l.reported_at).length
  }
  
  return stats
}

export async function createCampaign(campaignData) {
  const { data, error } = await supabase
    .from('phishing_campaigns')
    .insert([campaignData])
    .select()
  
  if (error) throw error
  return data
}

export async function logPhishingAction(logId, action) {
  const updateData = {}
  if (action === 'open') updateData.opened_at = new Date().toISOString()
  if (action === 'click') updateData.clicked_at = new Date().toISOString()
  if (action === 'report') updateData.reported_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('phishing_logs')
    .update(updateData)
    .eq('id', logId)
    .select()
  
  if (error) throw error
  return data
}
