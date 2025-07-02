import React, { Suspense } from 'react'
import ProtectedLayoutClient from './ProtectedLayoutClient'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <ProtectedLayoutClient>{children}</ProtectedLayoutClient>
    </Suspense>
  )
}
