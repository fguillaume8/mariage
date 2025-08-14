import { redirect } from "next/navigation";
import type { Metadata } from "next";

// 🔹 Fonction pour générer les métadonnées dynamiques
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const token = Array.isArray(searchParams.token)
    ? searchParams.token[0]
    : searchParams.token;

  if (token === "ton_token_secret") {
    return {
      title: "Accès sécurisé à Marie",
      description: "Bienvenue sur la page privée de Marie.",
    };
  }

  return {
    title: "Accès refusé",
    description: "Vous devez fournir un token valide.",
  };
}

// 🔹 Composant principal de la page
export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = Array.isArray(searchParams.token)
    ? searchParams.token[0]
    : searchParams.token;

  const SECRET_TOKEN = "ton_token_secret";

  if (!token || token !== SECRET_TOKEN) {
    redirect("/");
  } else {
    redirect(`/marie/view?token=${token}`);
  }

  return null; // Rien à afficher, car on redirige immédiatement
}
