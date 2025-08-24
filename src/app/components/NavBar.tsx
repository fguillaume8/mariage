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
  const [isMarie, setIsMarie] = useState(false)

  useEffect(() => {
    const checkProfil = async () => {
      if (!ids || ids.length === 0) return

      const { data, error } = await supabase
        .from('invites')
        .select('profil')
        .in('id', ids)

      if (!error && data) {
        setIsTemoin(data.some((inv) => inv.profil === 'temoin'))
        setIsMarie(data.some((inv) => inv.profil === 'Nous'))
      }
    }

    checkProfil()
  }, [ids])

  const handleLogout = () => {
    setIds([])
    sessionStorage.removeItem('inviteIds')
    router.push('/')
  }

  // Liens de base
  const links = [
    { href: '/rsvp', label: 'RSVP' },
    { href: '/faq', label: 'FAQ' },
    { href: '/infos', label: 'Infos' },
    { href: '/cagnotte', label: 'Cagnotte' },
    { href: '/sondage', label: 'Sondage' },
    { href: '/contact', label: 'Nous contacter' },
  ]

  // Ajout conditionnel
  if (isTemoin) {
    links.push({ href: '/temoin', label: 'Témoins' })
  }
  if (isMarie) {
    links.push({ href: '/marie', label: 'Mariés' })
  }

  return (
    <nav className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`hover:underline hover:text-[#7287B1] transition ${
              pathname.startsWith(href) ? 'font-bold text-[#7287B1]' : ''
            }`}
          >
            {label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
           className="bg-white text-[#7287B1] px-3 py-1 rounded hover:[#7287B1]/10"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  )
}
