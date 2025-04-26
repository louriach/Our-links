'use client'

import { User } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/auth'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { CheckIcon } from '@heroicons/react/24/outline'

interface DashboardProps {
  user: User
}

interface Link {
  id: string
  url: string
  title: string
  description: string
  note: string
  created_by: string
  created_at: string
  updated_at: string
}

interface Friend {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

interface Profile {
  id: string
  profile_url: string
}

export default function Dashboard({ user }: DashboardProps) {
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [links, setLinks] = useState<Link[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [showFriendSelector, setShowFriendSelector] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const { signOut } = useAuth()

  useEffect(() => {
    fetchLinks()
    fetchFriends()
    fetchProfile()
  }, [])

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setLinks(data || [])
    } catch (error) {
      console.error('Error fetching links:', error)
      toast.error('Failed to load links')
    }
  }

  const fetchFriends = async () => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          friend:profiles!friendships_friend_id_fkey (
            id,
            email,
            full_name,
            avatar_url
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'accepted')

      if (error) throw error

      setFriends(data?.map(f => f.friend) || [])
    } catch (error) {
      console.error('Error fetching friends:', error)
      toast.error('Failed to load friends')
    }
  }

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, profile_url')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    }
  }

  const formatUrl = (url: string) => {
    // If URL doesn't start with http:// or https://, add https://
    if (!url.match(/^https?:\/\//i)) {
      return `https://${url}`
    }
    return url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formattedUrl = formatUrl(url)
      
      // First, try to fetch metadata for the URL
      const response = await fetch('/api/unfurl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: formattedUrl }),
      })

      const metadata = await response.json()
      
      if (!response.ok) {
        // If metadata fetch fails, still create the link with basic info
        console.warn('Failed to fetch metadata:', metadata.error)
        const { data, error } = await supabase
          .from('links')
          .insert({
            created_by: user.id,
            url: formattedUrl,
            title: new URL(formattedUrl).hostname,
            description: '',
            note: note.trim(),
          })
          .select()
          .single()

        if (error) throw error

        // Share with selected friends
        if (selectedFriends.length > 0) {
          const { error: shareError } = await supabase
            .from('link_shares')
            .insert(
              selectedFriends.map(friendId => ({
                link_id: data.id,
                shared_with: friendId,
                shared_by: user.id
              }))
            )

          if (shareError) throw shareError
        }

        toast.success('Link shared successfully!')
        setUrl('')
        setNote('')
        setSelectedFriends([])
        fetchLinks()
        return
      }

      // Create the link with metadata
      const { data, error } = await supabase
        .from('links')
        .insert({
          created_by: user.id,
          url: formattedUrl,
          title: metadata.title || new URL(formattedUrl).hostname,
          description: metadata.description || '',
          note: note.trim(),
        })
        .select()
        .single()

      if (error) throw error

      // Share with selected friends
      if (selectedFriends.length > 0) {
        const { error: shareError } = await supabase
          .from('link_shares')
          .insert(
            selectedFriends.map(friendId => ({
              link_id: data.id,
              shared_with: friendId,
              shared_by: user.id
            }))
          )

        if (shareError) throw shareError
      }

      toast.success('Link shared successfully!')
      setUrl('')
      setNote('')
      setSelectedFriends([])
      fetchLinks()
    } catch (error) {
      console.error('Error sharing link:', error)
      toast.error('Failed to share link')
    } finally {
      setLoading(false)
    }
  }

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    )
  }

  const copyProfileUrl = async () => {
    if (!profile?.profile_url) {
      toast.error('Profile URL not available')
      return
    }

    const profileUrl = `${window.location.origin}/p/${profile.profile_url}`
    try {
      await navigator.clipboard.writeText(profileUrl)
      toast.success('Profile URL copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy profile URL')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Sign Out
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter a URL to share (e.g., example.com)"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 140))}
              placeholder="Add a note (optional, max 140 characters)"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
              maxLength={140}
            />
            <div className="text-sm text-gray-500 text-right mt-1">
              {note.length}/140 characters
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowFriendSelector(!showFriendSelector)}
              className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
            >
              {selectedFriends.length > 0
                ? `Share with ${selectedFriends.length} friend${selectedFriends.length === 1 ? '' : 's'}`
                : 'Share with friends'}
            </button>

            {showFriendSelector && (
              <div className="border border-gray-300 rounded-md p-4 space-y-2">
                {friends.length === 0 ? (
                  <div className="text-center space-y-2">
                    <p className="text-gray-500">You don't have any friends yet.</p>
                    <button
                      type="button"
                      onClick={copyProfileUrl}
                      className="text-indigo-600 hover:text-indigo-500 text-sm"
                    >
                      Copy your profile URL to share
                    </button>
                  </div>
                ) : (
                  friends.map(friend => (
                    <label
                      key={friend.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                    >
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedFriends.includes(friend.id)}
                          onChange={() => toggleFriend(friend.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {friend.full_name || friend.email}
                        </p>
                      </div>
                      {selectedFriends.includes(friend.id) && (
                        <CheckIcon className="h-5 w-5 text-indigo-600" />
                      )}
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Sharing...' : 'Share Link'}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Shared Links</h2>
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {link.title}
              </a>
              {link.note && (
                <p className="text-gray-600 mt-2">{link.note}</p>
              )}
              {link.description && (
                <p className="text-gray-500 text-sm mt-2">
                  {link.description}
                </p>
              )}
              <div className="text-gray-400 text-sm mt-2">
                {new Date(link.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 