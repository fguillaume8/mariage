// src/app/marie/page.tsx
import { redirect } from "next/navigation";

export default function Page({ searchParams }) {
  const token = searchParams.token;
  const SECRET_TOKEN = "ton_token_secret";

  if (!token || token !== SECRET_TOKEN) {
    redirect("/");
  } else {
    redirect(`/marie/view?token=${token}`);
  }
}