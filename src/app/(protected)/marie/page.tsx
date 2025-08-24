import React, { Suspense } from 'react'
import MarieClient from './marieClient'

export default function MariePage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <MarieClient />
    </Suspense>
  )
}
