'use client'

import { useState } from 'react'
import { useAuth } from '../context/auth'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function Settings() {
  const router = useRouter()
  const { user } = useAuth()
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const updateEmail = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.updateUser({
        email: email
      })

      if (error) throw error

      toast.success('Check your email for the confirmation link')
    } catch (error) {
      console.error('Error updating email:', error)
      toast.error('Failed to update email')
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match')
        return
      }

      setLoading(true)
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      toast.success('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Error updating password:', error)
      toast.error('Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      <div className="max-w-[640px] mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)] p-6 border border-[#e0e0e0]">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 text-[#666] hover:bg-[#f5f5f5] rounded-lg"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-[#1a1a1a] font-['Helvetica Neue']">Settings</h1>
          </div>
          
          <div className="space-y-6">
            {/* Email Section */}
            <div>
              <h2 className="text-sm font-medium text-[#666] mb-4">Email Address</h2>
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#e0e0e0] focus:outline-none focus:border-[#007AFF] font-['Helvetica Neue'] text-[#1a1a1a]"
                  placeholder="Enter your email address"
                />
                <button
                  onClick={updateEmail}
                  disabled={loading || email === user?.email}
                  className="w-full px-4 py-2 bg-[#007AFF] text-white rounded-lg hover:bg-[#0055FF] disabled:opacity-50 font-['Helvetica Neue']"
                >
                  {loading ? 'Updating...' : 'Update Email'}
                </button>
              </div>
            </div>

            {/* Password Section */}
            <div>
              <h2 className="text-sm font-medium text-[#666] mb-4">Change Password</h2>
              <div className="space-y-3">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#e0e0e0] focus:outline-none focus:border-[#007AFF] font-['Helvetica Neue'] text-[#1a1a1a]"
                  placeholder="Current password"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#e0e0e0] focus:outline-none focus:border-[#007AFF] font-['Helvetica Neue'] text-[#1a1a1a]"
                  placeholder="New password"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#e0e0e0] focus:outline-none focus:border-[#007AFF] font-['Helvetica Neue'] text-[#1a1a1a]"
                  placeholder="Confirm new password"
                />
                <button
                  onClick={updatePassword}
                  disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full px-4 py-2 bg-[#007AFF] text-white rounded-lg hover:bg-[#0055FF] disabled:opacity-50 font-['Helvetica Neue']"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 