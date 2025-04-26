'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase-client'
import { User, Session } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    console.log('AuthProvider: Initializing...')
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Getting initial session...')
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        console.log('AuthProvider: Initial session:', initialSession)
        
        if (mounted) {
          if (initialSession) {
            setSession(initialSession)
            setUser(initialSession.user)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('AuthProvider: Error getting initial session:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('AuthProvider: Auth state changed:', _event, session)
      
      if (mounted) {
        if (session) {
          setSession(session)
          setUser(session.user)
        } else {
          setSession(null)
          setUser(null)
        }
        setLoading(false)
      }
    })

    // Initialize auth
    initializeAuth()

    return () => {
      console.log('AuthProvider: Cleaning up...')
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      console.log('AuthProvider: Signing out...')
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('AuthProvider: Error signing out:', error)
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signOut,
  }

  console.log('AuthProvider: Current state:', { user, session, loading })

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 