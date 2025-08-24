'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useInvite } from '../context/InviteContext'
import { supabase } from '../lib/supabaseClient'

export default function NavBar() {
  const { ids, setIds } = useInvite()
  const pathname = usePathname()
  const router = useRouter()

  const [isTemoin, setIsTemoin] = useState(false)

  useEffect(() => {
    const checkTemoin = async () => {
      if (!ids || ids.length === 0) return

      const { data, error } = await supabase
        .from('invites')
        .select('profil')
        .in('id', ids)

      if (!error && data) {
        const temoinPresent = data.some((inv) => inv.profil === 'temoin')
        setIsTemoin(temoinPresent)
      }
    }

    checkTemoin()
  }, [ids])

  const handleLogout = () => {
    setIds([])
    sessionStorage.removeItem('inviteIds')
    router.push('/')
  }

  const baseLinks = [
    { href: '/rsvp', label: 'RSVP' },
    { href: '/faq', label: 'FAQ' },
    { href: '/infos', label: 'Infos' },
    { href: '/cagnotte', label: 'Cagnotte' },
    { href: '/sondage', label: 'Sondage' },
    { href: '/contact', label: 'Nous contacter' },
  ]

  // Ajout conditionnel du lien "Temoins"
  const links = isTemoin
    ? [...baseLinks, { href: '/temoin', label: 'Témoins' }]
    : baseLinks

  return (
    <nav className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`hover:underline hover:text-pink-600 transition ${
              pathname.startsWith(href) ? 'font-bold text-pink-600' : ''
            }`}
          >
            {label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="bg-white text-pink-600 px-3 py-1 rounded hover:bg-pink-100"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  )
}
