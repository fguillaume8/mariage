/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect  } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './lib/supabaseClient'
import { Invite } from './lib/types'
import { useInvite } from './context/InviteContext'



export default function Home() {
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [erreur, setErreur] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [groupMembers, setGroupMembers] = useState<Invite[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { setIds } = useInvite()

  useEffect(() => {
    setMounted(true)
  }, [])



  if (!mounted) return null // ou un loader neutre

  

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setErreur('')

  console.log("handleSubmit appelé") // debug

  // --- Normalisation robuste ---
  function normalize(str: string) {
    return str
      .toLowerCase()
      .normalize('NFD')                 // décompose accents
      .replace(/[\u0300-\u036f]/g, '') // supprime accents
      .replace(/-/g, ' ')               // supprime tirets
      .replace(/’/g, "'")              // apostrophes typographiques
  }

  const nomNormalized = normalize(nom)
  const prenomNormalized = normalize(prenom)

  // Logs inputs normalisés
  console.log('Nom saisi normalisé :', nomNormalized)
  console.log('Prénom saisi normalisé :', prenomNormalized)

  // --- Récupération large côté DB ---
const { data: inviteData, error: inviteError } = await supabase
  .from('invites')
  .select()
  .ilike('nom', `%${nomNormalized.trim()}%`)
  .filter('prenom', 'ilike', `%${prenomNormalized.trim()}%`)

  console.log('Données brutes récupérées :', inviteData)

  if (inviteError || !inviteData || inviteData.length === 0) {
    setErreur("Aucun invité trouvé avec ce nom/prénom.")
    return
  }

  // --- Filtrage côté JS ---
  const filtered = inviteData.filter(invite => {
    const nomInv = normalize(invite.nom)
    const prenomInv = normalize(invite.prenom)
    console.log('Invite.nom normalisé :', nomInv, '| Invite.prenom normalisé :', prenomInv)
    
    // Ici on peut utiliser includes pour être plus tolérant
    return nomInv.includes(nomNormalized) && prenomInv.includes(prenomNormalized)
  })

  console.log('Invités filtrés :', filtered)

  if (filtered.length === 0) {
    setErreur("Aucun invité trouvé avec ce nom/prénom.")
    return
  }

  const invite = filtered[0]

  // --- Gestion du groupe ---
  if (invite.groupe_id) {
    const { data: groupData, error: groupError } = await supabase
      .from('invites')
      .select()
      .eq('groupe_id', invite.groupe_id)

    if (groupError || !groupData || groupData.length === 0) {
      setErreur("Erreur lors de la récupération du groupe.")
      return
    }

    if (groupData.length === 1) {
      const ids = [groupData[0].id]
      setIds(ids)
      router.push(`/infos?ids=${groupData[0].id}`)
    } else {
      setGroupMembers(groupData)
      setSelectedIds(groupData.map(m => m.id)) // tout coché par défaut
      setShowModal(true)
    }
  } else {
    // Pas de groupe, accès direct
    setIds([invite.id])
    router.push(`/infos?ids=${invite.id}`)
  }
}


  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleModalConfirm = () => {
    if (selectedIds.length === 0) {
      alert("Merci de sélectionner au moins une personne.")
      return
    }
    setShowModal(false)
    setIds(selectedIds)
    router.push(`/infos?ids=${selectedIds.join(',')}`)
  }

  return (
<main className="min-h-screen flex flex-col">
  {/* Fond avec bandes ocre */}

  <div className={`bg-white flex ${showModal ? "min-h-screen" : "max-h-screen" }`}
      >
    {/* Bande gauche */}
    <div className="hidden md:block w-[15%] bg-yellowfade border-r-2 border-[#b68542]" />

    {/* Contenu central (fond blanc) */}
<div className="flex-1 bg-white flex flex-col">
  {showModal ? (
    // --- Modal plein centre ---
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-xl p-6">
        <img
          src="/image/feuillage_acc.png"
          alt="Décoration feuillage"
          className="w-full mb-0 object-contain"
        />
        <div className="mb-0 bg-yellowfade rounded p-4">
          <h2 className="text-xl font-alike mb-4 text-powderblue text-center ">Vous répondez pour :</h2>
          <div className="max-h-60 overflow-auto mb-4">
            {groupMembers.map((member) => (
              <label
                key={member.id}
                className="flex items-center space-x-2 mb-2"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(member.id)}
                  onChange={() => toggleSelection(member.id)}
                  className="h-4 w-4 text-powderblue border-gray-300 rounded focus:ring-[#7287B1] h-5 w-5 accent-[#7287B1] rounded"
                />
                <span className='text-powderblue font-alike text-lg'>
                  {member.prenom} {member.nom}
                </span>
              </label>
            ))}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              onClick={handleModalConfirm}
              className="px-4 py-2 bg-[#7287B1] text-white rounded hover:bg-[#5d6d94]"
            >
              Valider
            </button>
          </div>
        </div>
        <img
          src="/image/feuillage_acc.png"
          alt="Décoration feuillage"
          className="w-full -mb-0 object-contain rotate-180 block"
        />
      </div>
    </div>
  ) : (
    <>
      {/* Première div : titre + logo */}
      <div className="flex w-full h-[35%] pt-10 items-center justify-between ">
        {/* Gauche */}
        <div className="flex flex-col justify-center w-full h-full">
          <h1 className="text-4xl text-[#7287B1] font-tan whitespace-nowrap text-center">
            ALICE &amp; GUILLAUME
          </h1>
          <h1 className="text-4xl text-[#7287B1] mt-2 font-tan ml-8 mt-8 text-center">
            29.08.2026
          </h1>
        </div>
        {/* Droite */}
        <div className="flex justify-end items-center h-full">
          <img
            src="image/Logo_200.png"
            alt="Logo mariage"
            className="h-150 w-auto object-contain opacity-90"
            
            
          />
        </div>
      </div>

      {/* Deuxième div : formulaire */}
      <div className="flex-1 flex justify-center items-center ">
        <div className="w-full max-w-xl space-y-4 ">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl space-y-4 p-6 "
          >
            <img
              src="/image/feuillage_acc.png"
              alt="Décoration feuillage"
              className="w-full mb-0 object-contain"
            />
            <input
              type="text"
              placeholder="PRENOM"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="w-full p-3 bg-yellowfade tracking-extra text-lg text-center text-powderblue font-alike focus:outline-none focus:ring-2 focus:ring-[#7287B1]"
              required
            />
            <input
              type="text"
              placeholder="NOM"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full p-3 bg-yellowfade tracking-extra text-lg text-center text-powderblue font-alike focus:outline-none focus:ring-2 focus:ring-[#7287B1]"
              required
            />
            <div className="flex flex-col">
              <button
                type="submit"
                className="w-full p-3 text-ocre tracking-extra bg-yellowfade text-lg text-center font-alike focus:outline-none focus:ring-2 focus:ring-[#7287B1]"
              >
                Accéder au formulaire
              </button>
              <img
                src="/image/feuillage_acc.png"
                alt="Décoration feuillage"
                className="w-full mt-0 object-contain rotate-180 block"
              />
            </div>
            {erreur && <p className="text-red-600">{erreur}</p>}
          </form>
        </div>
      </div>
    </>
  )}
</div>

    {/* Bande droite */}
    <div className="hidden md:block w-[15%] bg-yellowfade border-l-2 border-[#b68542]" />
  </div>
</main>
  )
}
