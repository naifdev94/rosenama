// src/app/page.tsx
import { createClient } from '@/lib/supabase-server-client'

export default async function Home() {
  // 👇 Now we use 'await' here because createClient() is async
  const supabase = await createClient()
  
  // This is a simple test query.
  const { data, error } = await supabase.from('profiles').select('*').limit(1)

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4 text-red-500">Connection Error</h1>
        <p>Could not connect to the database: {error.message}</p>
        <p className="mt-4">This likely means the 'profiles' table doesn't exist yet in Supabase.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Rosenama!</h1>
      <p className="text-green-500">✅ Successfully connected to Supabase!</p>
      <p>You are ready to start building.</p>
      {/* Let's see what the database returned: */}
      <p className="mt-4">Test Data: {data ? JSON.stringify(data) : 'No data found'}</p>
    </div>
  )
}