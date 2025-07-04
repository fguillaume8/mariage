import React, { Suspense } from 'react'
import SondageClient from './SondageClient'


export default function SondagePage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <SondageClient />
    </Suspense>
  )
}
