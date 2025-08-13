import { redirect } from 'next/navigation'

interface PageProps {
  searchParams?: { [key: string]: string | undefined }
}

export default function Page({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const token = searchParams?.token
  const SECRET_TOKEN = 'ton_token_secret'

  if (token !== SECRET_TOKEN) {
    redirect('/') // redirection côté serveur
  }

  redirect(`/marie/view?token=${token}`) // redirection côté serveur
}
