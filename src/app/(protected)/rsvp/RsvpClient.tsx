'use client'

// Imports nécessaires
import { useState, useEffect } from 'react'
import { useInvite } from '@/app/context/InviteContext' // Contexte pour accéder aux ids
import { supabase } from '@/app/lib/supabaseClient' // Client Supabase
import Image from 'next/image'

interface Invite {
  id: string
  nom: string
  prenom: string
  profil: string
  repas: string | null
  logement: boolean |null
  alerte_logement: boolean |null
  participation_samedi: boolean | null
  participation_retour: boolean | null
  message?: string | null
  mairie: boolean | null
}

// Composant principal
export default function RsvpClient() {
  const { ids } = useInvite() // Récupère les ids du contexte
  const [invites, setInvites] = useState<Invite[]>([]) // Liste des invités
  const [reponses, setReponses] = useState<{ [id: string]: { participation_Samedi: boolean, participation_Retour: boolean, logement : boolean, alerte_logement : boolean, repas: string, commentaire: string, mairie:boolean } }>({})
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
            alerte_logement : invite.alerte_logement ?? false,
            repas: invite.repas || '',
            commentaire: invite.commentaire || '',
            mairie: invite.mairie ?? false,
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
const handleChange = (id: string, field: 'participation_Samedi' | 'participation_Retour'| 'logement' |'alerte_logement'| 'repas' | 'commentaire'| 'mairie', value: string | boolean) => {
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
      alerte_logement : data.alerte_logement,
      repas: data.repas,
      commentaire: data.commentaire,
      mairie: data.mairie,
    }))

    // Envoie une requête de mise à jour par invité
    for (const update of updates) {
      console.log(`Mise à jour de l'invité ${update.id} avec :`, update)
      const { error } = await supabase.from('invites').update({
        participation_Samedi: update.participation_Samedi,
        participation_Retour: update.participation_Retour,
        repas: update.repas,
        logement : update.logement,
        alerte_logement : update.alerte_logement,
        commentaire: update.commentaire,
        mairie: update.mairie,
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
<div className="flex flex-1 min-h-[calc(100vh-57px)] w-full bg-[#f7f4eb]">
  {/* Colonne gauche : RSVP */}
  <div className="w-1/2 h-screen-64px  flex justify-center items-center p-5">
    <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto
                    p-8 rounded-2xl shadow-2xl 
                    bg-gradient-to-br from-[#f7f4eb]/30 via-[#b68542]/20 to-powderblue/20
                    border border-powderblue/20
                     ">
      <h1 className="text-3xl font-bold text-center text-powderblue mb-6 drop-shadow-md">
        Répondez à l&apos;invitation
      </h1>

      {invites.map(invite => (
        <div key={invite.id} className="mb-6 p-4 rounded-xl bg-white border border-powderblue/20 shadow-inner transition-all duration-300">
          <h2 className="font-semibold text-lg text-powderblue">{invite.prenom} {invite.nom}</h2>

          {/* Samedi */}
          <label className="block mt-3 flex items-center justify-between">
            <span className="font-medium text-powderblue">Serez-vous des nôtres le samedi ?</span>
            <select
              value={reponses[invite.id]?.participation_Samedi ? 'oui' : 'non'}
              onChange={(e) => handleChange(invite.id, 'participation_Samedi', e.target.value === 'oui')}
              className="border border-powderblue/40 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#b68542]/50 bg-white/60  w-24"
            >
              <option value="oui">Oui</option>
              <option value="non">Non</option>
            </select>
          </label>

          {/* Retour */}
          <label className="block mt-3 flex items-center justify-between">
            <span className="font-medium text-powderblue">Serez-vous présent(e) également pour le retour ?</span>
            <select
              value={reponses[invite.id]?.participation_Retour ? 'oui' : 'non'}
              onChange={(e) => handleChange(invite.id, 'participation_Retour', e.target.value === 'oui')}
              className="border border-powderblue/40 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#b68542]/50 bg-white/60  w-24"
            >
              <option value="oui">Oui</option>
              <option value="non">Non</option>
            </select>
          </label>

          {/*Mairie*/}
                    {['All_in', 'All_out', 'Demi pension','Marie','Témoin'].includes(invite.profil) && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2 text-powderblue">Présence à la mairie</h3>
              <span className="mr-2 font-medium text-powderblue">
                  La cérémonie civile aura lieu le <b>28 août 2026 à 15h30 à Savenay</b>.
                </span>
              <label className="block mt-3 flex items-center justify-between">
                <span className="mr-2 font-medium text-powderblue">
                  Pensez-vous pouvoir être présent(e) ?
                </span>
              <select
                  value={reponses[invite.id]?.mairie ? 'oui' : 'non'}
                  onChange={(e) => handleChange(invite.id, 'mairie', e.target.value === 'oui')}
                  className="border border-powderblue/40 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#b68542]/50 bg-white/60 w-24"
                >
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select>
              </label>
            </div>
          )}

          {['All in', 'Marie', 'Temoin', 'ami'].includes(invite.profil) && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2 text-powderblue">Besoin de logement ?</h3>
              <span className="mr-2 font-medium text-powderblue">Nous privilégions les invités restant <b>du vendredi au dimanche</b> (80 €),
                                    mais s’il reste des disponibilités, un hébergement uniquement pour la nuit du samedi (50 €) pourra être proposé.</span>
              <label className="block mt-3 flex items-center justify-between">
                <span className="mr-2 font-medium text-powderblue">Souhaitez-vous un logement du vendredi au dimanche ? </span>
                <select
                  value={reponses[invite.id]?.logement ? 'oui' : 'non'}
                  onChange={(e) => handleChange(invite.id, 'logement', e.target.value === 'oui')}
                  className="border border-powderblue/40 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#b68542]/50 bg-white/60 w-24"
                >
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select>
              </label>
            </div>
          )}
          {(['demi_pension', 'cantine'].includes(invite.profil) || 
            (['All in', 'Marie'].includes(invite.profil) && reponses[invite.id]?.logement === false)) && (
              <div className="mt-4">
                <label className="block mt-3 flex items-center justify-between">
                  <span className="mr-2 font-medium text-powderblue">
                    Je souhaite être averti s’il reste des logements pour le samedi soir 
                  </span>
                  <input
                    type="checkbox"
                    checked={!!reponses[invite.id]?.alerte_logement}
                    onChange={(e) => handleChange(invite.id, 'alerte_logement', e.target.checked)}
                    className="h-5 w-5 accent-[#b68542] border border-powderblue/40 rounded focus:ring-2 focus:ring-[#b68542]/50"
                  />
                </label>
              </div>
          )}

          {/* Choix repas */}
          <label className="block mt-3">
            <h3 className="font-semibold mb-2 text-powderblue">Choix du repas</h3>
            <select
              value={reponses[invite.id]?.repas || ''}
              onChange={(e) => handleChange(invite.id, 'repas', e.target.value)}
              className="mt-1 p-2 border border-powderblue/40 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#b68542]/50 bg-white/60 "
            >
              <option value="">-- Choisir un repas --</option>
              <option value="viande">Viande (canard)</option>
              <option value="vegetarien">Végétarien</option>
            </select>
          </label>

          {/* Message libre */}
          <label className="block mt-3">
            <h3 className="font-semibold mb-2 text-powderblue">Allergies ou petit mot pour nous ?</h3>
            <span className="font-medium text-powderblue">
              Une allergie, une préférence, ou simplement un petit mot pour nous ?<br />
              Dites-le ici !
            </span>
            <textarea
              value={reponses[invite.id]?.commentaire || ''}
              onChange={(e) => handleChange(invite.id, 'commentaire', e.target.value)}
              className="w-full mt-1 p-2 border border-powderblue/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b68542]/50 bg-white/60 "
              rows={3}
            />
          </label>
        </div>
      ))}

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-[#b68542] hover:bg-powderblue text-white font-semibold px-6 py-2 rounded-full mt-4 shadow-lg transition-all duration-300 hover:shadow-2xl"
        >
          Envoyer les réponses
        </button>
      </div>
    </div>
  </div>

  {/* Colonne droite : Image */}
  <div className="flex-1 relative">
    <Image
      src="/image/mariage_pierre.jpg"
      alt="Image de fond"
      fill
      priority
      className="object-cover"
    />
  </div>
</div>



  )
}
