// Rendu dynamique pour éviter toute tentative de pré-rendu statique
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import ClientView from './ClientView';

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const raw = searchParams.token;
  const token = Array.isArray(raw) ? raw[0] : raw;
  const SECRET_TOKEN = 'ton_token_secret';

  // ✅ Validation du token côté serveur (pas de hook client nécessaire)
  if (!token || token !== SECRET_TOKEN) {
    redirect('/');
  }

  // On peut passer le token en prop si tu en as besoin, sinon inutile
  return (
    <Suspense fallback={<div className="p-6">Chargement…</div>}>
      <ClientView />
    </Suspense>
  );
}
