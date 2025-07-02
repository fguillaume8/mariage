'use client'

// Imports nécessaires
import { useState, useEffect } from 'react'
import { useInvite } from '@/app/context/InviteContext' // Contexte pour accéder aux ids
import { supabase } from '@/app/lib/supabaseClient' // Client Supabase


interface Invite {
  id: string
  nom: string
  prenom: string
  profil: string
  repas: string | null
  logement: boolean |null
  participation_samedi: boolean | null
  participation_retour: boolean | null
  message?: string | null
}

// Composant principal
export default function RsvpClient() {
  const { ids } = useInvite() // Récupère les ids du contexte
  const [invites, setInvites] = useState<Invite[]>([]) // Liste des invités
  const [reponses, setReponses] = useState<{ [id: string]: { participation_Samedi: boolean, participation_Retour: boolean, logement : boolean, repas: string, commentaire: string } }>({})
  const [loading, setLoading] = useState(false) // Chargement
  const [submitted, setSubmitted] = useState(false) // A-t-on déjà répondu ?


  // Charge les infos des invités à partir des ids
  useEffect(() => {
    async function fetchInvites() {
      if (!ids || ids.length === 0) return
      
      console.log('Récupération des invités avec ids:', ids)
      setLoading(true)

      // Requête Supabase : récupère tous les invités avec l'un des ids
      const { data } = await supabase.from('invites').select('*').in('id', ids)
      if (data) {
        setInvites(data)

        // Initialise les réponses avec des valeurs par défaut
        const initialState: typeof reponses = {}
        data.forEach(invite => {
          initialState[invite.id] = {
            participation_Samedi: invite.participation_Samedi ?? true,
            participation_Retour: invite.participation_Retour ?? true,
            logement : invite.logement ?? false,
            repas: invite.repas || '',
            commentaire: invite.commentaire || '',
          }
        })
        console.log('État initial des réponses :', initialState)
        setReponses(initialState)
      }

      setLoading(false)
    }

    fetchInvites()
  }, [ids])

  // Met à jour une réponse dans le state
const handleChange = (id: string, field: 'participation_Samedi' | 'participation_Retour'| 'logement' | 'repas' | 'commentaire', value: string | boolean) => {
    console.log(`Changement pour id=${id}, champ=${field}, valeur=`, value)
    setReponses(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      }
    }))
  }

  // Envoie les réponses vers Supabase
  const handleSubmit = async () => {
    setLoading(true)
    console.log('Soumission des réponses :', reponses)
    // Prépare les données à envoyer
    const updates = Object.entries(reponses).map(([id, data]) => ({
      id,
      participation_Samedi: data.participation_Samedi, // true ou false
      participation_Retour: data.participation_Retour, // true ou false
      logement : data.logement,
      repas: data.repas,
      commentaire: data.commentaire,
    }))

    // Envoie une requête de mise à jour par invité
    for (const update of updates) {
      console.log(`Mise à jour de l'invité ${update.id} avec :`, update)
      const { error } = await supabase.from('invites').update({
        participation_Samedi: update.participation_Samedi,
        participation_Retour: update.participation_Retour,
        repas: update.repas,
        logement : update.logement,
        commentaire: update.commentaire,
      }).eq('id', update.id)

      if (error) {
        console.error(`Erreur lors de la mise à jour de ${update.id} :`, error)
      } else {
        console.log(`Mise à jour réussie pour ${update.id}`)
      }
    }

    setSubmitted(true)
    setLoading(false)
  }

  // Affiche un message de chargement
  if (loading) return <p>Chargement...</p>

  // Affiche une confirmation si soumis
  if (submitted) return <p className="text-green-600 font-semibold">Merci pour votre réponse ! 💌</p>

  // Formulaire RSVP
  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Répondez à l&apos;invitation</h1>

      {invites.map(invite => (
        <div key={invite.id} className="mb-6 p-4 border rounded">
          <h2 className="font-semibold">{invite.prenom} {invite.nom}</h2>

          {/* Samedi */}
          <label className="block mt-2">
            <span className="mr-2">Présent(e) le samedi?</span>
            <select
              value={reponses[invite.id]?.participation_Samedi ? 'oui' : 'non'}
              onChange={(e) => handleChange(invite.id, 'participation_Samedi', e.target.value === 'oui')}
            >
              <option value="oui">Oui</option>
              <option value="non">Non</option>
            </select>
          </label>

          {/* Retour */}
          <label className="block mt-2">
            <span className="mr-2">Présent(e) au retour?</span>
            <select
              value={reponses[invite.id]?.participation_Retour ? 'oui' : 'non'}
              onChange={(e) => handleChange(invite.id, 'participation_Retour', e.target.value === 'oui')}
            >
              <option value="oui">Oui</option>
              <option value="non">Non</option>
            </select>
          </label>


          {invite.profil === 'logement_Oui' && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Besoin de logement ?</h3>

              <label className="block mt-2">
                <span className="mr-2">Souhaitez-vous être hébergé (du vendredi au dimanche) ?</span>
                <span className="mr-2">Possibilité de loger juste le samedi si il reste des places</span>
                <select
                  value={reponses[invite.id]?.logement ? 'oui' : 'non'}
                  onChange={(e) => handleChange(invite.id, 'logement', e.target.value === 'oui')}
                  
                >
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select>
              </label>

              {/* Tu peux ajouter d'autres questions spécifiques ici */}
            </div>
          )}

          {/* Choix repas */}
          <label className="block mt-2">
            <span>Choix du repas</span>
            <select
              value={reponses[invite.id]?.repas || ''}
              onChange={(e) => handleChange(invite.id, 'repas', e.target.value)}
              className="mt-1 p-2 border rounded w-full"            >
                <option value="">-- Choisir un repas --</option>
                <option value="viande">Viande</option>
                <option value="poisson">Poisson</option>
                <option value="vegetarien">Végétarien</option>
              </select>
          </label>

          {/* Message libre */}
          <label className="block mt-2">
            <span>Un petit message ?</span>
            <textarea
              value={reponses[invite.id]?.commentaire || ''}
              onChange={(e) => handleChange(invite.id, 'commentaire', e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            />
          </label>
        </div>
      ))}

      {/* Bouton d'envoi */}
      <button
        onClick={handleSubmit}
        className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
      >
        Envoyer les réponses
      </button>
    </div>
  )
}
