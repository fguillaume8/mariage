'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'


/*interface Invite {
  id: string
  nom: string
  prenom: string
}*/

interface Question {
  id_question: number
  question: string
}

/*interface Reponse {
  id_invite: string
  id_question: number
  reponse: 'elle' | 'lui'
}*/

interface Ligne {
  id: string
  nom: string
  prenom: string
  reponses: Record<number, 'elle' | 'lui'>
}

export default function PageTemoin() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [lignes, setLignes] = useState<Ligne[]>([])

  useEffect(() => {
    const fetchData = async () => {
      // 1. Récupération des questions
      const { data: questionData, error: errorQ } = await supabase
        .from('questionellelui')
        .select('*')
        .order('id_question', { ascending: true })

      if (errorQ) {
        console.error('Erreur chargement questions:', errorQ)
        return
      }

      setQuestions(questionData || [])

      // 2. Récupération des réponses avec infos invités (profil = 'temoin')
      const { data: reponsesData, error: errorR } = await supabase
        .from('reponseellelui')
        .select('id_invite, id_question, reponse, invites(id, nom, prenom, profil)')
        .not('id_invite', 'is', null)

      if (errorR) {
        console.error('Erreur chargement réponses:', errorR)
        return
      }

      // 3. Filtrage des réponses par témoins uniquement
      const filtres = reponsesData || []

      // 4. Groupement par invité
      const mapLignes: Record<string, Ligne> = {}

      filtres.forEach(r => {
        const id = r.id_invite
        if (!mapLignes[id]) {
          mapLignes[id] = {
            id,
            nom: r.invites.nom,
            prenom: r.invites.prenom,
            reponses: {},
          }
        }
        mapLignes[id].reponses[r.id_question] = r.reponse
      })

      setLignes(Object.values(mapLignes))
    }

    fetchData()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Réponses au Sondage</h1>
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
  )
}
