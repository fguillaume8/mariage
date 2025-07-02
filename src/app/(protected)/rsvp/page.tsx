import React, { Suspense } from 'react'
import RsvpClient from './RsvpClient'

export default function RsvpPage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <RsvpClient />
    </Suspense>
  )
}
