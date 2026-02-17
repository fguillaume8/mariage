'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { saveAs } from 'file-saver';

interface Invite {
  id: string;
  nom: string;
  prenom: string;
  participation_Samedi: boolean | null;
  participation_Retour: boolean | null;
  repas: string | null;
  logement: boolean;
  alerte_logement : boolean;
  commentaire?: string;
  profil?: string;
  updated_at: string;
  mairie?: boolean;
}

export default function ClientView() {
  const [invites, setInvites] = useState<Invite[] | null>(null);
  const [filtreNom, setFiltreNom] = useState('');
  const [filtreProfil, setFiltreProfil] = useState('');
  const [showStats, setShowStats] = useState(true);
  const [showNonRepondus, setShowNonRepondus] = useState(true);
  const [showTableau, setShowTableau] = useState(true);

  const [filtreSamedi, setFiltreSamedi] = useState('tous');
  const [filtreRetour, setFiltreRetour] = useState('tous');
  const [filtreLogement, setFiltreLogement] = useState('tous');
  const [filtreRepas, setFiltreRepas] = useState('tous');
  const [filtreAlerte, setFiltreAlerte] = useState('tous');
  const [filtreUpdated, setFiltreUpdated] = useState('tous');
  const [filtreMairie, setFiltreMairie] = useState('tous');

  // 'asc' pour croissant, 'desc' pour décroissant, null pour aucun tri
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('invites').select('*');
      if (!error) setInvites(data as Invite[]);
    };
    fetchData();
  }, []);

  if (!invites) return <div className="p-6">Chargement...</div>;

  const repondus = invites.filter(
    (invite) =>
      invite.participation_Samedi !== null ||
      invite.participation_Retour !== null ||
      invite.repas !== null
  );



// 1. On filtre d'abord
const filtered = repondus.filter((invite) => {
  const matchNom = `${invite.prenom} ${invite.nom}`.toLowerCase().includes(filtreNom.toLowerCase());
  const matchProfil = invite.profil?.toLowerCase().includes(filtreProfil.toLowerCase()) ?? true;
  
  const matchSamedi = filtreSamedi === 'tous' ? true : String(invite.participation_Samedi) === filtreSamedi;
  const matchRetour = filtreRetour === 'tous' ? true : String(invite.participation_Retour) === filtreRetour;
  const matchRepas = filtreRepas === 'tous' ? true : invite.repas === filtreRepas;
  const matchLogement = filtreLogement === 'tous' ? true : String(invite.logement) === filtreLogement;
  const matchAlerte = filtreAlerte === 'tous' ? true : String(invite.alerte_logement) === filtreAlerte; 
  const matchMairie = filtreMairie === 'tous' ? true : String(invite.mairie) === filtreMairie;


  const matchUpdated = filtreUpdated === 'tous'
    ? true
    : (filtreUpdated === 'recent' 
        ? new Date(invite.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
        : new Date(invite.updated_at) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

  return matchNom && matchProfil && matchSamedi && matchRetour && matchLogement && matchRepas && matchAlerte && matchMairie && matchUpdated;
});

// 2. On trie ensuite (on garde le nom 'invitesFiltres' pour ne pas casser ton JSX plus bas)
const invitesFiltres = [...filtered].sort((a, b) => {
  if (!sortOrder) return 0;
  
  const dateA = new Date(a.updated_at).getTime();
  const dateB = new Date(b.updated_at).getTime();

  return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
});

  const nonRepondus = invites.filter(
    (invite) =>
      invite.participation_Samedi === null &&
      invite.participation_Retour === null &&
      invite.repas === null
  );

  const total = invites.length;
  const totalRepondus = repondus.length;
  const tauxReponse = total ? Math.round((totalRepondus / total) * 100) : 0;
  const totalSamedi = invites.filter((i) => i.participation_Samedi).length;
  const totalRetour = invites.filter((i) => i.participation_Retour).length;
  const totalLogement = invites.filter((i) => i.logement).length;
  const totaltAlerteLogement = invites.filter((i) => i.alerte_logement).length;
  const totalMairie = invites.filter((i) => i.mairie).length;


  // 🍽️ Répartition des repas
  const repasCounts = repondus.reduce<Record<string, number>>((acc, i) => {
    const key = (i.repas ?? "Non renseigné").trim();
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const repasSorted = Object.entries(repasCounts).sort((a, b) => b[1] - a[1]);

  // 🕒 Dates de réponses
  const datesReponse = repondus
    .map((i) => i.updated_at)
    .filter(Boolean)
    .map((s) => new Date(s as string));

  const firstResponse = datesReponse.length
    ? new Date(Math.min(...datesReponse.map((d) => d.getTime())))
    : null;

  const lastResponse = datesReponse.length
    ? new Date(Math.max(...datesReponse.map((d) => d.getTime())))
    : null;

  // 📈 Réponses par jour (simple)
  const repliesPerDay = datesReponse.reduce<Record<string, number>>(
    (acc, d) => {
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const repliesPerDaySorted = Object.entries(repliesPerDay).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  function exportCSV(data: Invite[], filename = 'export.csv') {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data
      .map((row) =>
        Object.values(row)
          .map((value) =>
            typeof value === 'string' && value.includes(',')
              ? `"${value.replace(/"/g, '""')}"`
              : value
          )
          .join(',')
      )
      .join('\n');

    const csvContent = [headers, rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10 space-y-8">
      <h1 className="text-3xl font-bold mb-4">👰‍♀️🤵‍♂️ Résumé des réponses RSVP</h1>

      {/* 🧮 Statistiques */}
      <div>
        <button
          onClick={() => setShowStats(!showStats)}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 mb-2"
        >
          {showStats ? '▼ Masquer' : '▶️ Afficher'} les statistiques
        </button>
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow text-sm">
              <p><strong>🎉 Total invités :</strong> {total}</p>
              <p><strong>📝 Réponses :</strong> {totalRepondus} / {total} ({tauxReponse}%)</p>
              <p><strong>✅ Présents samedi :</strong> {totalSamedi}</p>
              <p><strong>🏁 Présents au retour :</strong> {totalRetour}</p>
              <p><strong>🛏️✅ Validé logement :</strong> {totalLogement}</p>
              <p><strong>🛏️❓ Alerte logement :</strong> {totaltAlerteLogement}</p>
              <p><strong>🏛️ Mairie :</strong> {totalMairie}</p>
            </div>

            <div className="bg-white p-4 rounded shadow text-sm">
              <p className="font-semibold mb-2">🍽️ Répartition des repas</p>
              <ul className="space-y-1">
                {repasSorted.map(([repas, n]) => (
                  <li key={repas} className="flex justify-between">
                    <span>{repas}</span>
                    <span className="font-medium">{n}</span>
                  </li>
                ))}
              </ul>
            </div>
                        <div className="bg-white p-4 rounded shadow text-sm">
              <p className="font-semibold mb-2">🕒 Temporalité des réponses</p>
              <p>
                <strong>Première réponse :</strong>{" "}
                {firstResponse ? firstResponse.toLocaleString("fr-FR") : "—"}
              </p>
              <p>
                <strong>Dernière réponse :</strong>{" "}
                {lastResponse ? lastResponse.toLocaleString("fr-FR") : "—"}
              </p>

              <hr className="my-2" />
              <p className="font-semibold mb-2">📈 Réponses par jour</p>
              <div className="max-h-32 overflow-auto border rounded p-2">
                {repliesPerDaySorted.length ? (
                  <ul className="space-y-1">
                    {repliesPerDaySorted.map(([day, n]) => (
                      <li key={day} className="flex justify-between">
                        <span>{day}</span>
                        <span className="font-medium">{n}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    Pas de date de réponse enregistrée.
                  </p>
                )}
              </div>
            </div>
            

          </div>

        )}
      </div>

      {/* ❌ Non répondus */}
      <div>
        <button
          onClick={() => setShowNonRepondus(!showNonRepondus)}
          className="bg-yellow-300 px-4 py-2 rounded hover:bg-yellow-400 mb-2"
        >
          {showNonRepondus ? '▼ Masquer' : '▶️ Afficher'} les non-répondants
        </button>
        {showNonRepondus && (
          <>
            {nonRepondus.length > 0 ? (
              <div>
                <button
                  onClick={() => exportCSV(nonRepondus, 'non_repondus.csv')}
                  className="mb-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  📤 Exporter les non-répondants
                </button>
                <table className="w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2 text-left">Prénom</th>
                      <th className="border p-2 text-left">Nom</th>
                      <th className="border p-2 text-left">Profil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nonRepondus.map((invite) => (
                      <tr key={invite.id}>
                        <td className="border p-2">{invite.prenom}</td>
                        <td className="border p-2">{invite.nom}</td>
                        <td className="border p-2">{invite.profil || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-green-600">Tous les invités ont répondu ! 🎉</p>
            )}
          </>
        )}
      </div>

      {/* ✅ Réponses */}
      <div>
        <button
          onClick={() => setShowTableau(!showTableau)}
          className="bg-pink-200 px-4 py-2 rounded hover:bg-pink-300 mb-2"
        >
          {showTableau ? '▼ Masquer' : '▶️ Afficher'} le tableau des réponses
        </button>
        {showTableau && (
          <>
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="🔍 Filtrer par nom"
                className="p-2 border rounded w-full sm:w-1/3"
                value={filtreNom}
                onChange={(e) => setFiltreNom(e.target.value)}
              />
              <input
                type="text"
                placeholder="🔍 Filtrer par profil"
                className="p-2 border rounded w-full sm:w-1/3"
                value={filtreProfil}
                onChange={(e) => setFiltreProfil(e.target.value)}
              />
              <button
                onClick={() => exportCSV(invitesFiltres, 'reponses_filtrees.csv')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                📤 Exporter les réponses
              </button>
            </div>

            <table className="min-w-full bg-white shadow rounded overflow-hidden text-sm">
              <thead className="bg-pink-100 text-left">
                <tr>
                  <th className="px-4 py-2">Nom</th>
                  <th className="px-4 py-3 border-b">
                    <span className="block mb-1 text-pink-800">Samedi</span>
                    <select 
                      className="w-full p-1 font-normal border rounded text-xs"
                      value={filtreSamedi}
                      onChange={(e) => setFiltreSamedi(e.target.value)}
                    >
                      <option value="tous">Tous</option>
                      <option value="true">✅ Oui</option>
                      <option value="false">❌ Non</option>
                      <option value="null">❓ ?</option>
                    </select>
                  </th>
                  <th className="px-4 py-3 border-b">
                    <span className="block mb-1 text-pink-800">Retour</span>
                    <select 
                      className="w-full p-1 font-normal border rounded text-xs"
                      value={filtreRetour}
                      onChange={(e) => setFiltreRetour(e.target.value)}
                    >
                      <option value="tous">Tous</option>
                      <option value="true">✅ Oui</option>
                      <option value="false">❌ Non</option>
                    </select>
                  </th>
                  <th className="px-4 py-3 border-b">
                    <span className="block mb-1 text-pink-800">Repas</span>
                    <select 
                      className="w-full p-1 font-normal border rounded text-xs"
                      value={filtreRepas}
                      onChange={(e) => setFiltreRepas(e.target.value)}
                    >
                      <option value="tous">Tous</option>
                      <option value="viande">viande</option>
                      <option value="vegetarien">vegetarien</option>
                    </select>
                  </th>
                  <th className="px-4 py-3 border-b">
                    <span className="block mb-1 text-pink-800">Logement</span>
                    <select 
                      className="w-full p-1 font-normal border rounded text-xs"
                      value={filtreLogement}
                      onChange={(e) => setFiltreLogement(e.target.value)}
                    >
                      <option value="tous">Tous</option>
                      <option value="true">🛏️ Oui</option>
                      <option value="false">Non</option>
                    </select>
                  </th>
                  <th className="px-4 py-3 border-b">
                    <span className="block mb-1 text-pink-800">Alerte logement</span>
                    <select 
                      className="w-full p-1 font-normal border rounded text-xs"
                      value={filtreAlerte}
                      onChange={(e) => setFiltreAlerte(e.target.value)}
                    >
                      <option value="tous">Tous</option>
                      <option value="true">✅ Oui</option>
                      <option value="false">❌ Non</option>
                    </select>
                  </th>
                                    <th className="px-4 py-3 border-b">
                    <span className="block mb-1 text-pink-800">Mairie</span>
                    <select 
                      className="w-full p-1 font-normal border rounded text-xs"
                      value={filtreMairie}
                      onChange={(e) => setFiltreMairie(e.target.value)}
                    >
                      <option value="tous">Tous</option>
                      <option value="true">✅ Oui</option>
                      <option value="false">❌ Non</option>
                    </select>
                  </th>
                  <th className="px-4 py-2">Message</th>
                  <th className="px-4 py-2">Profil</th>
                  <th 
                      className="px-4 py-3 border-b cursor-pointer hover:bg-pink-200 transition-colors group"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      title="Cliquer pour trier par date"
                    >
                    <span className="block mb-1 text-pink-800">Répondu</span>
                    <span className="text-xs">{sortOrder === 'asc' ? '🔼' : sortOrder === 'desc' ? '🔽' : '↕️'}</span>
                    <select 
                      className="w-full p-1 font-normal border rounded text-xs"
                      value={filtreUpdated}
                      onChange={(e) => setFiltreUpdated(e.target.value)}
                      onClick={(e) => e.stopPropagation()} // Important : évite de trier quand on change le filtre
                    >
                      <option value="tous">Tous</option>
                      <option value="recent">Récent (7 jours)</option>
                      <option value="ancien">Ancien</option>
                    </select>
                  </th>
                </tr>
              </thead>
              <tbody>
                {invitesFiltres.map((invite) => (
                  <tr key={invite.id} className="border-t">
                    <td className="px-4 py-2">{invite.prenom} {invite.nom}</td>
                    <td className="px-4 py-2">
                      {invite.participation_Samedi === null ? '❓' : invite.participation_Samedi ? '✅' : '❌'}
                    </td>
                    <td className="px-4 py-2">
                      {invite.participation_Retour === null ? '❓' : invite.participation_Retour ? '✅' : '❌'}
                    </td>
                    <td className="px-4 py-2">{invite.repas || '—'}</td>
                    <td className="px-4 py-2">{invite.logement ? '🛏️' : '—'}</td>
                    <td className="px-4 py-2">{invite.alerte_logement ? '❓' : '—'}</td>
                    <td className="px-4 py-2">{invite.mairie ? '🏛️' : '—'}</td>
                    <td className="px-4 py-2">{invite.commentaire || '—'}</td>
                    <td className="px-4 py-2">{invite.profil || ''}</td>
                    <td className="px-4 py-2">{invite.updated_at ? new Date(invite.updated_at).toLocaleDateString() : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
