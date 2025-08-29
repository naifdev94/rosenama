// src/app/[username]/page.tsx
import { createClient } from '@/lib/supabase-server-client'

// This function will get the data for the username in the URL
async function getProfileData(username: string) {
  const supabase = await createClient()

  // 1. Get the profile data for the username
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (profileError || !profile) {
    return { error: 'Profile not found' }
  }

  // 2. Get all links for this user
  const { data: links, error: linksError } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .order('sort_order')

  if (linksError) {
    return { error: 'Error loading links' }
  }

  return { profile, links }
}

// This is the main page component
export default async function ProfilePage({ 
  params 
}: { 
  params: { username: string } 
}) {
  // Get the username from the URL
  const { username } = params
  // Fetch the data for this username
  const result = await getProfileData(username)

  // If there was an error, show a message
  if ('error' in result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Profile Not Found</h1>
        <p>The user &quot;{username}&quot; does not exist.</p>
      </div>
    )
  }

  const { profile, links } = result

  // Show the profile page
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-md mx-auto px-4">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{profile.display_name}</h1>
          <p className="text-gray-600 mt-2">@{profile.username}</p>
          <p className="text-gray-500 mt-4">{profile.bio}</p>
        </div>

        {/* Links List */}
        <div className="space-y-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg shadow-sm p-4 text-center border hover:bg-blue-50 transition-colors"
            >
              {link.title}
            </a>
          ))}
        </div>

        {/* Booking Button (for later) */}
        <div className="mt-8">
          <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
            Book a Meeting
          </button>
        </div>
      </div>
    </div>
  )
}