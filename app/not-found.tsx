'use client'

import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Page Not Found</h2>
        <p className="text-[var(--text-secondary)]">The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)]"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
} 