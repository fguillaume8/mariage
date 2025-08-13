// src/app/marie/page.tsx
import { redirect } from 'next/navigation'

export default function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | undefined>
}) {
  const token = searchParams?.token
  const SECRET_TOKEN = 'ton_token_secret'

  // Redirection si le token est absent ou incorrect
  if (!token || token !== SECRET_TOKEN) {
    redirect('/')
    return
  }

  // Redirection si le token est valide
  redirect(`/marie/view?token=${token}`)
}
