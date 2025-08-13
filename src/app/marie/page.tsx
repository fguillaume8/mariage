import { redirect } from "next/navigation";

interface MariePageProps {
  params: object;
  searchParams: Record<string, string | string[]>;
}

export default function Page({ searchParams }: MariePageProps) {
  const token = Array.isArray(searchParams.token)
    ? searchParams.token[0]
    : searchParams.token;

  const SECRET_TOKEN = "ton_token_secret";

  if (!token || token !== SECRET_TOKEN) {
    redirect("/");
  } else {
    redirect(`/marie/view?token=${token}`);
  }
}
