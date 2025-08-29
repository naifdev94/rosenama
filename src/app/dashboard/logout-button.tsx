// src/app/dashboard/logout-button.tsx
'use client'

import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh() // Refresh the page to update the auth state
    router.push('/') // Redirect to homepage
  }

  return (
    <button 
      onClick={handleLogout}
      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
    >
      Sign Out
    </button>
  )
}