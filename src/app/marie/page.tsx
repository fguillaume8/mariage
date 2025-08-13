import { redirect } from 'next/navigation'

export default function Page({ searchParams }: any) {
  const token = searchParams?.token
  const SECRET_TOKEN = 'ton_token_secret'

  if (token !== SECRET_TOKEN) {
    redirect('/')
    return
  }

  redirect(`/marie/view?token=${token}`)
}
