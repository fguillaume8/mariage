'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const pathname = usePathname()

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
              pathname === href ? 'font-bold text-pink-600' : ''
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
