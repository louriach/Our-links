'use client'

import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-[var(--text-secondary)]">Loading...</p>
      </div>
    </div>
  )
} 