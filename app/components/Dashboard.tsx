'use client'

import { User } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/auth'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { CheckIcon, ShareIcon, PlusIcon, UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Popover, Menu } from '@headlessui/react'
import { useRouter } from 'next/navigation'

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

interface FriendResponse {
  friend: Friend
}

export default function Dashboard({ user }: DashboardProps) {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [links, setLinks] = useState<Link[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [showFriendSelector, setShowFriendSelector] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { signOut } = useAuth()
  const [error, setError] = useState<string | null>(null)

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

      const friendsData = (data as unknown as FriendResponse[]) || []
      setFriends(friendsData.map(f => f.friend))
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
    setSelectedFriends((prev: string[]) => 
      prev.includes(friendId)
        ? prev.filter((id: string) => id !== friendId)
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

  const filteredFriends = friends.filter(friend => 
    friend.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const recentFriends = friends.slice(0, 5)

  const handleProfileClick = () => {
    router.push('/profile')
  }

  const handleSettingsClick = () => {
    router.push('/settings')
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--border)] shadow-sm">
        <div className="max-w-[640px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[var(--text-primary)] font-['Helvetica Neue']">Our Links - Share with Friends</h1>
            
            <div className="flex items-center space-x-2">
              <Popover className="relative">
                <Popover.Button className="p-2 text-[var(--primary)] hover:bg-[var(--hover)] rounded-[var(--radius-md)]">
                  <PlusIcon className="w-5 h-5" />
                </Popover.Button>
                <Popover.Panel className="absolute right-0 mt-2 w-80 bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)] p-4 z-10">
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter URL to share"
                        className="w-full px-4 py-2 rounded-[var(--radius-md)] border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] font-['Helvetica Neue'] text-[var(--text-primary)] text-sm"
                      />
                    </div>
                    <div>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note (optional)"
                        className="w-full px-4 py-2 rounded-[var(--radius-md)] border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] font-['Helvetica Neue'] text-[var(--text-primary)] text-sm"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="bg-[var(--hover)] rounded-[var(--radius-md)] p-3">
                        {friends.length === 0 ? (
                          <div className="text-center space-y-2">
                            <p className="text-sm text-[var(--text-secondary)]">You don't have any friends yet.</p>
                            <button
                              type="button"
                              onClick={copyProfileUrl}
                              className="text-[var(--primary)] text-sm"
                            >
                              Share your profile to connect with friends
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search friends..."
                              className="w-full px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-white text-sm"
                            />
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {searchQuery ? (
                                filteredFriends.map(friend => (
                                  <div
                                    key={friend.id}
                                    className="flex items-center space-x-2 p-2 rounded-[var(--radius-md)] hover:bg-white cursor-pointer"
                                    onClick={() => toggleFriend(friend.id)}
                                  >
                                    <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
                                      {friend.avatar_url ? (
                                        <img src={friend.avatar_url} alt={friend.full_name || friend.email} className="w-full h-full rounded-full" />
                                      ) : (
                                        <span className="text-white text-xs font-medium">{friend.email[0].toUpperCase()}</span>
                                      )}
                                    </div>
                                    <span className="text-sm">{friend.full_name || friend.email}</span>
                                    {selectedFriends.includes(friend.id) && (
                                      <CheckIcon className="w-4 h-4 text-[var(--primary)]" />
                                    )}
                                  </div>
                                ))
                              ) : (
                                recentFriends.map(friend => (
                                  <div
                                    key={friend.id}
                                    className="flex items-center space-x-2 p-2 rounded-[var(--radius-md)] hover:bg-white cursor-pointer"
                                    onClick={() => toggleFriend(friend.id)}
                                  >
                                    <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
                                      {friend.avatar_url ? (
                                        <img src={friend.avatar_url} alt={friend.full_name || friend.email} className="w-full h-full rounded-full" />
                                      ) : (
                                        <span className="text-white text-xs font-medium">{friend.email[0].toUpperCase()}</span>
                                      )}
                                    </div>
                                    <span className="text-sm">{friend.full_name || friend.email}</span>
                                    {selectedFriends.includes(friend.id) && (
                                      <CheckIcon className="w-4 h-4 text-[var(--primary)]" />
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {error && (
                        <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-[var(--radius-md)]">
                          <ExclamationCircleIcon className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-700">{error}</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-4 py-1.5 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] disabled:opacity-50 font-['Helvetica Neue'] text-sm"
                    >
                      {loading ? 'Sharing...' : 'Share Link'}
                    </button>
                  </form>
                </Popover.Panel>
              </Popover>

              <Popover className="relative">
                <Popover.Button className="p-2 text-[var(--primary)] hover:bg-[var(--hover)] rounded-[var(--radius-md)]">
                  <ShareIcon className="w-5 h-5" />
                </Popover.Button>
                <Popover.Panel className="absolute right-0 mt-2 w-80 bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)] p-4 z-10">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-[var(--text-primary)]">Share your profile</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={`${window.location.origin}/p/${profile?.profile_url}`}
                        readOnly
                        className="flex-1 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--hover)] text-[var(--text-secondary)] font-['Helvetica Neue'] text-sm"
                      />
                      <button
                        onClick={copyProfileUrl}
                        className="px-3 py-1.5 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] font-['Helvetica Neue'] text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </Popover.Panel>
              </Popover>

              <Menu as="div" className="relative">
                <Menu.Button className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center">
                  <span className="text-white font-medium">{user?.email?.[0]?.toUpperCase() || '?'}</span>
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)] py-1 z-10">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleProfileClick}
                        className={`${
                          active ? 'bg-[var(--hover)]' : ''
                        } flex items-center space-x-2 w-full px-4 py-2 text-sm text-[var(--text-primary)]`}
                      >
                        <UserCircleIcon className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSettingsClick}
                        className={`${
                          active ? 'bg-[var(--hover)]' : ''
                        } flex items-center space-x-2 w-full px-4 py-2 text-sm text-[var(--text-primary)]`}
                      >
                        <Cog6ToothIcon className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut()}
                        className={`${
                          active ? 'bg-[var(--hover)]' : ''
                        } flex items-center space-x-2 w-full px-4 py-2 text-sm text-[var(--text-primary)]`}
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[640px] mx-auto px-6 py-6">
        {/* Links List */}
        <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-4 border border-[var(--border)]">
          <h2 className="text-base font-semibold mb-3 text-[var(--text-primary)] font-['Helvetica Neue']">Your Links</h2>
          <div className="space-y-0">
            {links.map((link) => (
              <div key={link.id} className="relative pl-8 pb-6 border-l-2 border-[var(--border)] last:border-l-0 last:pb-0">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[var(--primary)] border-2 border-white"></div>
                <div className="p-3 rounded-[var(--radius-md)] border border-[var(--border)] hover:bg-[var(--hover)]">
                  <div className="flex items-start space-x-3">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}`}
                      alt=""
                      className="w-4 h-4 mt-1"
                    />
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-[var(--text-primary)] font-['Helvetica Neue']">{link.title}</h3>
                      <p className="text-[var(--text-secondary)] font-['Helvetica Neue'] text-sm">{link.description}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-['Helvetica Neue'] text-sm"
                      >
                        {link.url}
                      </a>
                      {link.note && (
                        <p className="mt-1 text-[var(--text-secondary)] font-['Helvetica Neue'] text-sm">Note: {link.note}</p>
                      )}
                      <div className="mt-2 flex items-center space-x-2">
                        {link.created_by === user.id ? (
                          <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
                            <span className="text-white text-xs font-medium">{user.email?.[0]?.toUpperCase() || '?'}</span>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[var(--secondary)] flex items-center justify-center">
                            <span className="text-white text-xs font-medium">{link.created_by[0].toUpperCase()}</span>
                          </div>
                        )}
                        <p className="text-xs text-[var(--text-tertiary)] font-['Helvetica Neue']">
                          Shared on {new Date(link.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 