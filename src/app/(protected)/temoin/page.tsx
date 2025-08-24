import React, { Suspense } from 'react'
import TemoinClient from './temoinClient'

export default function TemoinPage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <TemoinClient />
    </Suspense>
  )
}
