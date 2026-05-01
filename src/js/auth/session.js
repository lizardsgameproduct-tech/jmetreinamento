import { supabase } from '../config/supabase.js'

// Retorna o perfil completo do usuário logado
export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, empresas(nome_fantasia)')
    .eq('id', user.id)
    .single()

  return profile
}

// Redireciona conforme o role após login
export function redirectByRole(role) {
  const routes = {
    admin:        '/src/pages/admin/empresas.html',
    gestor:       '/src/pages/dashboard-gestor.html',
    colaborador:  '/src/pages/meus-cursos.html'
  }
  
  const target = routes[role] || '/src/pages/meus-cursos.html'
  window.location.href = target
}

// Protege qualquer página — redireciona para login se não autenticado
export async function requireAuth() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    window.location.href = '/src/pages/login.html'
    return null
  }
  return user
}

// Protege página por role específico
export async function requireRole(...roles) {
  const profile = await getProfile()
  if (!profile) {
    window.location.href = '/src/pages/login.html'
    return null
  }
  if (!roles.includes(profile.role)) {
    redirectByRole(profile.role)
    return null
  }
  return profile
}

export async function logout() {
  await supabase.auth.signOut()
  window.location.href = '/src/pages/login.html'
}
