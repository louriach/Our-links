import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Initialize the session
let currentSession: any = null

export async function getSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    currentSession = session
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

// Set up auth state change listener
supabase.auth.onAuthStateChange((_event, session) => {
  currentSession = session
})

export function getCurrentSession() {
  return currentSession
} 