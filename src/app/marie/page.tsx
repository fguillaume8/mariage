import { redirect } from "next/navigation";
import type { Metadata } from "next";

// 🔹 Fonction pour générer les métadonnées dynamiques
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const token = Array.isArray(resolvedSearchParams.token)
    ? resolvedSearchParams.token[0]
    : resolvedSearchParams.token;

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
export default async function Page({
  searchParams, 
}: {
  searchParams: Promise<{ [key: string]: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const token = Array.isArray(resolvedSearchParams.token)
    ? resolvedSearchParams.token[0]
    : resolvedSearchParams.token;

  const SECRET_TOKEN = "ton_token_secret";

  if (!token || token !== SECRET_TOKEN) {
    redirect("/");
  } else {
    redirect(`/marie/view?token=${token}`);
  }

  return null; // Rien à afficher, car on redirige immédiatement
}
