import React, { Suspense } from 'react'
import CagnotteClient from './CagnotteClient'

export default function CagnottePage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <CagnotteClient />
    </Suspense>
  )
}
