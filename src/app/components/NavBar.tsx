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

  if (isTemoin) links.push({ href: '/temoin', label: 'Témoins' })
  if (isMarie) links.push({ href: '/marie', label: 'Mariés' })

  return (
    <nav className="bg-[#fafafa] shadow-md border-2 border-[#b68542] rounded-md">
  <div className="max-w-8xl mx-auto px-4 py-3 flex justify-between items-center gap-8">
    <div className="flex flex-wrap gap-10">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-3 py-1 transition-all duration-300
            ${
              pathname.startsWith(href)
                ? 'bg-[#7287B1]/20 text-[#7287B1] font-semibold shadow-sm'
                : 'text-[#7287B1] hover:bg-[#b68542]/20 hover:text-[#b68542] shadow-sm hover:shadow-md'
            }`}
        >
          {label}
        </Link>
      ))}
    </div>

    <button
      onClick={handleLogout}
      className="ml-auto bg-[#b68542] text-white px-3 py-1 rounded-md hover:bg-[#7287B1] transition-colors duration-300 shadow-sm hover:shadow-md"
    >
      Déconnexion
    </button>
  </div>
</nav>

  )
}
