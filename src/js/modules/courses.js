import { supabase } from '../config/supabase.js'

/**
 * Módulo de Cursos e Treinamentos
 * Gerencia a listagem de aulas, progresso e certificados.
 */

export async function getCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('order_index', { ascending: true })
  
  if (error) throw error
  return data
}

export async function getLesson(lessonId) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', lessonId)
    .single()
  
  if (error) throw error
  return data
}

export async function getUserProgress(userId) {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, courses(*)')
    .eq('user_id', userId)
  
  if (error) throw error
  return data
}

export async function updateProgress(userId, lessonId, completed = true) {
  const { data, error } = await supabase
    .from('enrollments')
    .upsert({ 
      user_id: userId, 
      course_id: lessonId, 
      completed: completed,
      completed_at: completed ? new Date().toISOString() : null
    })
    .select()
  
  if (error) throw error
  return data
}

export async function getCertificates(userId) {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', userId)
  
  if (error) throw error
  return data
}
