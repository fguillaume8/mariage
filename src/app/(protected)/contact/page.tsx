import React, { Suspense } from 'react'
import FaqClient from './contactClient'

export default function ContactPage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <FaqClient />
    </Suspense>
  )
}
