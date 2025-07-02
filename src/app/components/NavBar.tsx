'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useInvite } from '../context/InviteContext'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const { setIds } = useInvite()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    setIds([])                        // Vide le contexte
    sessionStorage.removeItem('inviteIds') // Vide le sessionStorage
    router.push('/')                    // Redirection accueil
  }

  const links = [
    { href: '/rsvp', label: 'RSVP' },
    { href: '/faq', label: 'FAQ' },
    { href: '/infos', label: 'Infos' },
    { href: '/cagnotte', label: 'Cagnotte' },
    { href: '/sondage', label: 'Sondage' },
  ]

  return (
    <nav className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
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
