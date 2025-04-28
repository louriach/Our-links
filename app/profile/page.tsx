'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/auth'
import { supabase } from '../lib/supabase'
import { UserCircleIcon, CameraIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const router = useRouter()
  const { user } = useAuth()
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user?.id)
        .single()

      if (error) throw error

      if (data) {
        setFullName(data.full_name || '')
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    }
  }

  const updateProfile = async () => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id)

      if (error) throw error

      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrl)
      toast.success('Avatar uploaded successfully')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Failed to upload avatar')
    } finally {
      setUploading(false)
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
            <h1 className="text-xl font-bold text-[#1a1a1a] font-['Helvetica Neue']">Profile</h1>
          </div>
          
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#007AFF] flex items-center justify-center">
                    <UserCircleIcon className="w-12 h-12 text-white" />
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-1.5 bg-[#007AFF] rounded-full cursor-pointer"
                >
                  <CameraIcon className="w-4 h-4 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h2 className="text-sm font-medium text-[#666]">Profile Picture</h2>
                <p className="text-xs text-[#999]">Upload a new profile picture</p>
              </div>
            </div>

            {/* Name Section */}
            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-[#666] mb-2">
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#e0e0e0] focus:outline-none focus:border-[#007AFF] font-['Helvetica Neue'] text-[#1a1a1a]"
                placeholder="Enter your full name"
              />
            </div>

            {/* Profile URL Section */}
            <div className="bg-[#f5f5f5] rounded-lg p-4">
              <h2 className="text-sm font-medium text-[#666] mb-2">Profile URL</h2>
              <p className="text-xs text-[#999] mb-2">
                Customize your profile URL to make it easier for friends to find you.
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={`${window.location.origin}/p/${user?.email?.split('@')[0]}`}
                  readOnly
                  className="flex-1 px-4 py-2 rounded-lg border border-[#e0e0e0] bg-white text-[#666] font-['Helvetica Neue'] text-sm"
                />
                <button
                  disabled
                  className="px-4 py-2 bg-[#e0e0e0] text-[#666] rounded-lg font-['Helvetica Neue'] text-sm cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
              <p className="mt-2 text-xs text-[#999]">
                This feature will be available in our premium plan.
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={updateProfile}
              disabled={loading}
              className="w-full px-4 py-2 bg-[#007AFF] text-white rounded-lg hover:bg-[#0055FF] disabled:opacity-50 font-['Helvetica Neue']"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 