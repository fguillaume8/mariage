import { redirect } from 'next/navigation'

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams
  const token = params.token

  const SECRET_TOKEN = 'ton_token_secret' // ← à personnaliser

  if (token !== SECRET_TOKEN) {
    redirect('/')
  }

  // Redirige vers la vraie page client protégée avec le token
  redirect(`/marie/view?token=${token}`)
}
