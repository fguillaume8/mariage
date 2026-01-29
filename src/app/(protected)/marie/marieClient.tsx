"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { saveAs } from "file-saver";

interface Invite {
  id: string;
  nom: string;
  prenom: string;
  participation_Samedi: boolean | null;
  participation_Retour: boolean | null;
  repas: string | null;
  logement: boolean;
  commentaire?: string;
  groupe?: string;
  updated_at?: string | null;
}

export default function ClientView() {
  const [invites, setInvites] = useState<Invite[] | null>(null);
  const [filtreNom, setFiltreNom] = useState("");
  const [filtreGroupe, setFiltreGroupe] = useState("");
  const [showStats, setShowStats] = useState(true);
  const [showNonRepondus, setShowNonRepondus] = useState(true);
  const [showTableau, setShowTableau] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("invites")
        .select("*")
        .order("updated_at", { ascending: false, nullsFirst: false });
      if (!error) setInvites(data as Invite[]);
    };
    fetchData();
  }, []);

  if (!invites) return <div className="p-6">Chargement...</div>;

  const isRepondu = (i: Invite) =>
    i.participation_Samedi !== null ||
    i.participation_Retour !== null ||
    i.repas !== null ||
    !!i.updated_at;

  const repondus = invites.filter(isRepondu);
  const nonRepondus = invites.filter((i) => !isRepondu(i));

  const total = invites.length;
  const totalRepondus = repondus.length;
  const tauxReponse = total ? Math.round((totalRepondus / total) * 100) : 0;

  const totalSamediOui = invites.filter(
    (i) => i.participation_Samedi === true,
  ).length;
  const totalSamediNon = invites.filter(
    (i) => i.participation_Samedi === false,
  ).length;
  const totalRetourOui = invites.filter(
    (i) => i.participation_Retour === true,
  ).length;
  const totalRetourNon = invites.filter(
    (i) => i.participation_Retour === false,
  ).length;

  const totalLogement = invites.filter((i) => i.logement).length;

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

  const invitesFiltres = repondus.filter((invite) => {
    const matchNom = `${invite.prenom} ${invite.nom}`
      .toLowerCase()
      .includes(filtreNom.toLowerCase());
    const matchGroupe = filtreGroupe
      ? invite.groupe?.toLowerCase().includes(filtreGroupe.toLowerCase())
      : true;
    return matchNom && matchGroupe;
  });

  function exportCSV(data: Invite[], filename = "export.csv") {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]).join(",");
    const rows = data
      .map((row) =>
        Object.values(row)
          .map((value) =>
            typeof value === "string" && value.includes(",")
              ? `"${value.replace(/"/g, '""')}"`
              : value,
          )
          .join(","),
      )
      .join("\n");

    const csvContent = [headers, rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
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
          {showStats ? "▼ Masquer" : "▶️ Afficher"} les statistiques
        </button>
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow text-sm">
              <p>
                <strong>🎉 Total invités :</strong> {total}
              </p>
              <p>
                <strong>📝 Réponses :</strong> {totalRepondus} / {total} (
                {tauxReponse}%)
              </p>
              <hr className="my-2" />
              <p>
                <strong>✅ Samedi (oui/non) :</strong> {totalSamediOui} /{" "}
                {totalSamediNon}
              </p>
              <p>
                <strong>🏁 Retour (oui/non) :</strong> {totalRetourOui} /{" "}
                {totalRetourNon}
              </p>
              <p>
                <strong>🛏️ Besoin logement :</strong> {totalLogement}
              </p>
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
          {showNonRepondus ? "▼ Masquer" : "▶️ Afficher"} les non-répondants
        </button>
        {showNonRepondus && (
          <>
            {nonRepondus.length > 0 ? (
              <div>
                <button
                  onClick={() => exportCSV(nonRepondus, "non_repondus.csv")}
                  className="mb-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  📤 Exporter les non-répondants
                </button>
                <table className="w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2 text-left">Prénom</th>
                      <th className="border p-2 text-left">Nom</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nonRepondus.map((invite) => (
                      <tr key={invite.id}>
                        <td className="border p-2">{invite.prenom}</td>
                        <td className="border p-2">{invite.nom}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-green-600">
                Tous les invités ont répondu ! 🎉
              </p>
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
          {showTableau ? "▼ Masquer" : "▶️ Afficher"} le tableau des réponses
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

              <button
                onClick={() =>
                  exportCSV(invitesFiltres, "reponses_filtrees.csv")
                }
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                📤 Exporter les réponses
              </button>
            </div>

            <table className="min-w-full bg-white shadow rounded overflow-hidden text-sm">
              <thead className="bg-pink-100 text-left">
                <tr>
                  <th className="px-4 py-2">Nom</th>
                  <th className="px-4 py-2">Samedi</th>
                  <th className="px-4 py-2">Retour</th>
                  <th className="px-4 py-2">Repas</th>
                  <th className="px-4 py-2">Logement</th>
                  <th className="px-4 py-2">Répondu le</th>
                  <th className="px-4 py-2">Message</th>
                </tr>
              </thead>
              <tbody>
                {invitesFiltres.map((invite) => (
                  <tr key={invite.id} className="border-t">
                    <td className="px-4 py-2">
                      {invite.prenom} {invite.nom}
                    </td>
                    <td className="px-4 py-2">
                      {invite.participation_Samedi === null
                        ? "❓"
                        : invite.participation_Samedi
                          ? "✅"
                          : "❌"}
                    </td>
                    <td className="px-4 py-2">
                      {invite.participation_Retour === null
                        ? "❓"
                        : invite.participation_Retour
                          ? "✅"
                          : "❌"}
                    </td>
                    <td className="px-4 py-2">{invite.repas || "—"}</td>
                    <td className="px-4 py-2">
                      {invite.logement ? "🛏️" : "—"}
                    </td>
                    <td className="px-4 py-2">
                      {invite.updated_at
                        ? new Date(invite.updated_at).toLocaleString("fr-FR")
                        : "—"}
                    </td>
                    <td className="px-4 py-2">{invite.commentaire || "—"}</td>
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
