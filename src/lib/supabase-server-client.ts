// src/lib/supabase-server-client.ts
'use server' // 👈 Add this at the very top

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Make the function async so we can use 'await' inside it
export async function createClient() {
  // 👇 Now we use 'await' to get the cookieStore
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}