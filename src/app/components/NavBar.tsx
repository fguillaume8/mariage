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

  
  const [menuOpen, setMenuOpen] = useState(false)
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
      <nav className="bg-[#f7f4eb] border-2 border-[#b68542] rounded-md shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">


        {/* Desktop Links */}
        <div className="hidden md:flex flex-wrap gap-6 items-center">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1 rounded-md transition-colors duration-300
                ${
                  pathname.startsWith(href)
                    ? 'bg-[#7287B1]/20 text-[#7287B1] font-semibold'
                    : 'text-[#7287B1] hover:bg-[#b68542]/20 hover:text-[#b68542]'
                }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="ml-4 bg-[#b68542] text-white px-4 py-1 rounded-md hover:bg-[#7287B1] transition-colors duration-300"
          >
            Déconnexion
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#7287B1] focus:outline-none px-2 py-1 border border-[#7287B1]/50 rounded-md"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 py-3 flex flex-col gap-3 border-t border-[#b68542]">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-1 rounded-md transition-colors duration-300
                ${
                  pathname.startsWith(href)
                    ? 'bg-[#7287B1]/20 text-[#7287B1] font-semibold'
                    : 'text-[#7287B1] hover:bg-[#b68542]/20 hover:text-[#b68542]'
                }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => { handleLogout(); setMenuOpen(false) }}
            className="bg-[#b68542] text-white px-4 py-1 rounded-md hover:bg-[#7287B1] transition-colors duration-300"
          >
            Déconnexion
          </button>
        </div>
      )}
    </nav>

  )
}
