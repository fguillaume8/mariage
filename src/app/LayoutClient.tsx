'use client'

import { usePathname } from 'next/navigation'
import NavBar from './components/NavBar'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      {pathname !== '/' && <NavBar />}
      <main>{children}</main>
    </>
  )
}
