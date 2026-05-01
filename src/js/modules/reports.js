import { supabase } from '../config/supabase.js'

/**
 * Módulo de Relatórios e Analytics
 * Consolida dados para os dashboards de Gestor e Admin.
 */

export async function getCompanyDashboardStats(companyId) {
  // 1. Total de colaboradores
  const { count: totalUsers, error: err1 } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .eq('role', 'colaborador')

  // 2. Taxa de conclusão de cursos
  const { data: enrollments, error: err2 } = await supabase
    .from('enrollments')
    .select('completed')
    .eq('company_id', companyId)

  const completedCount = enrollments?.filter(e => e.completed).length || 0
  const completionRate = enrollments?.length > 0 
    ? Math.round((completedCount / enrollments.length) * 100) 
    : 0

  // 3. Vulnerabilidade de Phishing (Cliques / Total Enviado)
  const { data: phishingLogs, error: err3 } = await supabase
    .from('phishing_logs')
    .select('clicked_at')
    .eq('company_id', companyId)

  const clickRate = phishingLogs?.length > 0
    ? Math.round((phishingLogs.filter(l => l.clicked_at).length / phishingLogs.length) * 100)
    : 0

  if (err1 || err2 || err3) throw (err1 || err2 || err3)

  return {
    totalUsers: totalUsers || 0,
    completionRate,
    clickRate,
    activeAlerts: clickRate > 20 ? 'Alta Vulnerabilidade' : 'Normal'
  }
}

export async function getAdminGlobalStats() {
  const { count: totalCompanies, error: err1 } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })

  const { count: totalUsers, error: err2 } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  if (err1 || err2) throw (err1 || err2)

  return {
    totalCompanies: totalCompanies || 0,
    totalUsers: totalUsers || 0
  }
}
