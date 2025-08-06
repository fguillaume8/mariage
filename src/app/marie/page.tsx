import { redirect } from 'next/navigation'

export default function Page({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const token = searchParams?.token

  const SECRET_TOKEN = 'ton_token_secret' // ← à personnaliser

  if (token !== SECRET_TOKEN) {
    redirect('/')
  }

  // Redirige vers la vraie page client protégée avec le token
  redirect(`/marie/view?token=${token}`)
}
