import React, { Suspense } from 'react'
import TemoinClient from './marieClient.tsx'

export default function MariePage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <TemoinClient />
    </Suspense>
  )
}
