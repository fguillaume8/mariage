import React, { Suspense } from 'react'
import FaqClient from './InfoClient'

export default function InfoPage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <FaqClient />
    </Suspense>
  )
}
