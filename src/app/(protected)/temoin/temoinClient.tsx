'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'


interface Question {
  id_question: number
  question: string
}

interface ReponseAvecInvite {
  id_invite: string
  id_question: number
  reponse: 'elle' | 'lui'
  invites: {
    id: string
    nom: string
    prenom: string
    profil: string
  }
}

interface Ligne {
  id: string
  nom: string
  prenom: string
  reponses: Record<number, 'elle' | 'lui'>
}

export default function PageTemoin() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [lignes, setLignes] = useState<Ligne[]>([])
  const [open, setOpen] = useState(true) // état d’ouverture de l’onglet

  useEffect(() => {
    const fetchData = async () => {
      const { data: questionData } = await supabase
        .from('questionellelui')
        .select('*')
        .order('id_question', { ascending: true })

      setQuestions(questionData || [])

      const { data: reponsesData } = await supabase
        .from('reponseellelui')
        .select('id_invite, id_question, reponse, invites(id, nom, prenom, profil)')
        .not('id_invite', 'is', null)

      const filtres = (reponsesData as unknown as ReponseAvecInvite[]) || []

      const mapLignes: Record<string, Ligne> = {}

      filtres.forEach(r => {
        const id = r.id_invite
        const invite = r.invites

        if (!mapLignes[id]) {
          mapLignes[id] = {
            id,
            nom: invite?.nom || '',
            prenom: invite?.prenom || '',
            reponses: {},
          }
        }

        mapLignes[id].reponses[r.id_question] = r.reponse
      })

      setLignes(Object.values(mapLignes))
    }

    fetchData()
  }, [])


  // 🟦 EXPORT CSV ----------------------------
  const exportCSV = () => {
    if (lignes.length === 0) return

    const headers = ['Nom', 'Prénom', ...questions.map(q => q.question)]
    const rows = lignes.map(ligne => [
      ligne.nom,
      ligne.prenom,
      ...questions.map(q => ligne.reponses[q.id_question] || '')
    ])

    const csvContent =
      [headers, ...rows]
        .map(row =>
          row
            .map(value => `"${value}"`) // éviter problèmes de virgules
            .join(',')
        )
        .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'reponses_sondage.csv'
    link.click()
  }

  // -----------------------------------------

  return (
    <div className="p-6">

      {/* 🟧 Onglet / Collapsible */}
      <div className="border rounded-lg shadow">
        <button
          onClick={() => setOpen(prev => !prev)}
          className="w-full text-left px-4 py-3 bg-powderblue text-white font-semibold rounded-t-lg"
        >
          {open ? '▼' : '▶'} Réponses au Sondage
        </button>

        {open && (
          <div className="p-4">

            {/* Bouton d'export */}
            <button
              onClick={exportCSV}
              className="mb-4 px-4 py-2 bg-[#b68542] text-white rounded hover:bg-[#a67330]"
            >
              Exporter en CSV
            </button>

            {/* Tableau */}
            {lignes.length === 0 ? (
              <p>Aucune réponse pour le moment.</p>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Nom</th>
                      <th className="border px-4 py-2">Prénom</th>
                      {questions.map(q => (
                        <th key={q.id_question} className="border px-4 py-2">
                          {q.question}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lignes.map(ligne => (
                      <tr key={ligne.id} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{ligne.nom}</td>
                        <td className="border px-4 py-2">{ligne.prenom}</td>
                        {questions.map(q => (
                          <td key={q.id_question} className="border px-4 py-2 text-center">
                            {ligne.reponses[q.id_question] === 'elle' && 'Elle'}
                            {ligne.reponses[q.id_question] === 'lui' && 'Lui'}
                            {!ligne.reponses[q.id_question] && '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
