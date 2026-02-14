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

  const invitesFiltres = repondus.filter((invite) => {
    // 1. Filtre texte (Nom et Groupe)
    const matchNom = `${invite.prenom} ${invite.nom}`.toLowerCase().includes(filtreNom.toLowerCase());
    const matchProfil = invite.profil?.toLowerCase().includes(filtreProfil.toLowerCase()) ?? true;
    
    // 2. Filtres Booléens (Samedi, Retour, Logement)
    // On compare la valeur sélectionnée avec la valeur réelle ou sa conversion en string
    const matchSamedi = filtreSamedi === 'tous' 
      ? true 
      : String(invite.participation_Samedi) === filtreSamedi;

    const matchRetour = filtreRetour === 'tous' 
      ? true 
      : String(invite.participation_Retour) === filtreRetour;

    const matchRepas = filtreRepas === 'tous' 
      ? true 
      : invite.repas === filtreRepas;

    const matchLogement = filtreLogement === 'tous' 
      ? true 
      : String(invite.logement) === filtreLogement;

    const matchAlerte = filtreAlerte === 'tous' 
      ? true 
      : String(invite.alerte_logement) === filtreAlerte;

    return matchNom && matchProfil && matchSamedi && matchRetour && matchLogement && matchRepas && matchAlerte;
  });

  const nonRepondus = invites.filter(
    (invite) =>
      invite.participation_Samedi === null &&
      invite.participation_Retour === null &&
      invite.repas === null
  );

  const total = invites.length;
  const totalSamedi = invites.filter((i) => i.participation_Samedi).length;
  const totalRetour = invites.filter((i) => i.participation_Retour).length;
  const totalLogement = invites.filter((i) => i.logement).length;
  const totaltAlerteLogement = invites.filter((i) => i.alerte_logement).length;

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
          <div className="bg-white p-4 rounded shadow text-sm">
            <p><strong>🎉 Total invités :</strong> {total}</p>
            <p><strong>✅ Présents samedi :</strong> {totalSamedi}</p>
            <p><strong>🏁 Présents au retour :</strong> {totalRetour}</p>
            <p><strong>🛏️✅ Validé logement :</strong> {totalLogement}</p>
            <p><strong>🛏️❓ Alerte logement :</strong> {totaltAlerteLogement}</p>
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
                  <th className="px-4 py-2">Message</th>
                  <th className="px-4 py-2">Profil</th>
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
                    <td className="px-4 py-2">{invite.commentaire || '—'}</td>
                    <td className="px-4 py-2">{invite.profil || ''}</td>
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
