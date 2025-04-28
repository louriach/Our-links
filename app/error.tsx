'use client'

import React, { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Something went wrong!</h2>
        <p className="text-[var(--text-secondary)]">We're sorry, but there was an error loading this page.</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)]"
        >
          Try again
        </button>
      </div>
    </div>
  )
} 