import React, { Suspense } from 'react'
import FaqClient from './FaqClient'

export default function CagnottePage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <FaqClient />
    </Suspense>
  )
}
