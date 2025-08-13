import { redirect } from "next/navigation";
import type { Metadata } from "next";

// Typage des props injectées par Next.js
type Props = {
  searchParams?: { [key: string]: string | string[] };
};

// Fonction pour générer dynamiquement les métadonnées
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const token = Array.isArray(searchParams?.token)
    ? searchParams.token[0]
    : searchParams?.token;

  // Tu peux personnaliser le titre selon le token
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

// Composant principal de la page
export default function Page({ searchParams }: Props) {
  const token = Array.isArray(searchParams?.token)
    ? searchParams.token[0]
    : searchParams?.token;

  const SECRET_TOKEN = "ton_token_secret";

  if (!token || token !== SECRET_TOKEN) {
    redirect("/");
  } else {
    redirect(`/marie/view?token=${token}`);
  }

  return null; // Rien à afficher, car on redirige immédiatement
}
