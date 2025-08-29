// src/app/dashboard/page.tsx
import { createClient } from '@/lib/supabase-server-client'
import { redirect } from 'next/navigation'
import LogoutButton from './logout-button' // Import the logout button

export default async function DashboardPage() {
  // Create a Supabase client for the server
  const supabase = await createClient()

  // 1. Check if the user is logged in. If not, redirect to login page.
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // 2. Get the user's profile data
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. Get the user's links
  const { data: links, error: linksError } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user.id)
    .order('sort_order')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {profile?.display_name || 'User'}!
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Your Rosenama URL: https://your-domain.com/{profile?.username}
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Display Name</p>
              <p className="font-medium">{profile?.display_name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="font-medium">@{profile?.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bio</p>
              <p className="font-medium">{profile?.bio || 'No bio yet'}</p>
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Edit Profile
          </button>
        </div>

        {/* Links Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Links</h2>
          
          {links && links.length > 0 ? (
            <div className="space-y-3">
              {links.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{link.title}</p>
                    <p className="text-sm text-gray-600">{link.url}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-gray-200 rounded-md text-sm">Edit</button>
                    <button className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You haven't added any links yet.</p>
          )}
          
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            + Add New Link
          </button>
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}