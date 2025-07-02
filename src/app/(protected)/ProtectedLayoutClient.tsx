'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useInvite } from '../context/InviteContext'

export default function ProtectedLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { ids, loading } = useInvite()

  useEffect(() => {
    const idsParam = searchParams.get('ids')
    console.log('ids from context:', ids)
    if ((!ids || ids.length === 0) && !idsParam && pathname !== '/') {
      router.replace('/')  // Redirige vers la home si pas connecté
    }
  }, [ids, loading, router, searchParams, pathname])

  if (loading) return <p>Chargement...</p>
  if ((!ids || ids.length === 0) && pathname !== '/') return <p>Accès refusé</p>

  return <>{children}</>
}
