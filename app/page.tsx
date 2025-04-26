'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './context/auth'
import Dashboard from './components/Dashboard'

export default function Home() {
  const { user, session, loading } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  console.log('Home: Current state:', { user, session, loading, isRedirecting })

  useEffect(() => {
    console.log('Home: Effect running with state:', { user, session, loading })
    
    if (!loading && !session && !isRedirecting) {
      console.log('Home: No session, redirecting to login')
      setIsRedirecting(true)
      router.push('/auth/login')
    }
  }, [session, loading, router, isRedirecting])

  // Show loading spinner during initial load or redirect
  if (loading || isRedirecting) {
    console.log('Home: Showing loading spinner')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Show dashboard if we have a session
  if (session) {
    console.log('Home: Rendering Dashboard')
    return <Dashboard user={user!} />
  }

  // Show nothing if no session (should be handled by redirect)
  console.log('Home: No session and not redirecting, showing nothing')
  return null
}
